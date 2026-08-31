// Unit tests for the ALPHABET ORDER worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm changes, these exact
// assertions fail — which is what we want, so a silent change to the worksheet
// can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { lettersSpec } from './AlphabetOrderWorksheet';

const g0 = getGradeConfig(0);
const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(lettersSpec, grade, seedFrom([grade.id, lettersSpec.id, 0]));
}

describe('letters plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(lettersSpec.id).toBe('letters');
        expect(lettersSpec.label).toBe('Alphabet Order');
        expect(lettersSpec.icon).toBe('Az');
        expect(lettersSpec.perPage).toBe(24);
    });

    it('describes its scope (a–z order at every grade)', () => {
        expect(lettersSpec.scope(g0)).toBe('a–z order');
        expect(lettersSpec.scope(g1)).toBe('a–z order');
        expect(lettersSpec.scope(g2)).toBe('a–z order');
    });

    it('is gated by the grade catalogue (all implemented grades offer it)', () => {
        expect(lettersSpec.offered(g0)).toBe(true);
        expect(lettersSpec.offered(g1)).toBe(true);
        expect(lettersSpec.offered(g2)).toBe(true);
        expect(lettersSpec.offered(getGradeConfig(3))).toBe(false);
    });
});

// Semantic invariant: the answer is always the correct alphabet neighbour of
// the printed prompt. All five generator kinds are checked (see
// AlphabetOrderWorksheet.ts lines 31–54):
//   after X → X+1 | before X → X−1 | "a, b, __" → a+2 (forward run)
//   "b, a, __" → a−2 (backward run) | "a, __, c" → a+1 (middle gap)
function checkAlphabetTruths(grade: GradeConfig) {
    const A = 97;
    const L = (n: number) => String.fromCharCode(A + n);
    for (const p of sheet(grade)) {
        const after = p.prompt.match(/after "([a-z])"/);
        const before = p.prompt.match(/before "([a-z])"/);
        const run = p.prompt.match(/^([a-z]), ([a-z]), __$/);
        const gap = p.prompt.match(/^([a-z]), __, ([a-z])$/);
        if (after) {
            const c = after[1].charCodeAt(0) - A;
            expect(p.answer).toBe(L(c + 1));
        } else if (before) {
            const c = before[1].charCodeAt(0) - A;
            expect(p.answer).toBe(L(c - 1));
        } else if (run) {
            const a = run[1].charCodeAt(0) - A;
            const b = run[2].charCodeAt(0) - A;
            // The two shown letters must be an adjacent run; the answer is
            // the next letter continuing in the run's direction.
            expect(Math.abs(b - a)).toBe(1);
            expect(p.answer).toBe(L(b > a ? a + 2 : a - 2));
        } else if (gap) {
            const a = gap[1].charCodeAt(0) - A;
            const c = gap[2].charCodeAt(0) - A;
            // The shown letters bracket a three-letter run; the answer fills
            // the middle.
            expect(c - a).toBe(2);
            expect(p.answer).toBe(L(a + 1));
        } else {
            // Every prompt must fall into exactly one of the five kinds.
            throw new Error(`unrecognised letters prompt: ${p.prompt}`);
        }
    }
}

describe('letters — Prep (grade 0)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g0)).toEqual([
        {"id":1,"type":"letters","prompt":"Which letter comes after \"f\"?","answer":"g"},
        {"id":2,"type":"letters","prompt":"v, u, __","answer":"t"},
        {"id":3,"type":"letters","prompt":"u, t, __","answer":"s"},
        {"id":4,"type":"letters","prompt":"w, __, y","answer":"x"},
        {"id":5,"type":"letters","prompt":"u, __, w","answer":"v"},
        {"id":6,"type":"letters","prompt":"j, k, __","answer":"l"},
        {"id":7,"type":"letters","prompt":"t, s, __","answer":"r"},
        {"id":8,"type":"letters","prompt":"k, l, __","answer":"m"},
        {"id":9,"type":"letters","prompt":"f, g, __","answer":"h"},
        {"id":10,"type":"letters","prompt":"r, s, __","answer":"t"},
        {"id":11,"type":"letters","prompt":"Which letter comes before \"m\"?","answer":"l"},
        {"id":12,"type":"letters","prompt":"p, __, r","answer":"q"},
        {"id":13,"type":"letters","prompt":"Which letter comes after \"e\"?","answer":"f"},
        {"id":14,"type":"letters","prompt":"Which letter comes before \"j\"?","answer":"i"},
        {"id":15,"type":"letters","prompt":"Which letter comes before \"h\"?","answer":"g"},
        {"id":16,"type":"letters","prompt":"v, __, x","answer":"w"},
        {"id":17,"type":"letters","prompt":"g, f, __","answer":"e"},
        {"id":18,"type":"letters","prompt":"Which letter comes before \"b\"?","answer":"a"},
        {"id":19,"type":"letters","prompt":"Which letter comes before \"l\"?","answer":"k"},
        {"id":20,"type":"letters","prompt":"d, __, f","answer":"e"},
        {"id":21,"type":"letters","prompt":"Which letter comes after \"s\"?","answer":"t"},
        {"id":22,"type":"letters","prompt":"o, n, __","answer":"m"},
        {"id":23,"type":"letters","prompt":"s, r, __","answer":"q"},
        {"id":24,"type":"letters","prompt":"Which letter comes before \"z\"?","answer":"y"}
]);
        checkAlphabetTruths(g0);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(lettersSpec, g0, seedFrom([0, 'letters', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"letters","prompt":"Which letter comes before \"n\"?","answer":"m"},
        {"id":26,"type":"letters","prompt":"Which letter comes after \"n\"?","answer":"o"},
        {"id":27,"type":"letters","prompt":"i, h, __","answer":"g"}
]);
    });
});

describe('letters — Year 1', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"id":1,"type":"letters","prompt":"Which letter comes before \"y\"?","answer":"x"},
        {"id":2,"type":"letters","prompt":"y, x, __","answer":"w"},
        {"id":3,"type":"letters","prompt":"m, n, __","answer":"o"},
        {"id":4,"type":"letters","prompt":"Which letter comes after \"b\"?","answer":"c"},
        {"id":5,"type":"letters","prompt":"Which letter comes before \"x\"?","answer":"w"},
        {"id":6,"type":"letters","prompt":"d, e, __","answer":"f"},
        {"id":7,"type":"letters","prompt":"s, r, __","answer":"q"},
        {"id":8,"type":"letters","prompt":"Which letter comes before \"i\"?","answer":"h"},
        {"id":9,"type":"letters","prompt":"Which letter comes after \"u\"?","answer":"v"},
        {"id":10,"type":"letters","prompt":"i, h, __","answer":"g"},
        {"id":11,"type":"letters","prompt":"o, __, q","answer":"p"},
        {"id":12,"type":"letters","prompt":"i, __, k","answer":"j"},
        {"id":13,"type":"letters","prompt":"v, __, x","answer":"w"},
        {"id":14,"type":"letters","prompt":"k, __, m","answer":"l"},
        {"id":15,"type":"letters","prompt":"e, f, __","answer":"g"},
        {"id":16,"type":"letters","prompt":"q, __, s","answer":"r"},
        {"id":17,"type":"letters","prompt":"f, __, h","answer":"g"},
        {"id":18,"type":"letters","prompt":"u, __, w","answer":"v"},
        {"id":19,"type":"letters","prompt":"Which letter comes after \"d\"?","answer":"e"},
        {"id":20,"type":"letters","prompt":"k, j, __","answer":"i"},
        {"id":21,"type":"letters","prompt":"r, __, t","answer":"s"},
        {"id":22,"type":"letters","prompt":"f, g, __","answer":"h"},
        {"id":23,"type":"letters","prompt":"Which letter comes before \"m\"?","answer":"l"},
        {"id":24,"type":"letters","prompt":"n, m, __","answer":"l"}
]);
        checkAlphabetTruths(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(lettersSpec, g1, seedFrom([1, 'letters', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"letters","prompt":"Which letter comes after \"y\"?","answer":"z"},
        {"id":26,"type":"letters","prompt":"n, o, __","answer":"p"},
        {"id":27,"type":"letters","prompt":"Which letter comes after \"a\"?","answer":"b"}
]);
    });
});

describe('letters — Year 2', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"letters","prompt":"b, c, __","answer":"d"},
        {"id":2,"type":"letters","prompt":"m, n, __","answer":"o"},
        {"id":3,"type":"letters","prompt":"Which letter comes after \"l\"?","answer":"m"},
        {"id":4,"type":"letters","prompt":"Which letter comes before \"u\"?","answer":"t"},
        {"id":5,"type":"letters","prompt":"t, __, v","answer":"u"},
        {"id":6,"type":"letters","prompt":"t, u, __","answer":"v"},
        {"id":7,"type":"letters","prompt":"c, __, e","answer":"d"},
        {"id":8,"type":"letters","prompt":"o, p, __","answer":"q"},
        {"id":9,"type":"letters","prompt":"Which letter comes before \"r\"?","answer":"q"},
        {"id":10,"type":"letters","prompt":"Which letter comes after \"j\"?","answer":"k"},
        {"id":11,"type":"letters","prompt":"v, u, __","answer":"t"},
        {"id":12,"type":"letters","prompt":"Which letter comes after \"y\"?","answer":"z"},
        {"id":13,"type":"letters","prompt":"i, __, k","answer":"j"},
        {"id":14,"type":"letters","prompt":"s, __, u","answer":"t"},
        {"id":15,"type":"letters","prompt":"d, e, __","answer":"f"},
        {"id":16,"type":"letters","prompt":"v, __, x","answer":"w"},
        {"id":17,"type":"letters","prompt":"l, m, __","answer":"n"},
        {"id":18,"type":"letters","prompt":"Which letter comes after \"t\"?","answer":"u"},
        {"id":19,"type":"letters","prompt":"j, k, __","answer":"l"},
        {"id":20,"type":"letters","prompt":"Which letter comes after \"f\"?","answer":"g"},
        {"id":21,"type":"letters","prompt":"w, __, y","answer":"x"},
        {"id":22,"type":"letters","prompt":"b, __, d","answer":"c"},
        {"id":23,"type":"letters","prompt":"Which letter comes before \"z\"?","answer":"y"},
        {"id":24,"type":"letters","prompt":"Which letter comes after \"c\"?","answer":"d"}
]);
        checkAlphabetTruths(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(lettersSpec, g2, seedFrom([2, 'letters', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"letters","prompt":"a, b, __","answer":"c"},
        {"id":26,"type":"letters","prompt":"Which letter comes before \"v\"?","answer":"u"},
        {"id":27,"type":"letters","prompt":"p, __, r","answer":"q"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(lettersSpec, getGradeConfig(3), seedFrom([3, 'letters', 0]))).toEqual([]);
    });
});
