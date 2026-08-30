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

    it('is gated by the grade catalogue (Year 1 and Year 2 only)', () => {
        expect(blendSpec.offered(g0)).toBe(false);
        expect(blendSpec.offered(g1)).toBe(true);
        expect(blendSpec.offered(g2)).toBe(true);
        expect(blendSpec.offered(getGradeConfig(3))).toBe(false);
        // Unoffered type => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(blendSpec, g0, seedFrom([0, 'blend', 0]))).toEqual([]);
    });
});

// Semantic invariant: the printed letters reconstitute the answer — either
// every letter is shown, or exactly one is the blanked first/last letter.
function checkReconstitutes(grade: GradeConfig) {
    for (const p of sheet(grade)) {
        const body = p.prompt.replace('What word is: ', '').replace('Finish the word: ', '').replace('?', '').trim();
        const parts = body.split(/ +/);
        const blankIdx = parts.indexOf('__');
        if (blankIdx === -1) {
            expect(parts.join('')).toBe(p.answer);
        } else {
            expect(p.answer.length).toBe(parts.length);
            for (let i = 0; i < parts.length; i++) expect(parts[i] === '__' || p.answer[i] === parts[i]).toBe(true);
        }
    }
}

describe('blend — Year 1 (tier-2 common word set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"id":1,"type":"blend","prompt":"Finish the word: l e __","answer":"leg"},
        {"id":2,"type":"blend","prompt":"What word is: h o u s e?","answer":"house"},
        {"id":3,"type":"blend","prompt":"Finish the word: c u __","answer":"cup"},
        {"id":4,"type":"blend","prompt":"What word is: r e d?","answer":"red"},
        {"id":5,"type":"blend","prompt":"Finish the word: t o __","answer":"top"},
        {"id":6,"type":"blend","prompt":"Finish the word: t r a i __","answer":"train"},
        {"id":7,"type":"blend","prompt":"Finish the word: s u __","answer":"sun"},
        {"id":8,"type":"blend","prompt":"Finish the word: __ a t e r","answer":"water"},
        {"id":9,"type":"blend","prompt":"What word is: f a n?","answer":"fan"},
        {"id":10,"type":"blend","prompt":"What word is: n i g h t?","answer":"night"},
        {"id":11,"type":"blend","prompt":"What word is: m o o n?","answer":"moon"},
        {"id":12,"type":"blend","prompt":"What word is: c a t?","answer":"cat"},
        {"id":13,"type":"blend","prompt":"What word is: b u s?","answer":"bus"},
        {"id":14,"type":"blend","prompt":"What word is: w a t e r?","answer":"water"},
        {"id":15,"type":"blend","prompt":"What word is: b i r d?","answer":"bird"},
        {"id":16,"type":"blend","prompt":"Finish the word: g r e e __","answer":"green"},
        {"id":17,"type":"blend","prompt":"Finish the word: b o __","answer":"box"},
        {"id":18,"type":"blend","prompt":"Finish the word: __ h i r t","answer":"shirt"},
        {"id":19,"type":"blend","prompt":"Finish the word: t o __","answer":"top"},
        {"id":20,"type":"blend","prompt":"Finish the word: p i __","answer":"pig"},
        {"id":21,"type":"blend","prompt":"Finish the word: w i __","answer":"wig"},
        {"id":22,"type":"blend","prompt":"What word is: n e t?","answer":"net"},
        {"id":23,"type":"blend","prompt":"What word is: p o t?","answer":"pot"},
        {"id":24,"type":"blend","prompt":"Finish the word: h o u s __","answer":"house"}
]);
        checkReconstitutes(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(blendSpec, g1, seedFrom([1, 'blend', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"blend","prompt":"What word is: c h a i r?","answer":"chair"},
        {"id":26,"type":"blend","prompt":"Finish the word: __ i g e r","answer":"tiger"},
        {"id":27,"type":"blend","prompt":"Finish the word: __ r e e n","answer":"green"}
]);
    });
});

describe('blend — Year 2 (tier-3 extended set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"blend","prompt":"What word is: l e m o n?","answer":"lemon"},
        {"id":2,"type":"blend","prompt":"What word is: w a t e r?","answer":"water"},
        {"id":3,"type":"blend","prompt":"Finish the word: __ a n","answer":"fan"},
        {"id":4,"type":"blend","prompt":"Finish the word: s u __","answer":"sun"},
        {"id":5,"type":"blend","prompt":"Finish the word: __ r e e n","answer":"green"},
        {"id":6,"type":"blend","prompt":"What word is: a p p l e?","answer":"apple"},
        {"id":7,"type":"blend","prompt":"What word is: b a g?","answer":"bag"},
        {"id":8,"type":"blend","prompt":"What word is: b a n a n a?","answer":"banana"},
        {"id":9,"type":"blend","prompt":"Finish the word: __ i g e r","answer":"tiger"},
        {"id":10,"type":"blend","prompt":"Finish the word: __ a b l e","answer":"table"},
        {"id":11,"type":"blend","prompt":"Finish the word: b u t t o __","answer":"button"},
        {"id":12,"type":"blend","prompt":"Finish the word: __ i n","answer":"pin"},
        {"id":13,"type":"blend","prompt":"Finish the word: __ i s h","answer":"fish"},
        {"id":14,"type":"blend","prompt":"What word is: p i n?","answer":"pin"},
        {"id":15,"type":"blend","prompt":"Finish the word: m o o __","answer":"moon"},
        {"id":16,"type":"blend","prompt":"Finish the word: __ r a i n","answer":"train"},
        {"id":17,"type":"blend","prompt":"Finish the word: b a __","answer":"bag"},
        {"id":18,"type":"blend","prompt":"Finish the word: __ o g","answer":"log"},
        {"id":19,"type":"blend","prompt":"Finish the word: __ o p","answer":"top"},
        {"id":20,"type":"blend","prompt":"Finish the word: t i g e __","answer":"tiger"},
        {"id":21,"type":"blend","prompt":"What word is: c u p?","answer":"cup"},
        {"id":22,"type":"blend","prompt":"Finish the word: __ a m i l y","answer":"family"},
        {"id":23,"type":"blend","prompt":"What word is: c u p?","answer":"cup"},
        {"id":24,"type":"blend","prompt":"What word is: r a t?","answer":"rat"}
]);
        checkReconstitutes(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(blendSpec, g2, seedFrom([2, 'blend', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"blend","prompt":"What word is: b u s?","answer":"bus"},
        {"id":26,"type":"blend","prompt":"Finish the word: __ u n","answer":"sun"},
        {"id":27,"type":"blend","prompt":"Finish the word: __ i n d o w","answer":"window"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(blendSpec, getGradeConfig(3), seedFrom([3, 'blend', 0]))).toEqual([]);
    });
});
