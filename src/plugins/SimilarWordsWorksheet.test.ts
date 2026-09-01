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

    it('is gated by the grade catalogue (Year 1..6 offer it, Year 7 does not)', () => {
        expect(similarSpec.offered(getGradeConfig(0))).toBe(false);
        expect(similarSpec.offered(g1)).toBe(true);
        expect(similarSpec.offered(g2)).toBe(true);
        expect(similarSpec.offered(getGradeConfig(3))).toBe(true);
        expect(similarSpec.offered(getGradeConfig(6))).toBe(true);
        expect(similarSpec.offered(getGradeConfig(7))).toBe(false);
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
        {"prompt":"Which word means the same as \"good\"? (sad, new, nice)","answer":"nice","id":1,"type":"similar"},
        {"prompt":"Which word means the same as \"small\"? (noisy, tiny, large)","answer":"tiny","id":2,"type":"similar"},
        {"prompt":"Which word means the same as \"look\"? (happy, quick, see)","answer":"see","id":3,"type":"similar"},
        {"prompt":"Which word means the same as \"big\"? (small, large, hear)","answer":"large","id":4,"type":"similar"},
        {"prompt":"Which word means the same as \"cold\"? (happy, chilly, angry)","answer":"chilly","id":5,"type":"similar"},
        {"prompt":"Which word means the same as \"loud\"? (noisy, slow, new)","answer":"noisy","id":6,"type":"similar"},
        {"prompt":"Which word means the same as \"sad\"? (happy, tiny, unhappy)","answer":"unhappy","id":7,"type":"similar"},
        {"prompt":"Which word means the same as \"hot\"? (walk, see, warm)","answer":"warm","id":8,"type":"similar"},
        {"prompt":"Which word means the same as \"happy\"? (glad, unhappy, big)","answer":"glad","id":9,"type":"similar"},
        {"prompt":"Which word means the same as \"fast\"? (small, quick, see)","answer":"quick","id":10,"type":"similar"},
        {"prompt":"Which word means the same as \"small\"? (little, angry, hot)","answer":"little","id":11,"type":"similar"},
        {"prompt":"Which word means the same as \"cold\"? (happy, walk, chilly)","answer":"chilly","id":12,"type":"similar"},
        {"prompt":"Which word means the same as \"hot\"? (hear, warm, good)","answer":"warm","id":13,"type":"similar"},
        {"prompt":"Which word means the same as \"good\"? (nice, warm, fast)","answer":"nice","id":14,"type":"similar"},
        {"prompt":"Which word means the same as \"look\"? (happy, see, sad)","answer":"see","id":15,"type":"similar"},
        {"prompt":"Which word means the same as \"big\"? (little, bad, large)","answer":"large","id":16,"type":"similar"},
        {"prompt":"Which word means the same as \"fast\"? (happy, quick, hot)","answer":"quick","id":17,"type":"similar"},
        {"prompt":"Which word means the same as \"loud\"? (hear, big, noisy)","answer":"noisy","id":18,"type":"similar"},
        ]);
        checkOptionsContainAnswer(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(similarSpec, g1, seedFrom([1, 'similar', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Which word means the same as \"small\"? (tall, little, sad)","answer":"little","id":19,"type":"similar"},
        {"prompt":"Which word means the same as \"happy\"? (large, new, glad)","answer":"glad","id":20,"type":"similar"},
        {"prompt":"Which word means the same as \"small\"? (unhappy, warm, tiny)","answer":"tiny","id":21,"type":"similar"},
        ]);
    });
});

describe('similar — Year 2 (adds the extended quadruples)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"prompt":"Which word means the same as \"quiet\"? (angry, silent, tall)","answer":"silent","id":1,"type":"similar"},
        {"prompt":"Which word means the same as \"strong\"? (angry, mighty, hot)","answer":"mighty","id":2,"type":"similar"},
        {"prompt":"Which word means the same as \"happy\"? (strong, see, glad)","answer":"glad","id":3,"type":"similar"},
        {"prompt":"Which word means the same as \"scared\"? (calm, afraid, happy)","answer":"afraid","id":4,"type":"similar"},
        {"prompt":"Which word means the same as \"good\"? (nice, loud, big)","answer":"nice","id":5,"type":"similar"},
        {"prompt":"Which word means the same as \"easy\"? (fast, angry, simple)","answer":"simple","id":6,"type":"similar"},
        {"prompt":"Which word means the same as \"look\"? (cold, cross, see)","answer":"see","id":7,"type":"similar"},
        {"prompt":"Which word means the same as \"angry\"? (cross, tired, bad)","answer":"cross","id":8,"type":"similar"},
        {"prompt":"Which word means the same as \"small\"? (afraid, scared, little)","answer":"little","id":9,"type":"similar"},
        {"prompt":"Which word means the same as \"small\"? (tiny, glad, hear)","answer":"tiny","id":10,"type":"similar"},
        {"prompt":"Which word means the same as \"fast\"? (calm, quick, small)","answer":"quick","id":11,"type":"similar"},
        {"prompt":"Which word means the same as \"tired\"? (sleepy, walk, look)","answer":"sleepy","id":12,"type":"similar"},
        {"prompt":"Which word means the same as \"hot\"? (warm, quiet, afraid)","answer":"warm","id":13,"type":"similar"},
        {"prompt":"Which word means the same as \"big\"? (happy, large, look)","answer":"large","id":14,"type":"similar"},
        {"prompt":"Which word means the same as \"cold\"? (chilly, happy, hear)","answer":"chilly","id":15,"type":"similar"},
        {"prompt":"Which word means the same as \"loud\"? (noisy, tiny, big)","answer":"noisy","id":16,"type":"similar"},
        {"prompt":"Which word means the same as \"sad\"? (cool, little, unhappy)","answer":"unhappy","id":17,"type":"similar"},
        {"prompt":"Which word means the same as \"happy\"? (tired, large, glad)","answer":"glad","id":18,"type":"similar"},
        ]);
        checkOptionsContainAnswer(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(similarSpec, g2, seedFrom([2, 'similar', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Which word means the same as \"hot\"? (warm, angry, sad)","answer":"warm","id":19,"type":"similar"},
        {"prompt":"Which word means the same as \"strong\"? (happy, unhappy, mighty)","answer":"mighty","id":20,"type":"similar"},
        {"prompt":"Which word means the same as \"tired\"? (sleepy, small, cold)","answer":"sleepy","id":21,"type":"similar"},
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(similarSpec, getGradeConfig(7), seedFrom([7, 'similar', 0]))).toEqual([]);
    });
});
