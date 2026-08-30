// Unit tests for the SPELLING worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm, triple bank, or caps
// change, these exact assertions fail — which is what we want, so a silent
// change to the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { spellingSpec } from './SpellingWorksheet';

const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(spellingSpec, grade, seedFrom([grade.id, spellingSpec.id, 0]));
}

describe('spelling plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(spellingSpec.id).toBe('spelling');
        expect(spellingSpec.label).toBe('Spelling');
        expect(spellingSpec.icon).toBe('✎');
        expect(spellingSpec.perPage).toBe(18);
    });

    it('describes its word scope from the grade caps (short vs +tricky)', () => {
        expect(spellingSpec.scope(g1)).toBe('short words');
        expect(spellingSpec.scope(g2)).toBe('short & tricky words');
    });

    it('is gated by the grade catalogue (Year 1 and Year 2 only)', () => {
        expect(spellingSpec.offered(getGradeConfig(0))).toBe(false);
        expect(spellingSpec.offered(g1)).toBe(true);
        expect(spellingSpec.offered(g2)).toBe(true);
        expect(spellingSpec.offered(getGradeConfig(3))).toBe(false);
    });
});

// Semantic invariant: the answer is one of the three printed options.
function checkOptionsContainAnswer(grade: GradeConfig) {
    for (const p of sheet(grade)) {
        const m = p.prompt.match(/\(([^)]+)\)\s*$/);
        expect(m).not.toBeNull();
        const options = m![1].split(', ').map((s) => s.trim());
        expect(options).toContain(p.answer);
    }
}

describe('spelling — Year 1 (short words)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"id":1,"type":"spelling","prompt":"Which word is spelled correctly? (doog, doge, dog)","answer":"dog"},
        {"id":2,"type":"spelling","prompt":"Which word is spelled correctly? (bired, bird, brid)","answer":"bird"},
        {"id":3,"type":"spelling","prompt":"Which word is spelled correctly? (bired, brid, bird)","answer":"bird"},
        {"id":4,"type":"spelling","prompt":"Which word is spelled correctly? (brid, bired, bird)","answer":"bird"},
        {"id":5,"type":"spelling","prompt":"Which word is spelled correctly? (freog, frog, froge)","answer":"frog"},
        {"id":6,"type":"spelling","prompt":"Which word is spelled correctly? (fish, fush, fissh)","answer":"fish"},
        {"id":7,"type":"spelling","prompt":"Which word is spelled correctly? (sun, suun, syun)","answer":"sun"},
        {"id":8,"type":"spelling","prompt":"Which word is spelled correctly? (fush, fish, fissh)","answer":"fish"},
        {"id":9,"type":"spelling","prompt":"Which word is spelled correctly? (cadt, cat, catt)","answer":"cat"},
        {"id":10,"type":"spelling","prompt":"Which word is spelled correctly? (cat, cadt, catt)","answer":"cat"},
        {"id":11,"type":"spelling","prompt":"Which word is spelled correctly? (brid, bired, bird)","answer":"bird"},
        {"id":12,"type":"spelling","prompt":"Which word is spelled correctly? (catt, cat, cadt)","answer":"cat"},
        {"id":13,"type":"spelling","prompt":"Which word is spelled correctly? (froge, frog, freog)","answer":"frog"},
        {"id":14,"type":"spelling","prompt":"Which word is spelled correctly? (bired, brid, bird)","answer":"bird"},
        {"id":15,"type":"spelling","prompt":"Which word is spelled correctly? (brid, bired, bird)","answer":"bird"},
        {"id":16,"type":"spelling","prompt":"Which word is spelled correctly? (huse, hous, house)","answer":"house"},
        {"id":17,"type":"spelling","prompt":"Which word is spelled correctly? (froge, frog, freog)","answer":"frog"},
        {"id":18,"type":"spelling","prompt":"Which word is spelled correctly? (appple, apple, applee)","answer":"apple"}
]);
        checkOptionsContainAnswer(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(spellingSpec, g1, seedFrom([1, 'spelling', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":19,"type":"spelling","prompt":"Which word is spelled correctly? (syun, sun, suun)","answer":"sun"},
        {"id":20,"type":"spelling","prompt":"Which word is spelled correctly? (huse, hous, house)","answer":"house"},
        {"id":21,"type":"spelling","prompt":"Which word is spelled correctly? (sun, suun, syun)","answer":"sun"}
]);
    });
});

describe('spelling — Year 2 (adds the tricky long words)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"spelling","prompt":"Which word is spelled correctly? (elephant, elephent, elphant)","answer":"elephant"},
        {"id":2,"type":"spelling","prompt":"Which word is spelled correctly? (teacher, tocher, techer)","answer":"teacher"},
        {"id":3,"type":"spelling","prompt":"Which word is spelled correctly? (hous, huse, house)","answer":"house"},
        {"id":4,"type":"spelling","prompt":"Which word is spelled correctly? (family, familie, familly)","answer":"family"},
        {"id":5,"type":"spelling","prompt":"Which word is spelled correctly? (fish, fush, fissh)","answer":"fish"},
        {"id":6,"type":"spelling","prompt":"Which word is spelled correctly? (brid, bired, bird)","answer":"bird"},
        {"id":7,"type":"spelling","prompt":"Which word is spelled correctly? (doge, dog, doog)","answer":"dog"},
        {"id":8,"type":"spelling","prompt":"Which word is spelled correctly? (family, familie, familly)","answer":"family"},
        {"id":9,"type":"spelling","prompt":"Which word is spelled correctly? (elphant, elephent, elephant)","answer":"elephant"},
        {"id":10,"type":"spelling","prompt":"Which word is spelled correctly? (tocher, techer, teacher)","answer":"teacher"},
        {"id":11,"type":"spelling","prompt":"Which word is spelled correctly? (bannana, bananna, banana)","answer":"banana"},
        {"id":12,"type":"spelling","prompt":"Which word is spelled correctly? (froge, frog, freog)","answer":"frog"},
        {"id":13,"type":"spelling","prompt":"Which word is spelled correctly? (elephent, elephant, elphant)","answer":"elephant"},
        {"id":14,"type":"spelling","prompt":"Which word is spelled correctly? (doge, doog, dog)","answer":"dog"},
        {"id":15,"type":"spelling","prompt":"Which word is spelled correctly? (butrefly, butterfly, buterfly)","answer":"butterfly"},
        {"id":16,"type":"spelling","prompt":"Which word is spelled correctly? (techer, teacher, tocher)","answer":"teacher"},
        {"id":17,"type":"spelling","prompt":"Which word is spelled correctly? (banana, bannana, bananna)","answer":"banana"},
        {"id":18,"type":"spelling","prompt":"Which word is spelled correctly? (scoool, school, scool)","answer":"school"}
]);
        checkOptionsContainAnswer(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(spellingSpec, g2, seedFrom([2, 'spelling', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":19,"type":"spelling","prompt":"Which word is spelled correctly? (catt, cat, cadt)","answer":"cat"},
        {"id":20,"type":"spelling","prompt":"Which word is spelled correctly? (tocher, techer, teacher)","answer":"teacher"},
        {"id":21,"type":"spelling","prompt":"Which word is spelled correctly? (teacher, tocher, techer)","answer":"teacher"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(spellingSpec, getGradeConfig(3), seedFrom([3, 'spelling', 0]))).toEqual([]);
    });
});
