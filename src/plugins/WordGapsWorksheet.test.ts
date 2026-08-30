// Unit tests for the WORD GAPS worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm, item bank, or caps
// change, these exact assertions fail — which is what we want, so a silent
// change to the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { wordgapSpec } from './WordGapsWorksheet';

const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(wordgapSpec, grade, seedFrom([grade.id, wordgapSpec.id, 0]));
}

describe('wordgap plugin — declarative spec', () => {
    it('declares its sidebar label, glyph, page size and single-column layout', () => {
        expect(wordgapSpec.id).toBe('wordgap');
        expect(wordgapSpec.label).toBe('Word Gaps');
        expect(wordgapSpec.icon).toBe('§');
        expect(wordgapSpec.perPage).toBe(16);
        // Gap sentences are prose — single-column.
        expect(wordgapSpec.singleColumn).toBe(true);
    });

    it('describes its scope (best word in the gap at every grade)', () => {
        expect(wordgapSpec.scope(g1)).toBe('best word in the gap');
        expect(wordgapSpec.scope(g2)).toBe('best word in the gap');
    });

    it('is gated by the grade catalogue (Year 1 and Year 2 only)', () => {
        expect(wordgapSpec.offered(getGradeConfig(0))).toBe(false);
        expect(wordgapSpec.offered(g1)).toBe(true);
        expect(wordgapSpec.offered(g2)).toBe(true);
        expect(wordgapSpec.offered(getGradeConfig(3))).toBe(false);
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

describe('wordgap — Year 1 (basic item bank)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"id":1,"type":"wordgap","prompt":"Choose the best word: The fish lives in the __ . (sky, box, water)","answer":"water"},
        {"id":2,"type":"wordgap","prompt":"Choose the best word: My __ is very small. (milk, cat, desk)","answer":"cat"},
        {"id":3,"type":"wordgap","prompt":"Choose the best word: I wear my __ to school. (book, hat, milk)","answer":"hat"},
        {"id":4,"type":"wordgap","prompt":"Choose the best word: My __ is very small. (cat, milk, desk)","answer":"cat"},
        {"id":5,"type":"wordgap","prompt":"Choose the best word: The fish lives in the __ . (water, box, sky)","answer":"water"},
        {"id":6,"type":"wordgap","prompt":"Choose the best word: My __ is very small. (milk, cat, desk)","answer":"cat"},
        {"id":7,"type":"wordgap","prompt":"Choose the best word: I wear my __ to school. (milk, book, hat)","answer":"hat"},
        {"id":8,"type":"wordgap","prompt":"Choose the best word: The sun is in the __ . (box, sky, water)","answer":"sky"},
        {"id":9,"type":"wordgap","prompt":"Choose the best word: We read a __ in class. (door, fish, book)","answer":"book"},
        {"id":10,"type":"wordgap","prompt":"Choose the best word: My __ is very small. (cat, milk, desk)","answer":"cat"},
        {"id":11,"type":"wordgap","prompt":"Choose the best word: I drink a glass of __ . (tree, cat, milk)","answer":"milk"},
        {"id":12,"type":"wordgap","prompt":"Choose the best word: We read a __ in class. (door, book, fish)","answer":"book"},
        {"id":13,"type":"wordgap","prompt":"Choose the best word: We read a __ in class. (door, book, fish)","answer":"book"},
        {"id":14,"type":"wordgap","prompt":"Choose the best word: My __ is very small. (milk, desk, cat)","answer":"cat"},
        {"id":15,"type":"wordgap","prompt":"Choose the best word: My __ is very small. (milk, desk, cat)","answer":"cat"},
        {"id":16,"type":"wordgap","prompt":"Choose the best word: I drink a glass of __ . (cat, milk, tree)","answer":"milk"}
]);
        checkOptionsContainAnswer(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(wordgapSpec, g1, seedFrom([1, 'wordgap', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":17,"type":"wordgap","prompt":"Choose the best word: My __ is very small. (cat, milk, desk)","answer":"cat"},
        {"id":18,"type":"wordgap","prompt":"Choose the best word: My __ is very small. (desk, cat, milk)","answer":"cat"},
        {"id":19,"type":"wordgap","prompt":"Choose the best word: I wear my __ to school. (book, milk, hat)","answer":"hat"}
]);
    });
});

describe('wordgap — Year 2 (adds the extended vocabulary)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"wordgap","prompt":"Choose the best word: The sun is in the __ . (water, sky, box)","answer":"sky"},
        {"id":2,"type":"wordgap","prompt":"Choose the best word: I wear my __ to school. (book, hat, milk)","answer":"hat"},
        {"id":3,"type":"wordgap","prompt":"Choose the best word: I drink a glass of __ . (cat, tree, milk)","answer":"milk"},
        {"id":4,"type":"wordgap","prompt":"Choose the best word: We read a __ in class. (door, book, fish)","answer":"book"},
        {"id":5,"type":"wordgap","prompt":"Choose the best word: The sun is in the __ . (box, water, sky)","answer":"sky"},
        {"id":6,"type":"wordgap","prompt":"Choose the best word: The fish lives in the __ . (sky, water, box)","answer":"water"},
        {"id":7,"type":"wordgap","prompt":"Choose the best word: My __ is very small. (desk, cat, milk)","answer":"cat"},
        {"id":8,"type":"wordgap","prompt":"Choose the best word: I wear my __ to school. (book, milk, hat)","answer":"hat"},
        {"id":9,"type":"wordgap","prompt":"Choose the best word: My __ is very small. (milk, cat, desk)","answer":"cat"},
        {"id":10,"type":"wordgap","prompt":"Choose the best word: The chicken lays __ in the morning. (birds, eggs, boots)","answer":"eggs"},
        {"id":11,"type":"wordgap","prompt":"Choose the best word: She brushes her __ every morning. (sky, teeth, boots)","answer":"teeth"},
        {"id":12,"type":"wordgap","prompt":"Choose the best word: I drink a glass of __ . (milk, tree, cat)","answer":"milk"},
        {"id":13,"type":"wordgap","prompt":"Choose the best word: She brushes her __ every morning. (boots, teeth, sky)","answer":"teeth"},
        {"id":14,"type":"wordgap","prompt":"Choose the best word: I drink a glass of __ . (cat, tree, milk)","answer":"milk"},
        {"id":15,"type":"wordgap","prompt":"Choose the best word: We read a __ in class. (fish, door, book)","answer":"book"},
        {"id":16,"type":"wordgap","prompt":"Choose the best word: The sun is in the __ . (box, sky, water)","answer":"sky"}
]);
        checkOptionsContainAnswer(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(wordgapSpec, g2, seedFrom([2, 'wordgap', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":17,"type":"wordgap","prompt":"Choose the best word: She brushes her __ every morning. (teeth, sky, boots)","answer":"teeth"},
        {"id":18,"type":"wordgap","prompt":"Choose the best word: I put my __ on before we go. (bread, boots, bird)","answer":"boots"},
        {"id":19,"type":"wordgap","prompt":"Choose the best word: I drink a glass of __ . (milk, tree, cat)","answer":"milk"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(wordgapSpec, getGradeConfig(3), seedFrom([3, 'wordgap', 0]))).toEqual([]);
    });
});
