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

    it('is gated by the grade catalogue (Year 1..6 offer it, Year 7 does not)', () => {
        expect(wordgapSpec.offered(getGradeConfig(0))).toBe(false);
        expect(wordgapSpec.offered(g1)).toBe(true);
        expect(wordgapSpec.offered(g2)).toBe(true);
        expect(wordgapSpec.offered(getGradeConfig(3))).toBe(true);
        expect(wordgapSpec.offered(getGradeConfig(6))).toBe(true);
        expect(wordgapSpec.offered(getGradeConfig(7))).toBe(false);
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
        {"prompt":"Choose the best word: The __ says moo. (hen, soap, cow)","answer":"cow","id":1,"type":"wordgap"},
        {"prompt":"Choose the best word: I wear a __ on my head. (box, star, hat)","answer":"hat","id":2,"type":"wordgap"},
        {"prompt":"Choose the best word: I ride the __ to school. (cup, bus, cake)","answer":"bus","id":3,"type":"wordgap"},
        {"prompt":"Choose the best word: We play with a __ at the park. (milk, spoon, ball)","answer":"ball","id":4,"type":"wordgap"},
        {"prompt":"Choose the best word: The __ barks at the mailman. (train, dog, pen)","answer":"dog","id":5,"type":"wordgap"},
        {"prompt":"Choose the best word: I write with a __ . (pen, bed, duck)","answer":"pen","id":6,"type":"wordgap"},
        {"prompt":"Choose the best word: I put the __ in my school bag. (milk, frog, pencil)","answer":"pencil","id":7,"type":"wordgap"},
        {"prompt":"Choose the best word: Bees make sweet __ . (cups, books, honey)","answer":"honey","id":8,"type":"wordgap"},
        {"prompt":"Choose the best word: We watched a __ at the cinema. (movie, pan, sock)","answer":"movie","id":9,"type":"wordgap"},
        {"prompt":"Choose the best word: A __ says quack. (duck, bed, cat)","answer":"duck","id":10,"type":"wordgap"},
        {"prompt":"Choose the best word: I see with my __ . (shoes, eyes, cups)","answer":"eyes","id":11,"type":"wordgap"},
        {"prompt":"Choose the best word: The fire feels __ . (hot, slow, round)","answer":"hot","id":12,"type":"wordgap"},
        {"prompt":"Choose the best word: The __ shines in the day. (pen, cup, sun)","answer":"sun","id":13,"type":"wordgap"},
        {"prompt":"Choose the best word: A __ has a long trunk. (ring, cat, elephant)","answer":"elephant","id":14,"type":"wordgap"},
        {"prompt":"Choose the best word: I kick the __ on the field. (chair, bed, ball)","answer":"ball","id":15,"type":"wordgap"},
        {"prompt":"Choose the best word: I sleep in my __ . (bed, bus, ring)","answer":"bed","id":16,"type":"wordgap"},
        ]);
        checkOptionsContainAnswer(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(wordgapSpec, g1, seedFrom([1, 'wordgap', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Choose the best word: The fish lives in the __ . (sky, chair, water)","answer":"water","id":17,"type":"wordgap"},
        {"prompt":"Choose the best word: I drink a glass of __ . (cat, milk, door)","answer":"milk","id":18,"type":"wordgap"},
        {"prompt":"Choose the best word: Grandpa sits in his __ . (fish, chair, cake)","answer":"chair","id":19,"type":"wordgap"},
        ]);
    });
});

describe('wordgap — Year 2 (adds the extended vocabulary)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"prompt":"Choose the best word: The __ shines in the day. (pen, sun, bed)","answer":"sun","id":1,"type":"wordgap"},
        {"prompt":"Choose the best word: The baby drinks from her __ . (spoon, bottle, kitten)","answer":"bottle","id":2,"type":"wordgap"},
        {"prompt":"Choose the best word: I ride the __ to school. (bus, cake, leg)","answer":"bus","id":3,"type":"wordgap"},
        {"prompt":"Choose the best word: Bees make sweet __ . (cups, rocks, honey)","answer":"honey","id":4,"type":"wordgap"},
        {"prompt":"Choose the best word: The king wears a golden __ . (crown, leaf, pan)","answer":"crown","id":5,"type":"wordgap"},
        {"prompt":"Choose the best word: My __ is very small. (egg, cat, rope)","answer":"cat","id":6,"type":"wordgap"},
        {"prompt":"Choose the best word: We read a __ in class. (book, spoon, fish)","answer":"book","id":7,"type":"wordgap"},
        {"prompt":"Choose the best word: I sleep in my __ . (bed, cloud, cup)","answer":"bed","id":8,"type":"wordgap"},
        {"prompt":"Choose the best word: She brushes her __ every morning. (spoons, cakes, teeth)","answer":"teeth","id":9,"type":"wordgap"},
        {"prompt":"Choose the best word: I wear my __ to school. (sofa, hat, rock)","answer":"hat","id":10,"type":"wordgap"},
        {"prompt":"Choose the best word: A __ says quack. (cat, cow, duck)","answer":"duck","id":11,"type":"wordgap"},
        {"prompt":"Choose the best word: The __ barks at the mailman. (cup, train, dog)","answer":"dog","id":12,"type":"wordgap"},
        {"prompt":"Choose the best word: I wear a __ on my head. (hat, bread, pen)","answer":"hat","id":13,"type":"wordgap"},
        {"prompt":"Choose the best word: The __ flew home to its nest. (bird, fish, train)","answer":"bird","id":14,"type":"wordgap"},
        {"prompt":"Choose the best word: I kick the __ on the field. (chair, ball, milk)","answer":"ball","id":15,"type":"wordgap"},
        {"prompt":"Choose the best word: We play with a __ at the park. (cloud, bed, ball)","answer":"ball","id":16,"type":"wordgap"},
        ]);
        checkOptionsContainAnswer(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(wordgapSpec, g2, seedFrom([2, 'wordgap', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Choose the best word: The __ says moo. (soap, pen, cow)","answer":"cow","id":17,"type":"wordgap"},
        {"prompt":"Choose the best word: The fish lives in the __ . (chair, water, box)","answer":"water","id":18,"type":"wordgap"},
        {"prompt":"Choose the best word: We climb the __ to reach the roof. (puddle, cloud, ladder)","answer":"ladder","id":19,"type":"wordgap"},
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(wordgapSpec, getGradeConfig(7), seedFrom([7, 'wordgap', 0]))).toEqual([]);
    });
});
