// PrintableSheet learning-visual cue tests (see PrintableSheet.tsx +
// visuals.tsx).
//
// Strategy: the cue slot is the ONLY thing that changed in the sheet markup,
// so these tests pin BOTH sides of the contract:
//   (a) a problem carrying `visual`/`visualCount` renders a PictogramRow
//       between the row index and the prompt (normal rows) — or between the
//       row index and the tracing model (trace rows);
//   (b) a problem WITHOUT `visual` renders the legacy markup unchanged (no
//       pictogram nodes at all) — this is what keeps every pre-existing
//       sheet (and every Year 4+ sheet) byte-identical;
//   (c) the svg contributes ZERO text to the row, so the exact row-text pins
//       in components/EnglishDashboard.test.tsx survive.

import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { PrintableSheet } from './PrintableSheet';
import type { Problem } from './document';

afterEach(() => {
    cleanup();
});

// Minimal fixtures covering every slot shape (ids/types chosen so a
// regression that mixes up rows is visible in the text assertions).
const withVisual: Problem = {
    id: 1, type: 'sounds',
    prompt: 'Which letter does "pen" start with?', answer: 'p',
    visual: 'pen'
};
const legacyRow: Problem = {
    id: 2, type: 'sounds',
    prompt: 'Which letter does "box" start with?', answer: 'b'
};
const pluralOne: Problem = {
    id: 3, type: 'plural',
    prompt: 'What is the plural of "cat"?', answer: 'cats',
    visual: 'cat', visualCount: 1
};
const pluralThree: Problem = {
    id: 4, type: 'plural',
    prompt: 'What is the singular of "dogs"?', answer: 'dog',
    visual: 'dog', visualCount: 3
};
const traceWithVisual: Problem = {
    id: 5, type: 'wordTrace',
    prompt: 'Trace the word "apple" (begins with "A")', answer: 'apple',
    model: 'A', trace: 'apple', visual: 'apple'
};
const traceLegacy: Problem = {
    id: 6, type: 'wordTrace',
    prompt: 'Trace the word "zoo" (begins with "Z")', answer: 'zoo',
    model: 'Z', trace: 'zoo'
};

// T4 tile-scaffold fixtures (see framework/tiles.tsx + PrintableSheet.tsx
// PromptText/TileLine): `tileBlanks` swaps the plain underline blanks for
// bordered WriteBox slots, and `tileWords` adds a second line of bordered
// word tiles (the scrambled bank of an early-years sentence row).
const letterTiles: Problem = {
    id: 7, type: 'letters',
    prompt: 'f, h, __', answer: 'j',
    tileBlanks: 'letter'
};
const wordTiles: Problem = {
    id: 8, type: 'sentence',
    prompt: 'Put the words in the correct order: __, __.', answer: 'Sue skips',
    tileBlanks: 'word',
    tileWords: ['skips', 'Sue']
};
const fourWordTiles: Problem = {
    id: 9, type: 'sentence',
    // Mirrors the real Y2 tile row (see SentenceBuilding pins): 4 blanks ↔
    // 4 tiles ↔ a 4-word answer.
    prompt: 'Put the words in the correct order: __, __, __, __.', answer: 'Mia eats a pear again',
    tileBlanks: 'word',
    tileWords: ['again', 'a pear', 'eats', 'Mia']
};
const plainBlankRow: Problem = {
    id: 10, type: 'letters',
    prompt: 'f, h, __', answer: 'j'
};

function mountSheet(problems: Problem[]) {
    return render(
        <PrintableSheet
            title="Test Sheet"
            subtitle="visual cue contract"
            problems={problems}
            testId="sheet-root"
        />
    );
}

// Walk up from the pictogram-row span to the owning problem row div:
// svg → PictoRow span → ProblemVisual span → ProblemRow div.
function rowOfPictogram(svg: Element): Element {
    return svg.parentElement!.parentElement!.parentElement!;
}

describe('normal rows', () => {
    it('a problem with `visual` renders exactly one pictogram row between index and prompt', () => {
        mountSheet([withVisual]);
        const row = screen.getByTestId('pictogram-row');
        const svg = row.querySelector('svg')!;
        // T4 a11y contract (see visuals.test.tsx PictogramRow): the
        // WRAPPER span is the single role="img" with the accessible name;
        // the svg copy itself is decorative (aria-hidden, no role/label).
        expect(row.getAttribute('role')).toBe('img');
        expect(row.getAttribute('aria-label')).toBe('Picture of a pen');
        expect(svg.getAttribute('aria-hidden')).toBe('true');
        expect(svg.getAttribute('role')).toBe(null);
        expect(svg.getAttribute('aria-label')).toBe(null);
        // The row reads "<index>. <prompt>" with the svg contributing no
        // text (no <title>, no aria text in the DOM text flow).
        expect(rowOfPictogram(svg).textContent)
            .toBe('1.Which letter does "pen" start with?');
    });

    it('a problem WITHOUT `visual` renders no pictogram nodes at all (legacy parity)', () => {
        mountSheet([legacyRow]);
        expect(screen.queryByTestId('pictogram-row')).toBeNull();
        // And the row text is the plain legacy shape.
        const svgCount = screen.getByTestId('sheet-root').querySelectorAll('svg').length;
        expect(svgCount).toBe(0);
    });

    it('visualCount drives the quantity contrast (1 vs 3 printed copies)', () => {
        mountSheet([pluralOne, pluralThree]);
        const rows = screen.getAllByTestId('pictogram-row');
        expect(rows[0].querySelectorAll('svg').length).toBe(1);
        expect(rows[1].querySelectorAll('svg').length).toBe(3);
    });
});

describe('tracing rows', () => {
    it('a trace problem with `visual` slots the cue BEFORE the model exemplar', () => {
        mountSheet([traceWithVisual]);
        // Row children, in DOM order: index span, pictogram slot, trace line.
        const svg = screen.getByTestId('pictogram-row').querySelector('svg')!;
        const row = rowOfPictogram(svg);
        expect(row.children.length).toBe(3);
        expect(row.children[0].textContent).toBe('5.');
        expect(row.children[1].querySelector('[data-testid="pictogram-row"]')).not.toBeNull();
        // The trace line keeps its accessible prompt + model + dashed target.
        const traceLine = row.children[2] as HTMLElement;
        expect(traceLine.getAttribute('aria-label')).toBe('Trace the word "apple" (begins with "A")');
        expect(traceLine.textContent).toBe('Aapple');
    });

    it('a trace problem WITHOUT `visual` keeps the legacy 2-node row (index + trace line)', () => {
        mountSheet([traceLegacy]);
        expect(screen.queryByTestId('pictogram-row')).toBeNull();
        // Find the row via the trace line's parent (no pictogram slot exists).
        const traceLine = screen.getByTestId('sheet-root').querySelector('div[aria-label]')!;
        const row = traceLine.parentElement!;
        expect(row.children.length).toBe(2);
        expect(row.children[0].textContent).toBe('6.');
    });
});

// T4 TILE SCAFFOLDS (framework/tiles.tsx, rendered by PrintableSheet's
// PromptText/TileLine): `tileBlanks` swaps the underline blanks for bordered
// WriteBox slots (one per `__`), and `tileWords` adds a word-tile run on its
// own line — the scrambled bank, in the SHOWN order. Both are monochrome,
// print-safe and accessible (the tiles carry real list roles because they
// hold the words themselves).
describe('tile scaffolds (write-box blanks + word-tile runs)', () => {
    it('tileBlanks: "letter" renders one bordered write-box per blank, no legacy underline blanks', () => {
        mountSheet([letterTiles]);
        const sheet = screen.getByTestId('sheet-root');
        // `f, h, __` has exactly one blank -> exactly one write-box.
        const boxes = sheet.querySelectorAll('[data-testid="write-box"]');
        expect(boxes.length).toBe(1);
        // The write-box is a pure writing slot: it announces NOTHING (its
        // contents WOULD be the answer).
        expect(boxes[0].getAttribute('role')).toBe(null);
        expect(boxes[0].getAttribute('aria-label')).toBe(null);
        expect(boxes[0].textContent).toBe('');
    });

    it('tileBlanks: "word" renders word-sized write-boxes matching the blank count', () => {
        mountSheet([wordTiles, fourWordTiles]);
        const root = screen.getByTestId('sheet-root');
        const boxes = root.querySelectorAll('[data-testid="write-box"]');
        // Row 7 has 2 blanks, row 8 has 4 -> 6 write-boxes total.
        expect(boxes.length).toBe(6);
    });

    it('tileWords renders an accessible list of word tiles in the SHOWN order', () => {
        mountSheet([fourWordTiles]);
        const root = screen.getByTestId('sheet-root');
        const list = root.querySelector('[data-testid="word-tiles"]')!;
        // The tiles ARE the words (the early prompt no longer prints them as
        // text), so the list must stay readable to screen readers.
        expect(list.getAttribute('role')).toBe('list');
        expect(list.getAttribute('aria-label')).toBe('The words to put in order');
        const items = list.querySelectorAll('[role="listitem"]');
        expect(items.length).toBe(4);
        // Exact words in exact (scrambled) order — the metadata value, not
        // the answer order.
        expect([...items].map((el) => el.textContent)).toEqual(['again', 'a pear', 'eats', 'Mia']);
    });

    it('rows WITHOUT tile metadata keep the legacy plain blanks (no write-boxes, no word tiles)', () => {
        mountSheet([plainBlankRow, legacyRow]);
        const root = screen.getByTestId('sheet-root');
        expect(root.querySelectorAll('[data-testid="write-box"]').length).toBe(0);
        expect(root.querySelector('[data-testid="word-tiles"]')).toBeNull();
    });
});
