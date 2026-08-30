// Unit tests for the SIMILAR WORDS (SYNONYMS) worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm, quadruple bank, or caps
// change, these exact assertions fail — which is what we want, so a silent
// change to the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { similarSpec } from './SimilarWordsWorksheet';

const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(similarSpec, grade, seedFrom([grade.id, similarSpec.id, 0]));
}

describe('similar plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(similarSpec.id).toBe('similar');
        expect(similarSpec.label).toBe('Similar Words');
        expect(similarSpec.icon).toBe('≡');
        expect(similarSpec.perPage).toBe(18);
    });

    it('describes its scope (word meanings at every grade)', () => {
        expect(similarSpec.scope(g1)).toBe('word meanings');
        expect(similarSpec.scope(g2)).toBe('word meanings');
    });

    it('is gated by the grade catalogue (Year 1 and Year 2 only)', () => {
        expect(similarSpec.offered(getGradeConfig(0))).toBe(false);
        expect(similarSpec.offered(g1)).toBe(true);
        expect(similarSpec.offered(g2)).toBe(true);
        expect(similarSpec.offered(getGradeConfig(3))).toBe(false);
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

describe('similar — Year 1 (base quadruples)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"id":1,"type":"similar","prompt":"Which word means the same as \"cold\"? (hot, warm, chilly)","answer":"chilly"},
        {"id":2,"type":"similar","prompt":"Which word means the same as \"big\"? (large, new, small)","answer":"large"},
        {"id":3,"type":"similar","prompt":"Which word means the same as \"big\"? (new, large, small)","answer":"large"},
        {"id":4,"type":"similar","prompt":"Which word means the same as \"hot\"? (cool, cold, warm)","answer":"warm"},
        {"id":5,"type":"similar","prompt":"Which word means the same as \"small\"? (big, tiny, new)","answer":"tiny"},
        {"id":6,"type":"similar","prompt":"Which word means the same as \"sad\"? (tired, unhappy, happy)","answer":"unhappy"},
        {"id":7,"type":"similar","prompt":"Which word means the same as \"happy\"? (sad, angry, glad)","answer":"glad"},
        {"id":8,"type":"similar","prompt":"Which word means the same as \"big\"? (large, new, small)","answer":"large"},
        {"id":9,"type":"similar","prompt":"Which word means the same as \"fast\"? (cold, quick, slow)","answer":"quick"},
        {"id":10,"type":"similar","prompt":"Which word means the same as \"hot\"? (cool, cold, warm)","answer":"warm"},
        {"id":11,"type":"similar","prompt":"Which word means the same as \"happy\"? (sad, angry, glad)","answer":"glad"},
        {"id":12,"type":"similar","prompt":"Which word means the same as \"sad\"? (unhappy, tired, happy)","answer":"unhappy"},
        {"id":13,"type":"similar","prompt":"Which word means the same as \"cold\"? (chilly, warm, hot)","answer":"chilly"},
        {"id":14,"type":"similar","prompt":"Which word means the same as \"big\"? (small, new, large)","answer":"large"},
        {"id":15,"type":"similar","prompt":"Which word means the same as \"sad\"? (happy, unhappy, tired)","answer":"unhappy"},
        {"id":16,"type":"similar","prompt":"Which word means the same as \"happy\"? (angry, sad, glad)","answer":"glad"},
        {"id":17,"type":"similar","prompt":"Which word means the same as \"hot\"? (warm, cool, cold)","answer":"warm"},
        {"id":18,"type":"similar","prompt":"Which word means the same as \"big\"? (new, large, small)","answer":"large"}
]);
        checkOptionsContainAnswer(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(similarSpec, g1, seedFrom([1, 'similar', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":19,"type":"similar","prompt":"Which word means the same as \"fast\"? (cold, slow, quick)","answer":"quick"},
        {"id":20,"type":"similar","prompt":"Which word means the same as \"good\"? (nice, sad, bad)","answer":"nice"},
        {"id":21,"type":"similar","prompt":"Which word means the same as \"hot\"? (cold, warm, cool)","answer":"warm"}
]);
    });
});

describe('similar — Year 2 (adds the extended quadruples)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"similar","prompt":"Which word means the same as \"quiet\"? (loud, silent, noisy)","answer":"silent"},
        {"id":2,"type":"similar","prompt":"Which word means the same as \"happy\"? (angry, glad, sad)","answer":"glad"},
        {"id":3,"type":"similar","prompt":"Which word means the same as \"strong\"? (tiny, weak, mighty)","answer":"mighty"},
        {"id":4,"type":"similar","prompt":"Which word means the same as \"cold\"? (chilly, warm, hot)","answer":"chilly"},
        {"id":5,"type":"similar","prompt":"Which word means the same as \"tired\"? (happy, sleepy, awake)","answer":"sleepy"},
        {"id":6,"type":"similar","prompt":"Which word means the same as \"fast\"? (quick, cold, slow)","answer":"quick"},
        {"id":7,"type":"similar","prompt":"Which word means the same as \"easy\"? (tricky, hard, simple)","answer":"simple"},
        {"id":8,"type":"similar","prompt":"Which word means the same as \"fast\"? (slow, quick, cold)","answer":"quick"},
        {"id":9,"type":"similar","prompt":"Which word means the same as \"strong\"? (tiny, mighty, weak)","answer":"mighty"},
        {"id":10,"type":"similar","prompt":"Which word means the same as \"small\"? (new, tiny, big)","answer":"tiny"},
        {"id":11,"type":"similar","prompt":"Which word means the same as \"tired\"? (happy, sleepy, awake)","answer":"sleepy"},
        {"id":12,"type":"similar","prompt":"Which word means the same as \"happy\"? (glad, angry, sad)","answer":"glad"},
        {"id":13,"type":"similar","prompt":"Which word means the same as \"sad\"? (tired, happy, unhappy)","answer":"unhappy"},
        {"id":14,"type":"similar","prompt":"Which word means the same as \"small\"? (big, new, tiny)","answer":"tiny"},
        {"id":15,"type":"similar","prompt":"Which word means the same as \"tired\"? (awake, happy, sleepy)","answer":"sleepy"},
        {"id":16,"type":"similar","prompt":"Which word means the same as \"hot\"? (warm, cool, cold)","answer":"warm"},
        {"id":17,"type":"similar","prompt":"Which word means the same as \"quiet\"? (silent, noisy, loud)","answer":"silent"},
        {"id":18,"type":"similar","prompt":"Which word means the same as \"fast\"? (cold, slow, quick)","answer":"quick"}
]);
        checkOptionsContainAnswer(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(similarSpec, g2, seedFrom([2, 'similar', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":19,"type":"similar","prompt":"Which word means the same as \"happy\"? (glad, angry, sad)","answer":"glad"},
        {"id":20,"type":"similar","prompt":"Which word means the same as \"big\"? (small, large, new)","answer":"large"},
        {"id":21,"type":"similar","prompt":"Which word means the same as \"hot\"? (warm, cool, cold)","answer":"warm"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(similarSpec, getGradeConfig(3), seedFrom([3, 'similar', 0]))).toEqual([]);
    });
});
