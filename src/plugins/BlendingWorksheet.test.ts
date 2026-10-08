// Unit tests for the BLENDING worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm, word banks, or caps
// change, these exact assertions fail — which is what we want, so a silent
// change to the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { blendSpec } from './BlendingWorksheet';

const g0 = getGradeConfig(0);
const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(blendSpec, grade, seedFrom([grade.id, blendSpec.id, 0]));
}

describe('blend plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(blendSpec.id).toBe('blend');
        expect(blendSpec.label).toBe('Blending');
        expect(blendSpec.icon).toBe('ab');
        expect(blendSpec.perPage).toBe(24);
    });

    it('describes its word-set scope from the grade caps', () => {
        expect(blendSpec.scope(g1)).toBe('letters, word set 2');
        expect(blendSpec.scope(g2)).toBe('letters, word set 3');
    });

    it('is gated by the grade catalogue (Year 1..6 offer it, Year 7 does not)', () => {
        expect(blendSpec.offered(g0)).toBe(false);
        expect(blendSpec.offered(g1)).toBe(true);
        expect(blendSpec.offered(g2)).toBe(true);
        expect(blendSpec.offered(getGradeConfig(3))).toBe(true);
        expect(blendSpec.offered(getGradeConfig(6))).toBe(true);
        expect(blendSpec.offered(getGradeConfig(7))).toBe(false);
        // Unoffered type => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(blendSpec, g0, seedFrom([0, 'blend', 0]))).toEqual([]);
    });
});

// Semantic invariants: every generator kind is answerable from the prompt
// alone (see BlendingWorksheet.ts):
//   all-shown  — the printed letters ARE the answer
//   blanks     — the non-blank letters match the answer position-for-position
//   unscramble — the printed letters are a permutation of the answer's
//   backwards  — the printed word reversed IS the answer
function checkReconstitutes(grade: GradeConfig) {
    for (const p of sheet(grade)) {
        const shown = p.prompt.match(/^What word is: ([a-z ]+)\?$/);
        const blanks = p.prompt.match(/^Finish the word: ((?:__|[a-z])(?: (?:__|[a-z]))*)$/);
        const scrambled = p.prompt.match(/^Unscramble the letters: ([a-z ]+)$/);
        const backwards = p.prompt.match(/^What word is "([a-z]+)" spelled backwards\?$/);
        if (shown) {
            expect(shown[1].split(' ').join('')).toBe(p.answer);
        } else if (blanks) {
            const parts = blanks[1].split(' ');
            expect(p.answer.length).toBe(parts.length);
            for (let i = 0; i < parts.length; i++) expect(parts[i] === '__' || p.answer[i] === parts[i]).toBe(true);
        } else if (scrambled) {
            const sort = (s: string) => s.split('').sort().join('');
            expect(sort(scrambled[1].split(' ').join(''))).toBe(sort(p.answer));
        } else if (backwards) {
            expect(backwards[1].split('').reverse().join('')).toBe(p.answer);
        } else {
            // Every prompt must fall into exactly one of the four kinds.
            throw new Error(`unrecognised blend prompt: ${p.prompt}`);
        }
    }
}

describe('blend — Year 1 (tier-2 common word set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"prompt":"Finish the word: __ e __","answer":"leg","id":1,"type":"blend"},
        {"prompt":"What word is \"nomel\" spelled backwards?","answer":"lemon","visual":"lemon","id":2,"type":"blend"},
        {"prompt":"Unscramble the letters: e a l n p","answer":"plane","visual":"plane","id":3,"type":"blend"},
        {"prompt":"Finish the word: h __ t","answer":"hat","visual":"hat","id":4,"type":"blend"},
        {"prompt":"Finish the word: t i __ e r","answer":"tiger","visual":"tiger","id":5,"type":"blend"},
        {"prompt":"What word is: p i g?","answer":"pig","visual":"pig","id":6,"type":"blend"},
        {"prompt":"Finish the word: p e __","answer":"pen","visual":"pen","id":7,"type":"blend"},
        {"prompt":"Finish the word: __ __ n","answer":"pin","id":8,"type":"blend"},
        {"prompt":"Unscramble the letters: r e w t a","answer":"water","visual":"water","id":9,"type":"blend"},
        {"prompt":"Unscramble the letters: i s r h t","answer":"shirt","id":10,"type":"blend"},
        {"prompt":"Finish the word: a __ p l __","answer":"apple","visual":"apple","id":11,"type":"blend"},
        {"prompt":"Unscramble the letters: a h c i r","answer":"chair","visual":"chair","id":12,"type":"blend"},
        {"prompt":"What word is: p o t?","answer":"pot","visual":"pot","id":13,"type":"blend"},
        {"prompt":"Unscramble the letters: n t e","answer":"net","visual":"net","id":14,"type":"blend"},
        {"prompt":"Unscramble the letters: a i t n r","answer":"train","visual":"train","id":15,"type":"blend"},
        {"prompt":"Finish the word: g __ e __ n","answer":"green","visual":"green","id":16,"type":"blend"},
        {"prompt":"Unscramble the letters: r e a b d","answer":"bread","visual":"bread","id":17,"type":"blend"},
        {"prompt":"Unscramble the letters: r s g s a","answer":"grass","id":18,"type":"blend"},
        {"prompt":"What word is: m o o n?","answer":"moon","visual":"moon","id":19,"type":"blend"},
        {"prompt":"What word is: t r e e?","answer":"tree","visual":"tree","id":20,"type":"blend"},
        {"prompt":"What word is \"giw\" spelled backwards?","answer":"wig","id":21,"type":"blend"},
        {"prompt":"Finish the word: d __ g","answer":"dog","visual":"dog","id":22,"type":"blend"},
        {"prompt":"Finish the word: __ a t","answer":"cat","visual":"cat","id":23,"type":"blend"},
        {"prompt":"What word is: t o p?","answer":"top","visual":"top","id":24,"type":"blend"}
        ]);
        checkReconstitutes(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(blendSpec, g1, seedFrom([1, 'blend', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Unscramble the letters: g b a","answer":"bag","visual":"bag","id":25,"type":"blend"},
        {"prompt":"What word is \"hsif\" spelled backwards?","answer":"fish","visual":"fish","id":26,"type":"blend"},
        {"prompt":"Finish the word: __ i g h t","answer":"light","visual":"light","id":27,"type":"blend"}
        ]);
    });
});

describe('blend — Year 2 (tier-3 extended set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"prompt":"What word is: l e m o n?","answer":"lemon","visual":"lemon","id":1,"type":"blend"},
        {"prompt":"Unscramble the letters: i p g","answer":"pig","visual":"pig","id":2,"type":"blend"},
        {"prompt":"Unscramble the letters: p p l e a","answer":"apple","visual":"apple","id":3,"type":"blend"},
        {"prompt":"Finish the word: c __ __","answer":"cat","visual":"cat","id":4,"type":"blend"},
        {"prompt":"Finish the word: __ o x","answer":"box","visual":"box","id":5,"type":"blend"},
        {"prompt":"What word is \"wodniw\" spelled backwards?","answer":"window","visual":"window","id":6,"type":"blend"},
        {"prompt":"Unscramble the letters: n s u","answer":"sun","visual":"sun","id":7,"type":"blend"},
        {"prompt":"What word is: g r a s s?","answer":"grass","id":8,"type":"blend"},
        {"prompt":"Finish the word: __ r e e","answer":"tree","visual":"tree","id":9,"type":"blend"},
        {"prompt":"Unscramble the letters: b n o t t u","answer":"button","id":10,"type":"blend"},
        {"prompt":"Finish the word: s i __","answer":"sip","id":11,"type":"blend"},
        {"prompt":"Finish the word: r __ b b i t","answer":"rabbit","visual":"rabbit","id":12,"type":"blend"},
        {"prompt":"What word is: g a r d e n?","answer":"garden","id":13,"type":"blend"},
        {"prompt":"What word is \"enalp\" spelled backwards?","answer":"plane","visual":"plane","id":14,"type":"blend"},
        {"prompt":"What word is: n i g h t?","answer":"night","visual":"night","id":15,"type":"blend"},
        {"prompt":"Unscramble the letters: a p m","answer":"map","visual":"map","id":16,"type":"blend"},
        {"prompt":"Finish the word: __ i s __","answer":"fish","visual":"fish","id":17,"type":"blend"},
        {"prompt":"Finish the word: __ e t","answer":"net","visual":"net","id":18,"type":"blend"},
        {"prompt":"Finish the word: t __ __","answer":"top","visual":"top","id":19,"type":"blend"},
        {"prompt":"Finish the word: l __ g","answer":"log","id":20,"type":"blend"},
        {"prompt":"Finish the word: __ __ e a d","answer":"bread","visual":"bread","id":21,"type":"blend"},
        {"prompt":"Unscramble the letters: c h l o o s","answer":"school","visual":"school","id":22,"type":"blend"},
        {"prompt":"Finish the word: b __ d","answer":"bed","visual":"bed","id":23,"type":"blend"},
        {"prompt":"What word is \"nip\" spelled backwards?","answer":"pin","id":24,"type":"blend"}
        ]);
        checkReconstitutes(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(blendSpec, g2, seedFrom([2, 'blend', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Finish the word: f a __ i __ y","answer":"family","id":25,"type":"blend"},
        {"prompt":"Finish the word: f __ n","answer":"fan","visual":"fan","id":26,"type":"blend"},
        {"prompt":"Finish the word: __ r a i __","answer":"train","visual":"train","id":27,"type":"blend"}
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(blendSpec, getGradeConfig(7), seedFrom([7, 'blend', 0]))).toEqual([]);
    });
});
