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

    it('is gated by the grade catalogue (Years 0..6 offer it, Year 7 does not)', () => {
        expect(lettersSpec.offered(g0)).toBe(true);
        expect(lettersSpec.offered(g1)).toBe(true);
        expect(lettersSpec.offered(g2)).toBe(true);
        expect(lettersSpec.offered(getGradeConfig(3))).toBe(true);
        expect(lettersSpec.offered(getGradeConfig(6))).toBe(true);
        expect(lettersSpec.offered(getGradeConfig(7))).toBe(false);
    });
});

// Semantic invariants: every generator kind is answerable from the prompt
// alone (see AlphabetOrderWorksheet.ts lines 60-160):
//   after/before X (lower or UPPERCASE) → neighbour letter
//   runs "a, b, __" / "a, b, c, __"     → continue the run's step (+1/-1)
//   skip runs "a, c, __"                → continue the step (+2/-2)
//   gap "a, __, c"                      → the middle letter
//   positions 1st..26th (start / end)   → that letter of the alphabet
//   word order                          → the alphabetically first/last option
function checkAlphabetTruths(grade: GradeConfig) {
    const A = 97;
    const L = (n: number) => String.fromCharCode(A + n);
    for (const p of sheet(grade)) {
        const after = p.prompt.match(/after "([a-z])"/);
        const before = p.prompt.match(/before "([a-z])"/);
        const upAfter = p.prompt.match(/UPPERCASE letter comes after "([A-Z])"/);
        const upBefore = p.prompt.match(/UPPERCASE letter comes before "([A-Z])"/);
        const run2 = p.prompt.match(/^([a-z]), ([a-z]), __$/);
        const run3 = p.prompt.match(/^([a-z]), ([a-z]), ([a-z]), __$/);
        const gap = p.prompt.match(/^([a-z]), __, ([a-z])$/);
        const pos = p.prompt.match(/^Which is the (\d+)(?:st|nd|rd|th) letter of the alphabet\?$/);
        const posEnd = p.prompt.match(/^Which is the (\d+)(?:st|nd|rd|th) letter from the end of the alphabet\?$/);
        const first = p.prompt.match(/^Which word comes first in the alphabet\? \(([^)]+)\)$/);
        const last = p.prompt.match(/^Which word comes last in the alphabet\? \(([^)]+)\)$/);
        if (after) {
            const c = after[1].charCodeAt(0) - A;
            expect(p.answer).toBe(L(c + 1));
        } else if (before) {
            const c = before[1].charCodeAt(0) - A;
            expect(p.answer).toBe(L(c - 1));
        } else if (upAfter) {
            expect(p.answer).toBe(String.fromCharCode(upAfter[1].charCodeAt(0) + 1));
        } else if (upBefore) {
            expect(p.answer).toBe(String.fromCharCode(upBefore[1].charCodeAt(0) - 1));
        } else if (run3) {
            const [a, b, c] = [run3[1], run3[2], run3[3]].map((ch) => ch.charCodeAt(0) - A);
            // A three-letter run: a consistent ±1 step continues to the answer.
            expect(b - a).toBe(c - b);
            expect(Math.abs(b - a)).toBe(1);
            expect(p.answer).toBe(L(c + (b - a)));
        } else if (run2) {
            const a = run2[1].charCodeAt(0) - A;
            const b = run2[2].charCodeAt(0) - A;
            // A two-letter run: ±1 continues the run, ±2 is a skip-one run;
            // the answer always continues the SAME step.
            expect([1, -1, 2, -2]).toContain(b - a);
            expect(p.answer).toBe(L(b + (b - a)));
        } else if (gap) {
            const a = gap[1].charCodeAt(0) - A;
            const c = gap[2].charCodeAt(0) - A;
            // The shown letters bracket a three-letter run; the answer fills
            // the middle.
            expect(c - a).toBe(2);
            expect(p.answer).toBe(L(a + 1));
        } else if (pos) {
            expect(p.answer).toBe(L(Number(pos[1]) - 1));
        } else if (posEnd) {
            expect(p.answer).toBe(L(26 - Number(posEnd[1])));
        } else if (first) {
            expect(p.answer).toBe(first[1].split(', ').sort()[0]);
        } else if (last) {
            const options = last[1].split(', ');
            expect(p.answer).toBe(options.sort()[options.length - 1]);
        } else {
            // Every prompt must fall into exactly one of the kinds above.
            throw new Error(`unrecognised letters prompt: ${p.prompt}`);
        }
    }
}

describe('letters — Prep (grade 0)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g0)).toEqual([
        {"prompt":"Which word comes last in the alphabet? (leg, bus, wig)","answer":"wig","id":1,"type":"letters"},
        {"prompt":"h, i, __","answer":"j","id":2,"type":"letters"},
        {"prompt":"f, __, h","answer":"g","id":3,"type":"letters"},
        {"prompt":"w, __, y","answer":"x","id":4,"type":"letters"},
        {"prompt":"Which word comes first in the alphabet? (sip, net, bag)","answer":"bag","id":5,"type":"letters"},
        {"prompt":"a, __, c","answer":"b","id":6,"type":"letters"},
        {"prompt":"j, l, __","answer":"n","id":7,"type":"letters"},
        {"prompt":"k, __, m","answer":"l","id":8,"type":"letters"},
        {"prompt":"Which UPPERCASE letter comes before \"F\"?","answer":"E","id":9,"type":"letters"},
        {"prompt":"r, s, __","answer":"t","id":10,"type":"letters"},
        {"prompt":"Which word comes first in the alphabet? (log, box, pin)","answer":"box","id":11,"type":"letters"},
        {"prompt":"s, q, __","answer":"o","id":12,"type":"letters"},
        {"prompt":"Which is the 6th letter from the end of the alphabet?","answer":"u","id":13,"type":"letters"},
        {"prompt":"Which word comes last in the alphabet? (rat, pot, pig)","answer":"rat","id":14,"type":"letters"},
        {"prompt":"l, m, n, __","answer":"o","id":15,"type":"letters"},
        {"prompt":"m, n, __","answer":"o","id":16,"type":"letters"},
        {"prompt":"Which UPPERCASE letter comes after \"H\"?","answer":"I","id":17,"type":"letters"},
        {"prompt":"Which letter comes after \"r\"?","answer":"s","id":18,"type":"letters"},
        {"prompt":"Which is the 5th letter from the end of the alphabet?","answer":"v","id":19,"type":"letters"},
        {"prompt":"Which letter comes after \"w\"?","answer":"x","id":20,"type":"letters"},
        {"prompt":"v, w, x, __","answer":"y","id":21,"type":"letters"},
        {"prompt":"v, u, t, __","answer":"s","id":22,"type":"letters"},
        {"prompt":"Which is the 7th letter of the alphabet?","answer":"g","id":23,"type":"letters"},
        {"prompt":"p, r, __","answer":"t","id":24,"type":"letters"}
        ]);
        checkAlphabetTruths(g0);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(lettersSpec, g0, seedFrom([0, 'letters', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Which is the 4th letter of the alphabet?","answer":"d","id":25,"type":"letters"},
        {"prompt":"Which UPPERCASE letter comes before \"G\"?","answer":"F","id":26,"type":"letters"},
        {"prompt":"Which is the 21st letter from the end of the alphabet?","answer":"f","id":27,"type":"letters"}
        ]);
    });
});

describe('letters — Year 1', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"prompt":"f, h, __","answer":"j","tileBlanks":"letter","id":1,"type":"letters"},
        {"prompt":"Which word comes last in the alphabet? (fan, apple, house)","answer":"house","id":2,"type":"letters"},
        {"prompt":"i, j, __","answer":"k","tileBlanks":"letter","id":3,"type":"letters"},
        {"prompt":"t, s, r, __","answer":"q","tileBlanks":"letter","id":4,"type":"letters"},
        {"prompt":"Which UPPERCASE letter comes after \"T\"?","answer":"U","id":5,"type":"letters"},
        {"prompt":"e, c, __","answer":"a","tileBlanks":"letter","id":6,"type":"letters"},
        {"prompt":"Which word comes last in the alphabet? (grass, pot, top)","answer":"top","id":7,"type":"letters"},
        {"prompt":"Which letter comes before \"b\"?","answer":"a","id":8,"type":"letters"},
        {"prompt":"u, v, __","answer":"w","tileBlanks":"letter","id":9,"type":"letters"},
        {"prompt":"u, s, __","answer":"q","tileBlanks":"letter","id":10,"type":"letters"},
        {"prompt":"Which is the 8th letter of the alphabet?","answer":"h","id":11,"type":"letters"},
        {"prompt":"Which letter comes after \"d\"?","answer":"e","id":12,"type":"letters"},
        {"prompt":"l, n, __","answer":"p","tileBlanks":"letter","id":13,"type":"letters"},
        {"prompt":"Which word comes first in the alphabet? (rabbit, cat, moon)","answer":"cat","id":14,"type":"letters"},
        {"prompt":"k, j, __","answer":"i","tileBlanks":"letter","id":15,"type":"letters"},
        {"prompt":"Which UPPERCASE letter comes after \"G\"?","answer":"H","id":16,"type":"letters"},
        {"prompt":"t, v, __","answer":"x","tileBlanks":"letter","id":17,"type":"letters"},
        {"prompt":"Which letter comes before \"q\"?","answer":"p","id":18,"type":"letters"},
        {"prompt":"Which letter comes before \"k\"?","answer":"j","id":19,"type":"letters"},
        {"prompt":"Which letter comes before \"l\"?","answer":"k","id":20,"type":"letters"},
        {"prompt":"Which is the 2nd letter from the end of the alphabet?","answer":"y","id":21,"type":"letters"},
        {"prompt":"Which UPPERCASE letter comes after \"Y\"?","answer":"Z","id":22,"type":"letters"},
        {"prompt":"v, w, __","answer":"x","tileBlanks":"letter","id":23,"type":"letters"},
        {"prompt":"m, n, o, __","answer":"p","tileBlanks":"letter","id":24,"type":"letters"}
        ]);
        checkAlphabetTruths(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(lettersSpec, g1, seedFrom([1, 'letters', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"o, m, __","answer":"k","tileBlanks":"letter","id":25,"type":"letters"},
        {"prompt":"Which UPPERCASE letter comes before \"L\"?","answer":"K","id":26,"type":"letters"},
        {"prompt":"m, __, o","answer":"n","tileBlanks":"letter","id":27,"type":"letters"}
        ]);
    });
});

describe('letters — Year 2', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"prompt":"Which word comes first in the alphabet? (shirt, light, cat)","answer":"cat","id":1,"type":"letters"},
        {"prompt":"h, i, j, __","answer":"k","tileBlanks":"letter","id":2,"type":"letters"},
        {"prompt":"h, g, __","answer":"f","tileBlanks":"letter","id":3,"type":"letters"},
        {"prompt":"c, d, __","answer":"e","tileBlanks":"letter","id":4,"type":"letters"},
        {"prompt":"Which is the 8th letter from the end of the alphabet?","answer":"s","id":5,"type":"letters"},
        {"prompt":"Which word comes last in the alphabet? (bird, water, map)","answer":"water","id":6,"type":"letters"},
        {"prompt":"u, __, w","answer":"v","tileBlanks":"letter","id":7,"type":"letters"},
        {"prompt":"Which is the 6th letter from the end of the alphabet?","answer":"u","id":8,"type":"letters"},
        {"prompt":"g, h, i, __","answer":"j","tileBlanks":"letter","id":9,"type":"letters"},
        {"prompt":"f, d, __","answer":"b","tileBlanks":"letter","id":10,"type":"letters"},
        {"prompt":"Which letter comes before \"s\"?","answer":"r","id":11,"type":"letters"},
        {"prompt":"Which is the 15th letter of the alphabet?","answer":"o","id":12,"type":"letters"},
        {"prompt":"Which is the 15th letter from the end of the alphabet?","answer":"l","id":13,"type":"letters"},
        {"prompt":"x, w, v, __","answer":"u","tileBlanks":"letter","id":14,"type":"letters"},
        {"prompt":"l, __, n","answer":"m","tileBlanks":"letter","id":15,"type":"letters"},
        {"prompt":"i, k, __","answer":"m","tileBlanks":"letter","id":16,"type":"letters"},
        {"prompt":"Which is the 23rd letter of the alphabet?","answer":"w","id":17,"type":"letters"},
        {"prompt":"Which letter comes before \"g\"?","answer":"f","id":18,"type":"letters"},
        {"prompt":"l, k, j, __","answer":"i","tileBlanks":"letter","id":19,"type":"letters"},
        {"prompt":"Which UPPERCASE letter comes after \"E\"?","answer":"F","id":20,"type":"letters"},
        {"prompt":"Which letter comes after \"v\"?","answer":"w","id":21,"type":"letters"},
        {"prompt":"f, e, d, __","answer":"c","tileBlanks":"letter","id":22,"type":"letters"},
        {"prompt":"f, h, __","answer":"j","tileBlanks":"letter","id":23,"type":"letters"},
        {"prompt":"b, c, d, __","answer":"e","tileBlanks":"letter","id":24,"type":"letters"}
        ]);
        checkAlphabetTruths(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(lettersSpec, g2, seedFrom([2, 'letters', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Which UPPERCASE letter comes before \"Y\"?","answer":"X","id":25,"type":"letters"},
        {"prompt":"Which is the 3rd letter from the end of the alphabet?","answer":"x","id":26,"type":"letters"},
        {"prompt":"v, w, x, __","answer":"y","tileBlanks":"letter","id":27,"type":"letters"}
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(lettersSpec, getGradeConfig(7), seedFrom([7, 'letters', 0]))).toEqual([]);
    });
});
