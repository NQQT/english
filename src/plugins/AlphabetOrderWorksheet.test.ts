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
// the printed prompt (after/before/two-shown-run).
function checkAlphabetTruths(grade: GradeConfig) {
    const A = 97;
    for (const p of sheet(grade)) {
        if (p.prompt.startsWith('Which letter comes after')) {
            const c = p.prompt.match(/after "([a-z])"/)![1];
            expect(p.answer).toBe(String.fromCharCode(A + c.charCodeAt(0) - A + 1));
        } else if (p.prompt.startsWith('Which letter comes before')) {
            const c = p.prompt.match(/before "([a-z])"/)![1];
            expect(p.answer).toBe(String.fromCharCode(A + c.charCodeAt(0) - A - 1));
        } else {
            const [a, b] = p.prompt.match(/^([a-z]), ([a-z]), __$/)!.slice(1, 3);
            expect(p.answer).toBe(String.fromCharCode(A + a.charCodeAt(0) - A + 2));
            expect(b).toBe(String.fromCharCode(A + a.charCodeAt(0) - A + 1));
        }
    }
}

describe('letters — Prep (grade 0)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g0)).toEqual([
        {"id":1,"type":"letters","prompt":"Which letter comes after \"f\"?","answer":"g"},
        {"id":2,"type":"letters","prompt":"u, v, __","answer":"w"},
        {"id":3,"type":"letters","prompt":"Which letter comes before \"v\"?","answer":"u"},
        {"id":4,"type":"letters","prompt":"w, x, __","answer":"y"},
        {"id":5,"type":"letters","prompt":"u, v, __","answer":"w"},
        {"id":6,"type":"letters","prompt":"Which letter comes before \"w\"?","answer":"v"},
        {"id":7,"type":"letters","prompt":"Which letter comes before \"l\"?","answer":"k"},
        {"id":8,"type":"letters","prompt":"s, t, __","answer":"u"},
        {"id":9,"type":"letters","prompt":"Which letter comes before \"l\"?","answer":"k"},
        {"id":10,"type":"letters","prompt":"Which letter comes before \"g\"?","answer":"f"},
        {"id":11,"type":"letters","prompt":"Which letter comes before \"t\"?","answer":"s"},
        {"id":12,"type":"letters","prompt":"Which letter comes before \"m\"?","answer":"l"},
        {"id":13,"type":"letters","prompt":"p, q, __","answer":"r"},
        {"id":14,"type":"letters","prompt":"Which letter comes after \"e\"?","answer":"f"},
        {"id":15,"type":"letters","prompt":"Which letter comes after \"i\"?","answer":"j"},
        {"id":16,"type":"letters","prompt":"Which letter comes after \"g\"?","answer":"h"},
        {"id":17,"type":"letters","prompt":"v, w, __","answer":"x"},
        {"id":18,"type":"letters","prompt":"Which letter comes before \"g\"?","answer":"f"},
        {"id":19,"type":"letters","prompt":"Which letter comes after \"a\"?","answer":"b"},
        {"id":20,"type":"letters","prompt":"Which letter comes before \"l\"?","answer":"k"},
        {"id":21,"type":"letters","prompt":"Which letter comes after \"k\"?","answer":"l"},
        {"id":22,"type":"letters","prompt":"d, e, __","answer":"f"},
        {"id":23,"type":"letters","prompt":"Which letter comes after \"s\"?","answer":"t"},
        {"id":24,"type":"letters","prompt":"v, w, __","answer":"x"}
]);
        checkAlphabetTruths(g0);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(lettersSpec, g0, seedFrom([0, 'letters', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"letters","prompt":"Which letter comes before \"o\"?","answer":"n"},
        {"id":26,"type":"letters","prompt":"Which letter comes before \"t\"?","answer":"s"},
        {"id":27,"type":"letters","prompt":"Which letter comes after \"y\"?","answer":"z"}
]);
    });
});

describe('letters — Year 1', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"id":1,"type":"letters","prompt":"Which letter comes after \"x\"?","answer":"y"},
        {"id":2,"type":"letters","prompt":"x, y, __","answer":"z"},
        {"id":3,"type":"letters","prompt":"Which letter comes before \"n\"?","answer":"m"},
        {"id":4,"type":"letters","prompt":"Which letter comes after \"b\"?","answer":"c"},
        {"id":5,"type":"letters","prompt":"Which letter comes before \"x\"?","answer":"w"},
        {"id":6,"type":"letters","prompt":"Which letter comes before \"e\"?","answer":"d"},
        {"id":7,"type":"letters","prompt":"r, s, __","answer":"t"},
        {"id":8,"type":"letters","prompt":"Which letter comes after \"h\"?","answer":"i"},
        {"id":9,"type":"letters","prompt":"Which letter comes after \"u\"?","answer":"v"},
        {"id":10,"type":"letters","prompt":"h, i, __","answer":"j"},
        {"id":11,"type":"letters","prompt":"o, p, __","answer":"q"},
        {"id":12,"type":"letters","prompt":"i, j, __","answer":"k"},
        {"id":13,"type":"letters","prompt":"Which letter comes before \"e\"?","answer":"d"},
        {"id":14,"type":"letters","prompt":"v, w, __","answer":"x"},
        {"id":15,"type":"letters","prompt":"k, l, __","answer":"m"},
        {"id":16,"type":"letters","prompt":"Which letter comes before \"f\"?","answer":"e"},
        {"id":17,"type":"letters","prompt":"q, r, __","answer":"s"},
        {"id":18,"type":"letters","prompt":"f, g, __","answer":"h"},
        {"id":19,"type":"letters","prompt":"u, v, __","answer":"w"},
        {"id":20,"type":"letters","prompt":"Which letter comes after \"d\"?","answer":"e"},
        {"id":21,"type":"letters","prompt":"j, k, __","answer":"l"},
        {"id":22,"type":"letters","prompt":"r, s, __","answer":"t"},
        {"id":23,"type":"letters","prompt":"Which letter comes before \"g\"?","answer":"f"},
        {"id":24,"type":"letters","prompt":"q, r, __","answer":"s"}
]);
        checkAlphabetTruths(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(lettersSpec, g1, seedFrom([1, 'letters', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"letters","prompt":"Which letter comes before \"e\"?","answer":"d"},
        {"id":26,"type":"letters","prompt":"Which letter comes before \"m\"?","answer":"l"},
        {"id":27,"type":"letters","prompt":"r, s, __","answer":"t"}
]);
    });
});

describe('letters — Year 2', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"letters","prompt":"Which letter comes before \"c\"?","answer":"b"},
        {"id":2,"type":"letters","prompt":"Which letter comes before \"n\"?","answer":"m"},
        {"id":3,"type":"letters","prompt":"Which letter comes after \"l\"?","answer":"m"},
        {"id":4,"type":"letters","prompt":"Which letter comes before \"u\"?","answer":"t"},
        {"id":5,"type":"letters","prompt":"t, u, __","answer":"v"},
        {"id":6,"type":"letters","prompt":"Which letter comes before \"v\"?","answer":"u"},
        {"id":7,"type":"letters","prompt":"c, d, __","answer":"e"},
        {"id":8,"type":"letters","prompt":"Which letter comes before \"q\"?","answer":"p"},
        {"id":9,"type":"letters","prompt":"Which letter comes after \"q\"?","answer":"r"},
        {"id":10,"type":"letters","prompt":"Which letter comes after \"j\"?","answer":"k"},
        {"id":11,"type":"letters","prompt":"u, v, __","answer":"w"},
        {"id":12,"type":"letters","prompt":"Which letter comes after \"y\"?","answer":"z"},
        {"id":13,"type":"letters","prompt":"t, u, __","answer":"v"},
        {"id":14,"type":"letters","prompt":"i, j, __","answer":"k"},
        {"id":15,"type":"letters","prompt":"s, t, __","answer":"u"},
        {"id":16,"type":"letters","prompt":"Which letter comes after \"t\"?","answer":"u"},
        {"id":17,"type":"letters","prompt":"Which letter comes before \"e\"?","answer":"d"},
        {"id":18,"type":"letters","prompt":"v, w, __","answer":"x"},
        {"id":19,"type":"letters","prompt":"Which letter comes before \"n\"?","answer":"m"},
        {"id":20,"type":"letters","prompt":"Which letter comes after \"t\"?","answer":"u"},
        {"id":21,"type":"letters","prompt":"Which letter comes before \"l\"?","answer":"k"},
        {"id":22,"type":"letters","prompt":"Which letter comes after \"f\"?","answer":"g"},
        {"id":23,"type":"letters","prompt":"w, x, __","answer":"y"},
        {"id":24,"type":"letters","prompt":"Which letter comes before \"k\"?","answer":"j"}
]);
        checkAlphabetTruths(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(lettersSpec, g2, seedFrom([2, 'letters', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"letters","prompt":"Which letter comes after \"l\"?","answer":"m"},
        {"id":26,"type":"letters","prompt":"b, c, __","answer":"d"},
        {"id":27,"type":"letters","prompt":"Which letter comes after \"y\"?","answer":"z"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(lettersSpec, getGradeConfig(3), seedFrom([3, 'letters', 0]))).toEqual([]);
    });
});
