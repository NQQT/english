// Unit tests for the LETTER TRACING worksheet plugin.
//
// The tracing generators are ORDERED, not random: page 1 is A–Z in writing
// order and every further page repeats the SAME ordered set, so the pins
// below are hand-computable without rolling any seed. These are the exact
// page-1 sheets (all rows) plus the page-2 continuation heads.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { letterTraceSpec } from './LetterTracingWorksheet';

const g0 = getGradeConfig(0);
const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(letterTraceSpec, grade, seedFrom([grade.id, letterTraceSpec.id, 0]));
}

describe('letterTrace plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(letterTraceSpec.id).toBe('letterTrace');
        expect(letterTraceSpec.label).toBe('Letter Tracing');
        expect(letterTraceSpec.icon).toBe('⌗');
        // 26 rows = exactly one A–Z page in the two-column grid.
        expect(letterTraceSpec.perPage).toBe(26);
    });

    it('describes its scope (A–Z letter shapes)', () => {
        expect(letterTraceSpec.scope(g0)).toBe('A–Z letter shapes');
    });

    it('is offered for Prep only (Y1/Y2 get reading tasks instead)', () => {
        expect(letterTraceSpec.offered(g0)).toBe(true);
        expect(letterTraceSpec.offered(g1)).toBe(false);
        expect(letterTraceSpec.offered(g2)).toBe(false);
        expect(letterTraceSpec.offered(getGradeConfig(3))).toBe(false);
        // Unoffered type => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(letterTraceSpec, g1, seedFrom([1, 'letterTrace', 0]))).toEqual([]);
        expect(generateSheet(letterTraceSpec, g2, seedFrom([2, 'letterTrace', 0]))).toEqual([]);
    });
});

describe('letterTrace — Prep (fixed ordered A–Z, no rng draws)', () => {
    it('matches the exact page-1 sheet (A–Z, model + 3 faded copies)', () => {
        expect(sheet(g0)).toEqual([
        {"id":1,"type":"letterTrace","prompt":"Trace the letter \"A\"","answer":"A","model":"A","trace":"A A A"},
        {"id":2,"type":"letterTrace","prompt":"Trace the letter \"B\"","answer":"B","model":"B","trace":"B B B"},
        {"id":3,"type":"letterTrace","prompt":"Trace the letter \"C\"","answer":"C","model":"C","trace":"C C C"},
        {"id":4,"type":"letterTrace","prompt":"Trace the letter \"D\"","answer":"D","model":"D","trace":"D D D"},
        {"id":5,"type":"letterTrace","prompt":"Trace the letter \"E\"","answer":"E","model":"E","trace":"E E E"},
        {"id":6,"type":"letterTrace","prompt":"Trace the letter \"F\"","answer":"F","model":"F","trace":"F F F"},
        {"id":7,"type":"letterTrace","prompt":"Trace the letter \"G\"","answer":"G","model":"G","trace":"G G G"},
        {"id":8,"type":"letterTrace","prompt":"Trace the letter \"H\"","answer":"H","model":"H","trace":"H H H"},
        {"id":9,"type":"letterTrace","prompt":"Trace the letter \"I\"","answer":"I","model":"I","trace":"I I I"},
        {"id":10,"type":"letterTrace","prompt":"Trace the letter \"J\"","answer":"J","model":"J","trace":"J J J"},
        {"id":11,"type":"letterTrace","prompt":"Trace the letter \"K\"","answer":"K","model":"K","trace":"K K K"},
        {"id":12,"type":"letterTrace","prompt":"Trace the letter \"L\"","answer":"L","model":"L","trace":"L L L"},
        {"id":13,"type":"letterTrace","prompt":"Trace the letter \"M\"","answer":"M","model":"M","trace":"M M M"},
        {"id":14,"type":"letterTrace","prompt":"Trace the letter \"N\"","answer":"N","model":"N","trace":"N N N"},
        {"id":15,"type":"letterTrace","prompt":"Trace the letter \"O\"","answer":"O","model":"O","trace":"O O O"},
        {"id":16,"type":"letterTrace","prompt":"Trace the letter \"P\"","answer":"P","model":"P","trace":"P P P"},
        {"id":17,"type":"letterTrace","prompt":"Trace the letter \"Q\"","answer":"Q","model":"Q","trace":"Q Q Q"},
        {"id":18,"type":"letterTrace","prompt":"Trace the letter \"R\"","answer":"R","model":"R","trace":"R R R"},
        {"id":19,"type":"letterTrace","prompt":"Trace the letter \"S\"","answer":"S","model":"S","trace":"S S S"},
        {"id":20,"type":"letterTrace","prompt":"Trace the letter \"T\"","answer":"T","model":"T","trace":"T T T"},
        {"id":21,"type":"letterTrace","prompt":"Trace the letter \"U\"","answer":"U","model":"U","trace":"U U U"},
        {"id":22,"type":"letterTrace","prompt":"Trace the letter \"V\"","answer":"V","model":"V","trace":"V V V"},
        {"id":23,"type":"letterTrace","prompt":"Trace the letter \"W\"","answer":"W","model":"W","trace":"W W W"},
        {"id":24,"type":"letterTrace","prompt":"Trace the letter \"X\"","answer":"X","model":"X","trace":"X X X"},
        {"id":25,"type":"letterTrace","prompt":"Trace the letter \"Y\"","answer":"Y","model":"Y","trace":"Y Y Y"},
        {"id":26,"type":"letterTrace","prompt":"Trace the letter \"Z\"","answer":"Z","model":"Z","trace":"Z Z Z"}
]);
    });

    it('page 2 repeats the A–Z stream from the top (ids continue at 27)', () => {
        expect(generateDocument(letterTraceSpec, g0, seedFrom([0, 'letterTrace', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":27,"type":"letterTrace","prompt":"Trace the letter \"A\"","answer":"A","model":"A","trace":"A A A"},
        {"id":28,"type":"letterTrace","prompt":"Trace the letter \"B\"","answer":"B","model":"B","trace":"B B B"},
        {"id":29,"type":"letterTrace","prompt":"Trace the letter \"C\"","answer":"C","model":"C","trace":"C C C"}
]);
    });

    it('documents chunk per page with continuous ids (2 pages = 52 rows)', () => {
        const d = generateDocument(letterTraceSpec, g0, seedFrom([0, 'letterTrace', 0]), 2);
        expect(d.pages).toHaveLength(2);
        expect(d.total).toBe(52);
        // Page 1 is byte-identical to the single-page sheet (same generator,
        // no rng draws, so re-rolls and re-splits can never drift).
        expect(d.pages[0]).toEqual(sheet(g0));
        expect(d.pages.flat().map((p) => p.id)).toEqual(Array.from({ length: 52 }, (_, i) => i + 1));
    });

    // Semantic invariant: answer is a single uppercase letter; the model
    // repeats it and the trace target is that model in three faded copies.
    it('every row is a single uppercase letter with model + 3 copies', () => {
        for (const p of sheet(g0)) {
            expect(/^[A-Z]$/.test(p.answer)).toBe(true);
            expect(p.model).toBe(p.answer);
            expect(p.trace).toBe(`${p.answer} ${p.answer} ${p.answer}`);
        }
    });
});
