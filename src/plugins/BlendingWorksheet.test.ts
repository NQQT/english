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
        {"id":1,"type":"blend","prompt":"Finish the word: __ e g","answer":"leg"},
        {"id":2,"type":"blend","prompt":"What word is: l e m o n?","answer":"lemon"},
        {"id":3,"type":"blend","prompt":"Finish the word: p l a __ e","answer":"plane"},
        {"id":4,"type":"blend","prompt":"Finish the word: r e __","answer":"red"},
        {"id":5,"type":"blend","prompt":"What word is: h a t?","answer":"hat"},
        {"id":6,"type":"blend","prompt":"Finish the word: t i __ e r","answer":"tiger"},
        {"id":7,"type":"blend","prompt":"Finish the word: p i __","answer":"pig"},
        {"id":8,"type":"blend","prompt":"Finish the word: p e __","answer":"pen"},
        {"id":9,"type":"blend","prompt":"What word is: w a t e r?","answer":"water"},
        {"id":10,"type":"blend","prompt":"What word is: s h i r t?","answer":"shirt"},
        {"id":11,"type":"blend","prompt":"Finish the word: a p p l __","answer":"apple"},
        {"id":12,"type":"blend","prompt":"What word is: s u n?","answer":"sun"},
        {"id":13,"type":"blend","prompt":"Finish the word: __ h a i r","answer":"chair"},
        {"id":14,"type":"blend","prompt":"What word is: p o t?","answer":"pot"},
        {"id":15,"type":"blend","prompt":"What word is: n e t?","answer":"net"},
        {"id":16,"type":"blend","prompt":"Finish the word: t r __ i n","answer":"train"},
        {"id":17,"type":"blend","prompt":"What word is: g r e e n?","answer":"green"},
        {"id":18,"type":"blend","prompt":"Finish the word: __ r e a d","answer":"bread"},
        {"id":19,"type":"blend","prompt":"Finish the word: g r a s __","answer":"grass"},
        {"id":20,"type":"blend","prompt":"What word is: m o o n?","answer":"moon"},
        {"id":21,"type":"blend","prompt":"Finish the word: t r e __","answer":"tree"},
        {"id":22,"type":"blend","prompt":"What word is: w i g?","answer":"wig"},
        {"id":23,"type":"blend","prompt":"Finish the word: __ o g","answer":"dog"},
        {"id":24,"type":"blend","prompt":"Finish the word: c a __","answer":"cat"}
]);
        checkReconstitutes(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(blendSpec, g1, seedFrom([1, 'blend', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"blend","prompt":"Finish the word: t __ p","answer":"top"},
        {"id":26,"type":"blend","prompt":"Finish the word: __ a g","answer":"bag"},
        {"id":27,"type":"blend","prompt":"What word is: f i s h?","answer":"fish"}
]);
    });
});

describe('blend — Year 2 (tier-3 extended set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"blend","prompt":"What word is: l e m o n?","answer":"lemon"},
        {"id":2,"type":"blend","prompt":"Finish the word: p i __","answer":"pig"},
        {"id":3,"type":"blend","prompt":"Finish the word: a p __ l e","answer":"apple"},
        {"id":4,"type":"blend","prompt":"Finish the word: c a __","answer":"cat"},
        {"id":5,"type":"blend","prompt":"What word is: b o x?","answer":"box"},
        {"id":6,"type":"blend","prompt":"What word is: w i n d o w?","answer":"window"},
        {"id":7,"type":"blend","prompt":"What word is: s u n?","answer":"sun"},
        {"id":8,"type":"blend","prompt":"Finish the word: __ r a s s","answer":"grass"},
        {"id":9,"type":"blend","prompt":"Finish the word: __ r e e","answer":"tree"},
        {"id":10,"type":"blend","prompt":"Finish the word: b u __ t o n","answer":"button"},
        {"id":11,"type":"blend","prompt":"Finish the word: __ i p","answer":"sip"},
        {"id":12,"type":"blend","prompt":"What word is: r a b b i t?","answer":"rabbit"},
        {"id":13,"type":"blend","prompt":"Finish the word: g a r __ e n","answer":"garden"},
        {"id":14,"type":"blend","prompt":"Finish the word: p l a n __","answer":"plane"},
        {"id":15,"type":"blend","prompt":"What word is: n i g h t?","answer":"night"},
        {"id":16,"type":"blend","prompt":"What word is: m a p?","answer":"map"},
        {"id":17,"type":"blend","prompt":"Finish the word: __ i s h","answer":"fish"},
        {"id":18,"type":"blend","prompt":"What word is: n e t?","answer":"net"},
        {"id":19,"type":"blend","prompt":"Finish the word: t o __","answer":"top"},
        {"id":20,"type":"blend","prompt":"What word is: l o g?","answer":"log"},
        {"id":21,"type":"blend","prompt":"Finish the word: __ r e a d","answer":"bread"},
        {"id":22,"type":"blend","prompt":"Finish the word: s c h o o __","answer":"school"},
        {"id":23,"type":"blend","prompt":"Finish the word: b __ d","answer":"bed"},
        {"id":24,"type":"blend","prompt":"Finish the word: __ i n","answer":"pin"}
]);
        checkReconstitutes(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(blendSpec, g2, seedFrom([2, 'blend', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"blend","prompt":"Finish the word: f a __ i l y","answer":"family"},
        {"id":26,"type":"blend","prompt":"What word is: f a n?","answer":"fan"},
        {"id":27,"type":"blend","prompt":"What word is: t r a i n?","answer":"train"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(blendSpec, getGradeConfig(3), seedFrom([3, 'blend', 0]))).toEqual([]);
    });
});
