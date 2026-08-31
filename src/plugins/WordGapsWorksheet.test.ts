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
        {"id":1,"type":"wordgap","prompt":"Choose the best word: A __ has a long trunk. (frog, cat, elephant)","answer":"elephant"},
        {"id":2,"type":"wordgap","prompt":"Choose the best word: I sleep in my __ . (bus, bed, cup)","answer":"bed"},
        {"id":3,"type":"wordgap","prompt":"Choose the best word: I wear my __ to school. (book, milk, hat)","answer":"hat"},
        {"id":4,"type":"wordgap","prompt":"Choose the best word: I ride the __ to school. (cup, leg, bus)","answer":"bus"},
        {"id":5,"type":"wordgap","prompt":"Choose the best word: The __ flies high in the wind. (kite, pen, rock)","answer":"kite"},
        {"id":6,"type":"wordgap","prompt":"Choose the best word: I brush my __ every morning. (shoe, hair, bus)","answer":"hair"},
        {"id":7,"type":"wordgap","prompt":"Choose the best word: The __ shines in the day. (pen, bed, sun)","answer":"sun"},
        {"id":8,"type":"wordgap","prompt":"Choose the best word: We play with a __ at the park. (milk, bed, ball)","answer":"ball"},
        {"id":9,"type":"wordgap","prompt":"Choose the best word: Mom bakes a __ for us. (shoe, log, cake)","answer":"cake"},
        {"id":10,"type":"wordgap","prompt":"Choose the best word: The fish lives in the __ . (sky, water, box)","answer":"water"},
        {"id":11,"type":"wordgap","prompt":"Choose the best word: Bees make sweet __ . (books, honey, shoes)","answer":"honey"},
        {"id":12,"type":"wordgap","prompt":"Choose the best word: Fish swim in the __ . (tree, water, milk)","answer":"water"},
        {"id":13,"type":"wordgap","prompt":"Choose the best word: I wear a __ on my head. (pen, box, hat)","answer":"hat"},
        {"id":14,"type":"wordgap","prompt":"Choose the best word: I write with a __ . (bed, cup, pen)","answer":"pen"},
        {"id":15,"type":"wordgap","prompt":"Choose the best word: The sun is in the __ . (box, sky, water)","answer":"sky"},
        {"id":16,"type":"wordgap","prompt":"Choose the best word: My __ is very small. (cat, milk, desk)","answer":"cat"}
]);
        checkOptionsContainAnswer(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(wordgapSpec, g1, seedFrom([1, 'wordgap', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":17,"type":"wordgap","prompt":"Choose the best word: We read a __ in class. (book, fish, door)","answer":"book"},
        {"id":18,"type":"wordgap","prompt":"Choose the best word: I drink a glass of __ . (tree, cat, milk)","answer":"milk"},
        {"id":19,"type":"wordgap","prompt":"Choose the best word: The fire feels __ . (wet, soft, hot)","answer":"hot"}
]);
    });
});

describe('wordgap — Year 2 (adds the extended vocabulary)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"wordgap","prompt":"Choose the best word: I ride the __ to school. (cup, leg, bus)","answer":"bus"},
        {"id":2,"type":"wordgap","prompt":"Choose the best word: Fish swim in the __ . (tree, water, milk)","answer":"water"},
        {"id":3,"type":"wordgap","prompt":"Choose the best word: The fish lives in the __ . (water, box, sky)","answer":"water"},
        {"id":4,"type":"wordgap","prompt":"Choose the best word: We play with a __ at the park. (ball, milk, bed)","answer":"ball"},
        {"id":5,"type":"wordgap","prompt":"Choose the best word: I put my __ on before we go. (bird, boots, bread)","answer":"boots"},
        {"id":6,"type":"wordgap","prompt":"Choose the best word: We read a __ in class. (fish, door, book)","answer":"book"},
        {"id":7,"type":"wordgap","prompt":"Choose the best word: I drink a glass of __ . (milk, tree, cat)","answer":"milk"},
        {"id":8,"type":"wordgap","prompt":"Choose the best word: The sun is in the __ . (water, sky, box)","answer":"sky"},
        {"id":9,"type":"wordgap","prompt":"Choose the best word: Bees make sweet __ . (shoes, books, honey)","answer":"honey"},
        {"id":10,"type":"wordgap","prompt":"Choose the best word: My __ is very small. (milk, cat, desk)","answer":"cat"},
        {"id":11,"type":"wordgap","prompt":"Choose the best word: The __ barks at the mailman. (cup, pen, dog)","answer":"dog"},
        {"id":12,"type":"wordgap","prompt":"Choose the best word: She brushes her __ every morning. (sky, teeth, boots)","answer":"teeth"},
        {"id":13,"type":"wordgap","prompt":"Choose the best word: The fire feels __ . (soft, wet, hot)","answer":"hot"},
        {"id":14,"type":"wordgap","prompt":"Choose the best word: Mom bakes a __ for us. (cake, log, shoe)","answer":"cake"},
        {"id":15,"type":"wordgap","prompt":"Choose the best word: I wear a __ on my head. (hat, pen, box)","answer":"hat"},
        {"id":16,"type":"wordgap","prompt":"Choose the best word: The __ shines in the day. (bed, pen, sun)","answer":"sun"}
]);
        checkOptionsContainAnswer(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(wordgapSpec, g2, seedFrom([2, 'wordgap', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":17,"type":"wordgap","prompt":"Choose the best word: I sleep in my __ . (bed, bus, cup)","answer":"bed"},
        {"id":18,"type":"wordgap","prompt":"Choose the best word: The __ flies high in the wind. (kite, pen, rock)","answer":"kite"},
        {"id":19,"type":"wordgap","prompt":"Choose the best word: The chicken lays __ in the morning. (eggs, boots, birds)","answer":"eggs"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(wordgapSpec, getGradeConfig(3), seedFrom([3, 'wordgap', 0]))).toEqual([]);
    });
});
