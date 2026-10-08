// Printable A4 worksheet page (framework layout component). This is the
// canonical "what gets printed" content.
//
// It is rendered in TWO on-screen-identical places plus the hidden print
// tree:
//   1. Inline, scaled-down preview in the right-hand canvas (PageStack) —
//      this view doubles as the print preview (toolbar Print goes straight
//      to the browser-native dialog).
//   2. Inside the screen-hidden `.print-doc` tree that window.print()
//      actually prints (one <PrintableSheet> per A4 page, see worksheet-kit),
//      which is what makes the native dialog list every page (a 5-page
//      document => 5 pages in the dialog).
//
// The component receives one page's `problems` (problem ids are numbered
// across the whole document, so a 2-page sheet continues 1..54). When the
// document has more than one page, `pageLabel` (e.g. "Page 2 of 3") is shown
// in a small footer — both on screen (as the page badge) and in print.
//
// The sheet body uses near-black text (`#1a1a1a`) regardless of the app's
// teal theme: printed sheets stay colour-neutral for any printer. All CSS
// uses explicit px/mm STRING values (not numbers) on purpose: when a value is
// static or a function in @presource/react's styledComponent, numbers are
// converted to rem, which we do not want for print-accurate spacing.
//
// PROBLEM LAYOUT: a normal row is `<index> [picture cue?] <prompt text with
// write-box/underlined blanks>` + (optional, early-years Sentence Building) a
// second line of scrambled WORD TILES (the word bank, see tiles.tsx); a
// TRACING row (Problem.trace set — letter/word/number sheets) is
// `<index> [picture cue?] [model] [dashed copies on a dashed rule]` instead of
// prompt text: the model exemplar is solid grey, the three (or one, for words)
// faded dashed shapes are what the child traces, sharing one writing line.
//
// PICTURE CUES (Problem.visual / Problem.visualCount, set by the early-years
// generators — see framework/visuals.tsx): a small inline-SVG pictogram prints
// beside the row as a learning cue. The SAME component renders in BOTH the
// preview canvas (PageStack) and the hidden .print-doc tree (worksheet-kit),
// so screen and print always agree. Cues are cue-only: they never appear in
// prompt/answer text, and higher-grade sheets (no visual field) render exactly
// the same markup as before.
//
// TILE SCAFFOLDS (Problem.tileBlanks / Problem.tileWords — see
// framework/tiles.tsx): early-years (Y1–3) rows print bordered WRITE-BOX
// blanks instead of plain underlines and (Sentence Building) a run of word
// tiles for the scrambled word bank. Both are set ONLY inside the early cue
// band by the generators, so Prep and Year 4+ rows keep their legacy
// underline markup exactly.
import React, { Fragment } from 'react';
import { styledComponent } from '@presource/react';
import type { Problem } from './document';
import { PictogramRow } from './visuals';
import { WriteBox, WordTileRun } from './tiles';

export type PrintableSheetProps = {
    // Large heading, e.g. "Year 1 — Blending".
    title: string;
    // Small line under the title, e.g. "Blending — letters, word set 2".
    subtitle: string;
    // The problems to lay out on THIS page (one page of one worksheet).
    problems: Problem[];
    // Optional footer label — set to "Page i of n" for multi-page documents so
    // printed pages can be ordered physically. Omitted for single-page sheets.
    pageLabel?: string;
    // Prose-style sheets (sentence building, word gaps, twin words, number
    // tracing) render in a SINGLE column so every row has the full page
    // width. Default: two-column grid.
    single?: boolean;
    // Brand line printed in the multi-page footer ("English Sheets"). Comes
    // from the dashboard framework's configuration, so the sheet component
    // itself stays subject-neutral. Defaults to "Worksheets" for direct use.
    brand?: string;
    // Stable test id for the root element.
    testId?: string;
};

// Page root: white sheet that fills its A4 frame (794×1123px on screen,
// 210×297mm in the print tree). Flex column so the footer pins to the page
// bottom regardless of how much problem content is above it.
const SheetRoot = styledComponent('div', {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
    padding: '12mm 12mm 12mm 12mm',
    fontFamily: 'system-ui, "Segoe UI", Arial, sans-serif',
    color: '#1a1a1a',
    display: 'flex',
    flexDirection: 'column'
});

const SheetTitle = styledComponent('h1', {
    fontSize: '30px',
    fontWeight: 700,
    margin: '0 0 4px 0',
    lineHeight: 1.1,
    letterSpacing: '-0.01em'
});

const SheetSubtitle = styledComponent('p', {
    fontSize: '15px',
    margin: '0 0 14px 0',
    color: '#4b5563'
});

// Name / Date line a teacher's class would fill in.
const MetaLine = styledComponent('p', {
    fontSize: '16px',
    margin: '0 0 12px 0',
    color: '#374151'
});

const Rule = styledComponent('hr', {
    border: 'none',
    borderTop: '2px solid #1a1a1a',
    margin: '0 0 16px 0'
});

// Two-column grid for compact sheets; single column for long prose (sentence
// building, word gaps, twin-word sentences). `single` is a custom prop read
// by the function value for gridTemplateColumns.
//
// FILLING THE WHOLE PAGE: SheetRoot is a flex column on a fixed A4 height, so
// `flex: 1` grows this grid to exactly the space left below the title/metaline
// (and above the footer). `gridAutoRows: 1fr` divides that space into EVEN
// rows and `alignItems: center` vertically centres each question in its row —
// so no matter how many problems a worksheet generates, the LAST question row
// always lands at the bottom of the page: there is never a blank band between
// the questions and the page foot (screen preview and print share this layout).
const ProblemGrid = styledComponent<{ single: boolean }>('div', {
    display: 'grid',
    gridTemplateColumns: ({ single }) => (single ? '1fr' : '1fr 1fr'),
    columnGap: '28px',
    rowGap: '16px',
    alignItems: 'center',
    flex: 1,
    minHeight: '0',
    gridAutoRows: '1fr'
});

const ProblemRow = styledComponent('div', {
    display: 'flex',
    gap: '10px',
    fontSize: '20px',
    lineHeight: 1.5
});

// Question number, right-aligned in a narrow column.
const ProblemIndex = styledComponent('span', {
    color: '#9ca3af',
    minWidth: '26px',
    textAlign: 'right',
    fontSize: '15px',
    paddingTop: '3px'
});

const ProblemText = styledComponent('span', {
    whiteSpace: 'pre-wrap'
});

// The learning-visual cue slot: sits between the row index and the prompt
// (or before the tracing model). Renders only when the problem carries a
// `visual` key that exists in the pictogram registry — higher-grade problems
// (no visual) print the legacy markup unchanged. `alignSelf: flex-start` +
// one line of vertical centre keeps the picture aligned to the FIRST line of
// a wrapping prompt (single-line rows stay perfectly centred).
const ProblemVisual = styledComponent('span', {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
    alignSelf: 'flex-start',
    paddingTop: '3px'
});

// Tracing rows (letterTrace / wordTrace / numberTrace): a solid grey model
// exemplar plus faded dashed copies the child traces over, all riding on one
// dashed "stay-on-the-line" rule. `flex: 1` stretches the line to the rest of
// the problem row so the rule reads as a full writing line (wide full-width
// lines on the single-column word/number sheets, half-page lines on the
// letter two-column sheet).
//
// WRITABLE SCALE: the tracing sheets print only a small dealt group per page
// (8 letters / 6 words / 5 digits), so the grid's `gridAutoRows: 1fr` gives
// every trace row ~150–210px of height. The row uses that room: a wide gap
// between model and target and deep padding under the glyphs put the child's
// pencil ON a real writing line instead of a cramped mini-row.
const TraceLine = styledComponent('div', {
    display: 'flex',
    alignItems: 'baseline',
    gap: '26px',
    flex: 1,
    minWidth: '0',
    paddingBottom: '12px',
    borderBottom: '2px dashed #b7c9c4',
    whiteSpace: 'nowrap'
});

// The solid model shape to copy from: mid-grey so it is clearly readable
// yet distinct from the child's own (dashed) work. Same 64px face as the
// trace target so the two share one baseline in TraceLine — a Prep-sized
// exemplar (~17mm tall), not a body-text glyph.
const ModelText = styledComponent('span', {
    display: 'inline-block',
    fontSize: '64px',
    fontWeight: 600,
    lineHeight: '1.1',
    color: '#64748b',
    userSelect: 'none'
});

// The faded trace target. The glyphs print as pale-outlined shapes via
// -webkit-text-stroke (supported by all evergreen engines, screen AND print —
// the preview tree and the hidden print tree share this exact markup). The
// almost-invisible pale fill is the graceful fallback: an engine without
// text-stroke still paints a light solid shape a child can trace, never an
// empty gap. The stroke scales with the 64px face so the outlined shapes
// stay bold at writable size (vector text — crisp at any print DPI, never a
// decorative raster).
const TraceText = styledComponent('span', {
    display: 'inline-block',
    fontSize: '64px',
    fontWeight: 600,
    lineHeight: '1.1',
    letterSpacing: '0.05em',
    color: '#f1f5f4',
    WebkitTextStroke: '3px #94a3b8',
    userSelect: 'none'
});

// A fill-in blank. Big blanks (name/date) are wider; question blanks are short.
// (Legacy underline — untouched for Prep/Y4+ and for every row without
// tileBlanks. Early-years rows print the bordered WriteBox instead, see
// tiles.tsx.)
const Blank = styledComponent<{ big?: boolean }>('span', {
    display: 'inline-block',
    minWidth: ({ big }) => (big ? '140px' : '38px'),
    borderBottom: '2px solid #1a1a1a',
    height: '0.8em',
    verticalAlign: 'baseline',
    margin: '0 5px'
});
// The scrambled word-tile line (Sentence Building, early years): a second,
// full-width line under the prompt row carrying the WordTileRun bank.
const TileLine = styledComponent('span', {
    display: 'block',
    marginTop: '6px',
    whiteSpace: 'pre-wrap'
});

// Footer shown only for multi-page documents: brand line on the left,
// "Page i of n" on the right, pinned to the page bottom.
const SheetFooter = styledComponent('div', {
    marginTop: 'auto',
    paddingTop: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '16px'
});

const FooterText = styledComponent('span', {
    fontSize: '11px',
    color: '#9ca3af'
});

// Splits a prompt on "__" and renders each blank as a styled fill-in line, so
// the printed sheet shows real blanks instead of literal underscores. Early-
// years rows (Problem.tileBlanks set) print Bordered WRITE-BOX tiles (the
// writing scaffold, see tiles.tsx) instead of the plain underline; the legacy
// underline stays for every other row.
function PromptText({ prompt, tileBlanks }: { prompt: string; tileBlanks?: 'letter' | 'word' }) {
    const parts = prompt.split('__');
    return (
        <>
            {parts.map((part, i) => (
                <Fragment key={i}>
                    {part}
                    {i < parts.length - 1 &&
                        (tileBlanks ? <WriteBox kind={tileBlanks} /> : <Blank />)}
                </Fragment>
            ))}
        </>
    );
}

export function PrintableSheet({
    title,
    subtitle,
    problems,
    pageLabel,
    single,
    brand,
    testId
}: PrintableSheetProps) {
    return (
        <SheetRoot data-testid={testId}>
            <SheetTitle>{title}</SheetTitle>
            <SheetSubtitle>{subtitle}</SheetSubtitle>
            <MetaLine>
                Name: <Blank big />
                Date: <Blank big />
            </MetaLine>
            <Rule />
            <ProblemGrid single={single ?? false}>
                {problems.map((p) => (
                    <ProblemRow key={p.id}>
                        <ProblemIndex>{p.id}.</ProblemIndex>
                        {/* Learning-visual cue (early-years sheets only): the
                            pictogram for p.visual, printed `visualCount` times
                            (quantity contrast). No visual field => nothing
                            renders, so legacy rows are unchanged. TRACING rows
                            pass the enlarged uniform `size` so the picture
                            matches the writable scale of the 64px trace
                            target; normal rows keep the compact default
                            ladder (one-line rows stay one line tall). */}
                        {p.visual && <ProblemVisual>{<PictogramRow icon={p.visual} count={p.visualCount ?? 1} size={p.trace ? 44 : undefined} />}</ProblemVisual>}
                        {p.trace ? (
                            // Tracing row: [cue] solid model + faded dashed
                            // target on a dashed writing rule (see
                            // TraceLine/ModelText/TraceText above). The row
                            // announces the printed prompt to screen readers.
                            <TraceLine aria-label={p.prompt}>
                                {p.model && (
                                    <ModelText aria-hidden="true">{p.model}</ModelText>
                                )}
                                <TraceText>{p.trace}</TraceText>
                            </TraceLine>
                        ) : (
                            <ProblemText>
                                <PromptText prompt={p.prompt} tileBlanks={p.tileBlanks} />
                                {/* Scrambled word tiles (early-years Sentence
                                    Building only): the word bank prints as a
                                    row of bordered word tiles on its own line —
                                    in the SHOWN (scrambled) order from
                                    problem.tileWords. The early-grade prompts
                                    for these rows no longer carry the
                                    parenthesised text list (generator, see
                                    SentenceBuildingWorksheet.ts), so the words
                                    print exactly once and the answer order
                                    never appears. */}
                                {p.tileWords && (
                                    <TileLine>
                                        <WordTileRun words={p.tileWords} />
                                    </TileLine>
                                )}
                            </ProblemText>
                        )}
                    </ProblemRow>
                ))}
            </ProblemGrid>
            {/* Multi-page documents get a page-position footer in print so a
                class set of copies can be reordered physically. The brand line
                comes from the dashboard configuration (framework.config). */}
            {pageLabel && (
                <SheetFooter>
                    <FooterText>{brand ?? 'Worksheets'}</FooterText>
                    <FooterText>{pageLabel}</FooterText>
                </SheetFooter>
            )}
        </SheetRoot>
    );
}
