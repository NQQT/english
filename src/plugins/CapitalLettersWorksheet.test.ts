// Unit tests for the CAPITAL LETTERS worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm, word banks, or caps
// change, these exact assertions fail — which is what we want, so a silent
// change to the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { capitalSpec } from './CapitalLettersWorksheet';

const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(capitalSpec, grade, seedFrom([grade.id, capitalSpec.id, 0]));
}

describe('capital plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(capitalSpec.id).toBe('capital');
        expect(capitalSpec.label).toBe('Capital Letters');
        expect(capitalSpec.icon).toBe('A!');
        expect(capitalSpec.perPage).toBe(24);
    });

    it('describes its scope (word starts at every grade)', () => {
        expect(capitalSpec.scope(g1)).toBe('word starts');
        expect(capitalSpec.scope(g2)).toBe('word starts');
    });

    it('is gated by the grade catalogue (Year 1 and Year 2 only)', () => {
        expect(capitalSpec.offered(getGradeConfig(0))).toBe(false);
        expect(capitalSpec.offered(g1)).toBe(true);
        expect(capitalSpec.offered(g2)).toBe(true);
        expect(capitalSpec.offered(getGradeConfig(3))).toBe(false);
    });
});

// Semantic invariant: the answer is the printed word with its first letter
// capitalised.
function checkCapitalisation(grade: GradeConfig) {
    for (const p of sheet(grade)) {
        const word = p.prompt.match(/capital letter: ([a-z]+)$/)![1];
        expect(p.answer).toBe(word[0].toUpperCase() + word.slice(1));
    }
}

describe('capital — Year 1 (tier-2 common word set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"id":1,"type":"capital","prompt":"Write it with a capital letter: dog","answer":"Dog"},
        {"id":2,"type":"capital","prompt":"Write it with a capital letter: chair","answer":"Chair"},
        {"id":3,"type":"capital","prompt":"Write it with a capital letter: bread","answer":"Bread"},
        {"id":4,"type":"capital","prompt":"Write it with a capital letter: chair","answer":"Chair"},
        {"id":5,"type":"capital","prompt":"Write it with a capital letter: plane","answer":"Plane"},
        {"id":6,"type":"capital","prompt":"Write it with a capital letter: pen","answer":"Pen"},
        {"id":7,"type":"capital","prompt":"Write it with a capital letter: pot","answer":"Pot"},
        {"id":8,"type":"capital","prompt":"Write it with a capital letter: tree","answer":"Tree"},
        {"id":9,"type":"capital","prompt":"Write it with a capital letter: cat","answer":"Cat"},
        {"id":10,"type":"capital","prompt":"Write it with a capital letter: cat","answer":"Cat"},
        {"id":11,"type":"capital","prompt":"Write it with a capital letter: chair","answer":"Chair"},
        {"id":12,"type":"capital","prompt":"Write it with a capital letter: cat","answer":"Cat"},
        {"id":13,"type":"capital","prompt":"Write it with a capital letter: net","answer":"Net"},
        {"id":14,"type":"capital","prompt":"Write it with a capital letter: light","answer":"Light"},
        {"id":15,"type":"capital","prompt":"Write it with a capital letter: plane","answer":"Plane"},
        {"id":16,"type":"capital","prompt":"Write it with a capital letter: moon","answer":"Moon"},
        {"id":17,"type":"capital","prompt":"Write it with a capital letter: sun","answer":"Sun"},
        {"id":18,"type":"capital","prompt":"Write it with a capital letter: tree","answer":"Tree"},
        {"id":19,"type":"capital","prompt":"Write it with a capital letter: bag","answer":"Bag"},
        {"id":20,"type":"capital","prompt":"Write it with a capital letter: cup","answer":"Cup"},
        {"id":21,"type":"capital","prompt":"Write it with a capital letter: bus","answer":"Bus"},
        {"id":22,"type":"capital","prompt":"Write it with a capital letter: bread","answer":"Bread"},
        {"id":23,"type":"capital","prompt":"Write it with a capital letter: chair","answer":"Chair"},
        {"id":24,"type":"capital","prompt":"Write it with a capital letter: dog","answer":"Dog"}
]);
        checkCapitalisation(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(capitalSpec, g1, seedFrom([1, 'capital', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"capital","prompt":"Write it with a capital letter: bread","answer":"Bread"},
        {"id":26,"type":"capital","prompt":"Write it with a capital letter: bus","answer":"Bus"},
        {"id":27,"type":"capital","prompt":"Write it with a capital letter: cup","answer":"Cup"}
]);
    });
});

describe('capital — Year 2 (tier-3 extended set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"capital","prompt":"Write it with a capital letter: chicken","answer":"Chicken"},
        {"id":2,"type":"capital","prompt":"Write it with a capital letter: train","answer":"Train"},
        {"id":3,"type":"capital","prompt":"Write it with a capital letter: tree","answer":"Tree"},
        {"id":4,"type":"capital","prompt":"Write it with a capital letter: butterfly","answer":"Butterfly"},
        {"id":5,"type":"capital","prompt":"Write it with a capital letter: green","answer":"Green"},
        {"id":6,"type":"capital","prompt":"Write it with a capital letter: shirt","answer":"Shirt"},
        {"id":7,"type":"capital","prompt":"Write it with a capital letter: beautiful","answer":"Beautiful"},
        {"id":8,"type":"capital","prompt":"Write it with a capital letter: family","answer":"Family"},
        {"id":9,"type":"capital","prompt":"Write it with a capital letter: teacher","answer":"Teacher"},
        {"id":10,"type":"capital","prompt":"Write it with a capital letter: log","answer":"Log"},
        {"id":11,"type":"capital","prompt":"Write it with a capital letter: chocolate","answer":"Chocolate"},
        {"id":12,"type":"capital","prompt":"Write it with a capital letter: jam","answer":"Jam"},
        {"id":13,"type":"capital","prompt":"Write it with a capital letter: chair","answer":"Chair"},
        {"id":14,"type":"capital","prompt":"Write it with a capital letter: red","answer":"Red"},
        {"id":15,"type":"capital","prompt":"Write it with a capital letter: bag","answer":"Bag"},
        {"id":16,"type":"capital","prompt":"Write it with a capital letter: jam","answer":"Jam"},
        {"id":17,"type":"capital","prompt":"Write it with a capital letter: pin","answer":"Pin"},
        {"id":18,"type":"capital","prompt":"Write it with a capital letter: house","answer":"House"},
        {"id":19,"type":"capital","prompt":"Write it with a capital letter: water","answer":"Water"},
        {"id":20,"type":"capital","prompt":"Write it with a capital letter: bird","answer":"Bird"},
        {"id":21,"type":"capital","prompt":"Write it with a capital letter: tree","answer":"Tree"},
        {"id":22,"type":"capital","prompt":"Write it with a capital letter: computer","answer":"Computer"},
        {"id":23,"type":"capital","prompt":"Write it with a capital letter: hat","answer":"Hat"},
        {"id":24,"type":"capital","prompt":"Write it with a capital letter: train","answer":"Train"}
]);
        checkCapitalisation(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(capitalSpec, g2, seedFrom([2, 'capital', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"capital","prompt":"Write it with a capital letter: bird","answer":"Bird"},
        {"id":26,"type":"capital","prompt":"Write it with a capital letter: hat","answer":"Hat"},
        {"id":27,"type":"capital","prompt":"Write it with a capital letter: log","answer":"Log"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(capitalSpec, getGradeConfig(3), seedFrom([3, 'capital', 0]))).toEqual([]);
    });
});
