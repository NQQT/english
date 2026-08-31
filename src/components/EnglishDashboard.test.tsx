// Integration tests for the worksheet PLUGINS, mounted in the framework host.
//
// This test file lives with the dashboard host: it exercises the whole
// worksheet family end-to-end through the real dashboard, exactly as a
// teacher uses it. (Each worksheet's generator has its own pinned unit tests
// next to the plugin file; this suite covers the composed behaviour.)
//
// Verifies the layout and its behaviour:
//   - grade selector (framework header component) switches grade and, for
//     unimplemented grades, shows the "coming soon" notice in the rail plus
//     the empty canvas state;
//   - the unified plugin rail (left) switches the generated sheet; it shows
//     icon + label only — NO per-type "questions per page" count badges
//     (removed: the page stepper + Randomize make document size fully
//     user-driven);
//   - page-count STEPPER (toolbar, −/n/+) is an unbounded number: type or
//     increment to 3, 4, 12... pages — generated A4 sheets are numbered
//     continuously (Year 1 sight: 18 per page, page 2 starts at id 19,
//     page 3 at id 37 — streams pinned in SightWordsWorksheet.test.ts);
//   - "Randomize" re-rolls the seed in place: same page count, new problems
//     (pinned refresh=1 / refresh=2 streams below, seedFrom([grade, type,
//     refresh]));
//   - zoom control switches the preview between Fit / 50% / 75% / 100%;
//   - tracing worksheets (Prep only): Letter Tracing (A–Z model + faded
//     copies), Word Tracing (letter + beginning word) and Number Tracing
//     (0–9) generate the fixed ordered sheets pinned in the plugin tests;
//   - Print opens the browser-NATIVE print dialog IMMEDIATELY (plain
//     window.print(), no in-app review screen — the preview canvas IS the
//     print preview). The screen-hidden .print-doc tree is what the dialog
//     paginates: exactly one A4 block per worksheet page, so a 5-page
//     worksheet is 5 pages in the dialog (the @media print rules in
//     app.css un-clip the shell so every page flows onto its own sheet).
//
// All expected sheet contents match the deterministic generator outputs
// pinned in the per-plugin test files (Year 1 + Sight & Real Words is the
// default selection, refresh 0).
//
// PLUGIN LOADING ORDER: the dashboard renders FIRST (shell + the first
// plugin, Sight & Real Words, in the initial paint); the remaining plugins
// are then loaded ONE BY ONE after mount (framework/loader.ts). Tests that
// touch a non-default rail entry therefore AWAIT that entry (findByRole)
// before clicking it; `allVisiblePluginsLoaded()` below awaits the last
// Year-1 entry when an assertion needs the FULL rail.

import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { EnglishDashboard } from './EnglishDashboard';
import { PLUGINS } from '../plugins';
import { DASHBOARD_FRAMEWORK, getGradeConfig, type DashboardPlugin } from '../framework';

// Generous timeout for loader awaits: the loads are chained macrotasks (one
// per plugin), so a cold test run under load can exceed the 1s default.
const LOAD_TIMEOUT = 5000;

// The plugin list, built through the same pipeline usePluginLoader uses.
const WORKSHEETS: DashboardPlugin[] = PLUGINS.map((load) => load(DASHBOARD_FRAMEWORK));

// Await the END of the progressive load. The rail shows a "Loading…" hint
// while factories are still pending (framework/loader.ts) — it disappears
// only when EVERY factory has been loaded, which makes it the deterministic
// "all plugins loaded" signal (rail buttons can't be used for this: the last
// factories — syllables/tense/tracing — are Year-2/Prep-only and stay hidden
// on the Year 1 rail even after loading).
function allPluginsLoaded() {
    return waitFor(
        () => expect(screen.queryByText('Loading…')).toBeNull(),
        { timeout: LOAD_TIMEOUT }
    );
}

// Each test renders a fresh dashboard (initially on Year 1 + Sight & Real
// Words, 1 page, refresh 0).
beforeEach(() => {
    render(<EnglishDashboard />);
});

// Tear down the DOM between tests so previews don't leak across cases.
afterEach(() => {
    cleanup();
});

// Find a grade pill by its accessible short label (grade 3 => "3", prep => "P").
function gradeRadio(name: string) {
    return screen.getByRole('radio', { name });
}

// The toolbar Print button — with no in-app review screen, this is the ONLY
// Print affordance; it fires window.print() immediately.
function toolbarPrint() {
    return screen.getByTestId('toolbar-print');
}

// The toolbar Randomize button (re-rolls the seed, preserving page count).
function randomizeButton() {
    return screen.getByTestId('toolbar-randomize');
}

// The problem row prints as "id." (ProblemIndex) directly followed by the
// prompt text (blank "__" spans render as empty fill-in lines, so their
// underscores never appear in textContent). The concatenation is exact —
// e.g. row 1 of the default Year 1 sight sheet reads
// "1.Which is a real word? (jaa, table, boa, mooa)" — and each row's id
// prefix makes it uniquely addressable inside a page's text.
function text(el: Element | null | undefined) {
    return el?.textContent ?? '';
}

// Pinned rows (see SightWordsWorksheet.test.ts, seedFrom([grade, type, 0])):
//   Year 1 sight — page 1 rows 1..2, page 2 head (id 19), page 3 head (id 37)
//   Year 2 sight — page 1 row 1   |  Prep sight — page 1 row 1
//   Randomize streams: refresh 1 rows 1..2, refresh 2 rows 1..2
const g1sightRow1 = '1.Which is a real word? (jaa, table, boa, mooa)';
const g1sightRow2 = '2.Which is a real word? (pia, housa, rat, shira)';
const g1sightP2row1 = '19.Which is a real word? (bira, caa, cua, purple)';
const g1sightP3row1 = '37.Which is a real word? (doa, trea, top, plana)';
const g1sightP2prompt = 'Which is a real word? (bira, caa, cua, purple)';
const g2sightRow1 = '1.Which is a real word? (chickea, doa, butterfly, housa)';
const g0sightRow1 = '1.Which is a real word? (doa, pig, mooa, jaa)';
const r1sightRow1 = '1.Which is a real word? (trea, raa, boa, pig)';
const r1sightRow2 = '2.Which is a real word? (night, rabbia, lea, nigha)';
const r2sightRow1 = '1.Which is a real word? (rat, boa, lea, trea)';
const r2sightRow2 = '2.Which is a real word? (caa, poa, faa, grass)';
// Pinned PREP TRACING rows (fixed ordered sheets — no seed involved, see the
// tracing plugin tests): a trace row's visible text is the id + solid model +
// faded copies concatenated WITHOUT separator spaces between elements, e.g.
// row 1 of letter tracing reads "1." + "A" + "A A A" = "1.AA A A".
const g0letterRow1 = '1.AA A A';
const g0letterRow26 = '26.ZZ Z Z';
const g0wordRow1 = '1.Aapple';
const g0wordRow24 = '24.Xxylophone';
const g0numRow1 = '1.00 0 0';
const g0numRow9 = '9.88 8 8';
const g0numRow10 = '10.99 9 9';

describe('EnglishDashboard — layout', () => {
    it('renders the app title and year-1 sight-word preview by default', async () => {
        // Wait for the progressive plugin load to finish before judging the
        // full rail (the first plugin — Sight & Real Words — is available
        // immediately; the rest stream in one by one).
        await allPluginsLoaded();
        // App title in the header (the "Aa" brand chip is aria-hidden).
        expect(screen.getByText('English Sheets')).toBeDefined();
        // Grade selector present (P + 1..12 = 13 radios; 1 is selected by default).
        expect(gradeRadio('1').getAttribute('aria-checked')).toBe('true');
        // Left rail offers the Year 1 catalogue; Syllables/Past Tense are Y2-only.
        expect(screen.getByRole('button', { name: 'Sight & Real Words' })).toBeDefined();
        expect(screen.getByRole('button', { name: 'Blending' })).toBeDefined();
        expect(screen.queryByRole('button', { name: 'Syllables' })).toBeNull();
        expect(screen.queryByRole('button', { name: 'Past Tense' })).toBeNull();
        // Right canvas shows the preview viewport of the (Year 1, Sight) sheet.
        expect(screen.getByTestId('sheet-preview')).toBeDefined();
    });

    it('shows the exact first problems of the Year 1 sight-word sheet in the preview', () => {
        // Year 1 sight, rows 1-2 (see SightWordsWorksheet.test.ts pins).
        const page = text(screen.getByTestId('sheet-preview-page1'));
        expect(page).toContain(g1sightRow1);
        expect(page).toContain(g1sightRow2);
    });

    it('the type rail lists icon + label only (no per-type count badges)', async () => {
        // Full rail first (progressive one-by-one plugin loading).
        await allPluginsLoaded();
        // The rail text is exactly the heading followed by each Year 1 button's
        // RAW "icon glyph + label" (adjacent spans, no whitespace). Pinned
        // exactly — so any extra text (e.g. a per-type "questions per page"
        // count badge leaking back in) breaks this assertion.
        // Note: unlike the maths icon set, the English Twin Words icon is the
        // digit '2' — a legitimate glyph, which is why a blanket "no digit in
        // rail" check doesn't apply here.
        const heading = screen.getByRole('heading', { name: 'English Type' });
        const rail = heading.parentElement!; // <Sidebar> wraps heading + buttons
        // The framework rail = the registered plugins' entries, grade-gated in
        // registration order (PluginSidebarHost). Each button renders its icon
        // chip + label as adjacent spans, so the raw text is icon + label.
        // (WORKSHEETS = the factory list built through the loader pipeline.)
        const expected =
            'English Type' +
            WORKSHEETS.filter((p) => {
                const offered = p.isOffered;
                return offered ? offered(getGradeConfig(1)) : true;
            })
                .map((p) => (p.entries[0].icon ?? '') + p.entries[0].label)
                .join('');
        expect(text(rail)).toBe(expected);
        // The Blending button renders exactly icon glyph + label (raw
        // "abBlending"), i.e. no count badge text anywhere in the button.
        const blending = screen.getByRole('button', { name: 'Blending' });
        expect(text(blending)).toBe('abBlending');
    });
});

describe('EnglishDashboard — english type selection (left)', () => {
    it('switches the sheet when a different english type is chosen', async () => {
        // Start on Sight & Real Words.
        expect(text(screen.getByTestId('sheet-preview-page1'))).toContain(g1sightRow1);

        // Pick Blending (awaited — plugins load one by one after mount).
        // Row 1 is "Finish the word: l e __" — the trailing blank renders as
        // an empty fill-in line (no underscores in text).
        fireEvent.click(
            await screen.findByRole('button', { name: 'Blending' }, { timeout: LOAD_TIMEOUT })
        );

        // Preview now reflects the (Year 1, Blending) sheet. Row 1 is
        // "Finish the word: __ e g" — the LEADING blank renders as an empty
        // fill-in span (no underscores in text), so the raw text is
        // "…word: " + blank + " e g" = a double space before "e g".
        expect(text(screen.getByTestId('sheet-preview-page1'))).toContain('1.Finish the word:  e g');
        // Toolbar title updates to the new type (+ pinned tier-2 scope label).
        expect(screen.getByTestId('toolbar-title').textContent).toBe('Year 1 — Blending');
    });

    it('Sentence Building switches the sheet to scrambled prose lines', async () => {
        // Awaited — plugins load one by one after the dashboard renders.
        fireEvent.click(
            await screen.findByRole('button', { name: 'Sentence Building' }, { timeout: LOAD_TIMEOUT })
        );
        const pageText = text(screen.getByTestId('sheet-preview-page1'));
        // Year 1 sentence, row 1 (pins: shown scramble "(skips, Sue)", the
        // blanks print as empty fill-in lines).
        expect(pageText).toContain('1.Put the words in the correct order');
        expect(pageText).toContain('(skips, Sue)');
        expect(screen.getByTestId('toolbar-title').textContent).toBe('Year 1 — Sentence Building');
    });

    it('Rhyming Words switches the sheet to rhyme choices', async () => {
        // Awaited — plugins load one by one after the dashboard renders.
        fireEvent.click(
            await screen.findByRole('button', { name: 'Rhyming Words' }, { timeout: LOAD_TIMEOUT })
        );
        const pageText = text(screen.getByTestId('sheet-preview-page1'));
        // Year 1 rhyme, row 1 (pin: base "rat", options fat/leaf/hand).
        expect(pageText).toContain('1.Which word rhymes with "rat"?');
        expect(pageText).toContain('(fat, leaf, hand)');
        expect(screen.getByTestId('toolbar-title').textContent).toBe('Year 1 — Rhyming Words');
    });

    it('Grade 2 offers the Past Tense worksheet (Y2-only type)', async () => {
        fireEvent.click(gradeRadio('2'));
        // Year 2 rail includes the tricky-set types (awaited — plugins load
        // one by one after the dashboard renders; the factory loads
        // regardless of grade, the gate only controls visibility).
        const pastTense = await screen.findByRole(
            'button',
            { name: 'Past Tense' },
            { timeout: LOAD_TIMEOUT }
        );

        // Pick it; the sheet matches the pinned Year 2 tense stream (row 1
        // base verb "point" -> "pointed").
        fireEvent.click(pastTense);
        expect(screen.getByTestId('toolbar-title').textContent).toBe('Year 2 — Past Tense');
        expect(text(screen.getByTestId('sheet-preview-page1'))).toContain('1.What is the past tense of "point"?');
    });
});

describe('EnglishDashboard — grade selection (top-right)', () => {
    it('switches to Year 2 and reflects the extended word set', () => {
        // The grade/type selection is preserved where offered, so the default
        // Sight type re-generates on the tier-3 (Y2) word set.
        fireEvent.click(gradeRadio('2'));
        // Year 2 sight first row (pin: distractors from the extended set).
        expect(text(screen.getByTestId('sheet-preview-page1'))).toContain(g2sightRow1);
        expect(screen.getByTestId('toolbar-title').textContent).toBe('Year 2 — Sight & Real Words');
    });

    it('switches to Prep (grade 0) and falls back to a Prep-offered type', () => {
        fireEvent.click(gradeRadio('P'));
        // Sight & Real Words IS offered in Prep, so the selection survives and
        // the sheet re-generates on the tier-1 word set (pin: row 1).
        expect(text(screen.getByTestId('sheet-preview-page1'))).toContain(g0sightRow1);
        expect(screen.getByTestId('toolbar-title').textContent).toBe('Prep — Sight & Real Words');
    });

    it('shows a coming-soon placeholder for an unimplemented grade (Year 3)', () => {
        fireEvent.click(gradeRadio('3'));
        // Left rail shows the "coming soon" notice.
        expect(screen.getByText(/coming soon/i)).toBeDefined();
        // Right canvas shows the empty state instead of a preview.
        expect(screen.getByTestId('empty-state')).toBeDefined();
        expect(screen.queryByTestId('sheet-preview')).toBeNull();
    });
});

describe('EnglishDashboard — tracing worksheets (Prep only)', () => {
    it('the default Year 1 rail does not offer the tracing types', async () => {
        // Full rail first (progressive one-by-one plugin loading) so the
        // absence is meaningful, not just "not loaded yet".
        await allPluginsLoaded();
        // Tracing is Prep-only: none of the three buttons exist on the Y1 rail.
        expect(screen.queryByRole('button', { name: 'Letter Tracing' })).toBeNull();
        expect(screen.queryByRole('button', { name: 'Word Tracing' })).toBeNull();
        expect(screen.queryByRole('button', { name: 'Number Tracing' })).toBeNull();
    });

    it('Prep offers the three tracing types in the rail', async () => {
        fireEvent.click(gradeRadio('P'));
        // Awaited — the tracing factories are the LAST in the loading order.
        await screen.findByRole('button', { name: 'Number Tracing' }, { timeout: LOAD_TIMEOUT });
        expect(screen.getByRole('button', { name: 'Letter Tracing' })).toBeDefined();
        expect(screen.getByRole('button', { name: 'Word Tracing' })).toBeDefined();
        expect(screen.getByRole('button', { name: 'Number Tracing' })).toBeDefined();
    });

    it('Letter Tracing previews the A–Z model + faded-copy rows', async () => {
        fireEvent.click(gradeRadio('P'));
        // Awaited — plugins load one by one after the dashboard renders.
        fireEvent.click(
            await screen.findByRole('button', { name: 'Letter Tracing' }, { timeout: LOAD_TIMEOUT })
        );
        // Title + pinned tier scope subtitle (see LetterTracingWorksheet.test.ts).
        expect(screen.getByTestId('toolbar-title').textContent).toBe('Prep — Letter Tracing');
        const page = text(screen.getByTestId('sheet-preview-page1'));
        // First and last alphabet rows (rows are the id + model + 3 copies).
        expect(page).toContain(g0letterRow1);
        expect(page).toContain(g0letterRow26);
    });

    it('Word Tracing previews the letter + beginning-word rows', async () => {
        fireEvent.click(gradeRadio('P'));
        // Awaited — plugins load one by one after the dashboard renders.
        fireEvent.click(
            await screen.findByRole('button', { name: 'Word Tracing' }, { timeout: LOAD_TIMEOUT })
        );
        expect(screen.getByTestId('toolbar-title').textContent).toBe('Prep — Word Tracing');
        const page = text(screen.getByTestId('sheet-preview-page1'));
        // Row 1 = model "A" + faded "apple"; row 24 = "X" + "xylophone".
        expect(page).toContain(g0wordRow1);
        expect(page).toContain(g0wordRow24);
    });

    it('Number Tracing previews the 0–9 model + faded-copy rows', async () => {
        fireEvent.click(gradeRadio('P'));
        // Awaited — plugins load one by one after the dashboard renders.
        fireEvent.click(
            await screen.findByRole('button', { name: 'Number Tracing' }, { timeout: LOAD_TIMEOUT })
        );
        expect(screen.getByTestId('toolbar-title').textContent).toBe('Prep — Number Tracing');
        const page = text(screen.getByTestId('sheet-preview-page1'));
        expect(page).toContain(g0numRow1);
        expect(page).toContain(g0numRow9);
        expect(page).toContain(g0numRow10);
    });
});

describe('EnglishDashboard — page count (unbounded −/n/+ stepper)', () => {
    it('defaults to a single page; decrement is blocked at the minimum', () => {
        // The stepper's number field starts at 1.
        const input = screen.getByTestId('page-count') as HTMLInputElement;
        expect(input.value).toBe('1');
        expect(input.min).toBe('1');
        // Decrement is disabled at the minimum of 1 page.
        expect(screen.getByRole('button', { name: 'Decrease pages' }).getAttribute('aria-disabled')).toBe(
            'true'
        );
        // Exactly one rendered page shell, and no "Page x of y" badge.
        expect(screen.getByTestId('sheet-preview-page1')).toBeDefined();
        expect(screen.queryByTestId('sheet-preview-page2')).toBeNull();
        expect(screen.getByTestId('sheet-preview').textContent).not.toContain('Page 1 of');
    });

    it('increments the page count with the + button (no upper limit)', () => {
        // 1 -> 2 -> 3 via two increments.
        fireEvent.click(screen.getByRole('button', { name: 'Increase pages' }));
        fireEvent.click(screen.getByRole('button', { name: 'Increase pages' }));
        expect((screen.getByTestId('page-count') as HTMLInputElement).value).toBe('3');
        // Decrement is now enabled.
        expect(screen.getByRole('button', { name: 'Decrease pages' }).getAttribute('aria-disabled')).toBeNull();

        // Three page shells, each independently addressable in tests.
        const preview = screen.getByTestId('sheet-preview');
        expect(screen.getByTestId('sheet-preview-page1')).toBeDefined();
        expect(screen.getByTestId('sheet-preview-page2')).toBeDefined();
        expect(screen.getByTestId('sheet-preview-page3')).toBeDefined();
        expect(screen.queryByTestId('sheet-preview-page4')).toBeNull();

        // Page 1 keeps the original first rows; pages 2 and 3 continue the
        // exact deterministic stream pinned in SightWordsWorksheet.test.ts
        // (sight is 18 rows/page, so page 2 starts at id 19 and page 3 at
        // id 37).
        expect(text(screen.getByTestId('sheet-preview-page1'))).toContain(g1sightRow1);
        expect(text(screen.getByTestId('sheet-preview-page2'))).toContain(g1sightP2row1);
        expect(text(screen.getByTestId('sheet-preview-page3'))).toContain(g1sightP3row1);
        // Multi-page documents label every page (badge on screen, footer in print).
        expect(preview.textContent).toContain('Page 1 of 3');
        expect(preview.textContent).toContain('Page 3 of 3');
        // The toolbar title is unaffected by the page count.
        expect(screen.getByTestId('toolbar-title').textContent).toBe('Year 1 — Sight & Real Words');
    });

    it('types a large page count — generation is unbounded, not a fixed toggle set', () => {
        // Type 12 pages straight into the number field.
        fireEvent.change(screen.getByTestId('page-count'), { target: { value: '12' } });
        expect((screen.getByTestId('page-count') as HTMLInputElement).value).toBe('12');
        // All 12 A4 shells exist; page 12 is the last one.
        expect(screen.getByTestId('sheet-preview-page12')).toBeDefined();
        expect(screen.queryByTestId('sheet-preview-page13')).toBeNull();
        const preview = screen.getByTestId('sheet-preview');
        expect(preview.textContent).toContain('Page 12 of 12');
    });

    it('switches back to fewer pages via the field; the stream is unchanged', () => {
        // Up to 3, then back down to 1 — same sheet, same first rows.
        fireEvent.change(screen.getByTestId('page-count'), { target: { value: '3' } });
        expect(screen.getByTestId('sheet-preview-page3')).toBeDefined();
        fireEvent.change(screen.getByTestId('page-count'), { target: { value: '1' } });
        expect(screen.queryByTestId('sheet-preview-page2')).toBeNull();
        expect(text(screen.getByTestId('sheet-preview-page1'))).toContain(g1sightRow1);
    });
});

describe('EnglishDashboard — randomize (re-roll the seed in place)', () => {
    it('regenerates the sheet with a new seed, preserving the page count', () => {
        // Initial (refresh 0) deterministic sheet pinned in
        // SightWordsWorksheet.test.ts.
        const page1 = () => text(screen.getByTestId('sheet-preview-page1'));
        expect(page1()).toContain(g1sightRow1);
        expect(page1()).toContain(g1sightRow2);
        const before = page1();

        // Pin 4 pages first so we can prove Randomize preserves the count.
        fireEvent.change(screen.getByTestId('page-count'), { target: { value: '4' } });
        expect(screen.getByTestId('sheet-preview-page4')).toBeDefined();

        // refresh=1: seedFrom([1, 'sight', 1]) — pinned stream.
        fireEvent.click(randomizeButton());
        expect(page1()).toContain(r1sightRow1);
        expect(page1()).toContain(r1sightRow2);
        // The document was actually regenerated, not re-rendered unchanged.
        expect(page1()).not.toBe(before);

        // refresh=2: seedFrom([1, 'sight', 2]) — yet another pinned stream.
        fireEvent.click(randomizeButton());
        expect(page1()).toContain(r2sightRow1);
        expect(page1()).toContain(r2sightRow2);

        // The page count chosen on the stepper survives both re-rolls.
        expect((screen.getByTestId('page-count') as HTMLInputElement).value).toBe('4');
        expect(screen.getByTestId('sheet-preview-page4')).toBeDefined();
        expect(screen.getByTestId('sheet-preview').textContent).toContain('Page 4 of 4');
    });
});

describe('EnglishDashboard — zoom control', () => {
    it('defaults to Fit and switches to a fixed percentage zoom', () => {
        const fit = screen.getByRole('button', { name: 'Preview zoom: Fit' });
        const hundred = screen.getByRole('button', { name: 'Preview zoom: 100%' });
        expect(fit.getAttribute('aria-pressed')).toBe('true');
        expect(hundred.getAttribute('aria-pressed')).toBe('false');

        fireEvent.click(hundred);
        expect(hundred.getAttribute('aria-pressed')).toBe('true');
        // Selecting a fixed zoom deselects Fit (single selection).
        expect(screen.getByRole('button', { name: 'Preview zoom: Fit' }).getAttribute('aria-pressed')).toBe(
            'false'
        );
    });
});

describe('EnglishDashboard — print flow (native dialog, preview IS the preview)', () => {
    it('Print fires window.print immediately and leaves the content view in place', () => {
        // window.print is a jsdom no-op — replace it with a spy we can assert on.
        const printSpy = vi.fn();
        window.print = printSpy;

        // No in-app review screen exists any more: the preview canvas (with
        // toolbar, stepper and zoom dock) is the print preview.
        expect(screen.getByTestId('sheet-preview')).toBeDefined();

        // The toolbar Print opens the browser-native dialog IMMEDIATELY —
        // exactly one window.print() call, with nothing rendered in between.
        fireEvent.click(toolbarPrint());
        expect(printSpy).toHaveBeenCalledTimes(1);

        // The content view is untouched: same canvas, same pages, same
        // stepper, and the zoom dock is still pinned to it.
        expect(screen.getByTestId('sheet-preview')).toBeDefined();
        expect(screen.getByTestId('sheet-preview-page1')).toBeDefined();
        expect(screen.getByTestId('page-stepper')).toBeDefined();
        expect(screen.getByRole('button', { name: 'Preview zoom: Fit' })).toBeDefined();
    });

    it('retitles the tab to the worksheet title while the dialog is open, then restores it', () => {
        // Capture the document title at the moment window.print() runs — that
        // is the title a PDF saved from the native dialog is named after.
        let titleDuringPrint = '';
        window.print = vi.fn(() => {
            titleDuringPrint = document.title;
        });
        const titleBefore = document.title;

        fireEvent.click(toolbarPrint());

        // The saved-PDF file name should be the worksheet title, not the app
        // tab title ("English Sheets" from index.html).
        expect(titleDuringPrint).toBe('Year 1 — Sight & Real Words');
        // In real browsers window.print() blocks until the dialog closes, so
        // the previous tab title is restored as soon as it returns.
        expect(document.title).toBe(titleBefore);
    });

    it('a 5-page worksheet is exactly 5 A4 blocks in the print job (one page each)', () => {
        const printSpy = vi.fn();
        window.print = printSpy;

        // Bump the document to 5 sheets via the toolbar stepper, then Print.
        fireEvent.change(screen.getByTestId('page-count'), { target: { value: '5' } });
        fireEvent.click(toolbarPrint());
        expect(printSpy).toHaveBeenCalledTimes(1);

        // The hidden .print-doc tree is the ONLY thing the browser paginates
        // (app.css: .app-chrome hidden, shell un-clipped, .print-doc shown).
        // It holds exactly ONE 210×297mm A4 block per worksheet page with a
        // page break after each — so the native dialog reports 5 pages, never
        // 1. This is the regression pin for "5 pages in => 5 pages out".
        const printPages = document.querySelectorAll('.print-page');
        expect(printPages.length).toBe(5);
        // Each block carries its worksheet page; page 2 is the pinned
        // continuation row (sight = 18 rows/page, so page 2 opens at id 19).
        expect(printPages[1].textContent).toContain(g1sightP2prompt);
        expect(printPages[1].textContent).toContain('Page 2 of 5');
        // The on-screen preview (the print preview) shows the same 5 pages.
        expect(screen.getByTestId('sheet-preview-page5')).toBeDefined();
        expect(screen.queryByTestId('sheet-preview-page6')).toBeNull();
    });

    it('the print tree lives OUTSIDE .app-chrome (print media hides the shell)', () => {
        // CRITICAL placement pin: @media print hides .app-chrome WHOLESALE, so
        // the .print-doc tree MUST be a sibling/descendant-outside of that
        // shell — if a refactor ever moves it back inside the interactive
        // chrome, printing would emit NOTHING (blank pages). The framework
        // mounts the active plugin's print surface exactly there.
        const printDoc = document.querySelector('.print-doc');
        expect(printDoc).not.toBeNull();
        let cursor: Element | null = printDoc;
        let insideChrome = false;
        while (cursor) {
            if (cursor.classList?.contains('app-chrome')) {
                insideChrome = true;
                break;
            }
            cursor = cursor.parentElement;
        }
        expect(insideChrome).toBe(false);
        // (Screen invisibility (.print-doc { display: none }) comes from
        // app.css, which the jsdom test environment does not load — the
        // placement pin above is what guards the print flow end-to-end.)
    });

    it('the print tree follows the page stepper (1 page => 1 A4 block)', () => {
        // Default 1-page document: a single A4 block in the print tree.
        expect(document.querySelectorAll('.print-page').length).toBe(1);

        // Grow to 5: five blocks, one per page.
        fireEvent.change(screen.getByTestId('page-count'), { target: { value: '5' } });
        expect(document.querySelectorAll('.print-page').length).toBe(5);

        // Shrink back to 2: exactly two blocks — the dialog would show 2 pages.
        fireEvent.change(screen.getByTestId('page-count'), { target: { value: '2' } });
        expect(document.querySelectorAll('.print-page').length).toBe(2);
    });

    it('printing is blocked (button disabled) when no sheet is available', () => {
        // Year 3 is unimplemented => empty document => dimmed toolbar actions.
        fireEvent.click(gradeRadio('3'));
        const printSpy = vi.fn();
        window.print = printSpy;

        expect(toolbarPrint().getAttribute('aria-disabled')).toBe('true');
        expect(randomizeButton().getAttribute('aria-disabled')).toBe('true');

        // Even a forced click cannot start a print job for an empty document.
        fireEvent.click(toolbarPrint());
        expect(printSpy).not.toHaveBeenCalled();
    });
});
