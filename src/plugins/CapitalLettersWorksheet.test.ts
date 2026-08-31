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
        {"id":1,"type":"capital","prompt":"Write it with a capital letter: elf","answer":"Elf"},
        {"id":2,"type":"capital","prompt":"Write it with a capital letter: they","answer":"They"},
        {"id":3,"type":"capital","prompt":"Write it with a capital letter: tank","answer":"Tank"},
        {"id":4,"type":"capital","prompt":"Write it with a capital letter: torn","answer":"Torn"},
        {"id":5,"type":"capital","prompt":"Write it with a capital letter: pound","answer":"Pound"},
        {"id":6,"type":"capital","prompt":"Write it with a capital letter: old","answer":"Old"},
        {"id":7,"type":"capital","prompt":"Write it with a capital letter: keep","answer":"Keep"},
        {"id":8,"type":"capital","prompt":"Write it with a capital letter: road","answer":"Road"},
        {"id":9,"type":"capital","prompt":"Write it with a capital letter: bug","answer":"Bug"},
        {"id":10,"type":"capital","prompt":"Write it with a capital letter: bun","answer":"Bun"},
        {"id":11,"type":"capital","prompt":"Write it with a capital letter: tent","answer":"Tent"},
        {"id":12,"type":"capital","prompt":"Write it with a capital letter: car","answer":"Car"},
        {"id":13,"type":"capital","prompt":"Write it with a capital letter: glow","answer":"Glow"},
        {"id":14,"type":"capital","prompt":"Write it with a capital letter: wind","answer":"Wind"},
        {"id":15,"type":"capital","prompt":"Write it with a capital letter: onion","answer":"Onion"},
        {"id":16,"type":"capital","prompt":"Write it with a capital letter: apple","answer":"Apple"},
        {"id":17,"type":"capital","prompt":"Write it with a capital letter: hat","answer":"Hat"},
        {"id":18,"type":"capital","prompt":"Write it with a capital letter: rice","answer":"Rice"},
        {"id":19,"type":"capital","prompt":"Write it with a capital letter: way","answer":"Way"},
        {"id":20,"type":"capital","prompt":"Write it with a capital letter: jog","answer":"Jog"},
        {"id":21,"type":"capital","prompt":"Write it with a capital letter: got","answer":"Got"},
        {"id":22,"type":"capital","prompt":"Write it with a capital letter: tail","answer":"Tail"},
        {"id":23,"type":"capital","prompt":"Write it with a capital letter: task","answer":"Task"},
        {"id":24,"type":"capital","prompt":"Write it with a capital letter: die","answer":"Die"}
]);
        checkCapitalisation(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(capitalSpec, g1, seedFrom([1, 'capital', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"capital","prompt":"Write it with a capital letter: swim","answer":"Swim"},
        {"id":26,"type":"capital","prompt":"Write it with a capital letter: fox","answer":"Fox"},
        {"id":27,"type":"capital","prompt":"Write it with a capital letter: lab","answer":"Lab"}
]);
    });
});

describe('capital — Year 2 (tier-3 extended set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"capital","prompt":"Write it with a capital letter: watch","answer":"Watch"},
        {"id":2,"type":"capital","prompt":"Write it with a capital letter: seat","answer":"Seat"},
        {"id":3,"type":"capital","prompt":"Write it with a capital letter: jazz","answer":"Jazz"},
        {"id":4,"type":"capital","prompt":"Write it with a capital letter: enjoy","answer":"Enjoy"},
        {"id":5,"type":"capital","prompt":"Write it with a capital letter: nine","answer":"Nine"},
        {"id":6,"type":"capital","prompt":"Write it with a capital letter: pole","answer":"Pole"},
        {"id":7,"type":"capital","prompt":"Write it with a capital letter: fruit","answer":"Fruit"},
        {"id":8,"type":"capital","prompt":"Write it with a capital letter: being","answer":"Being"},
        {"id":9,"type":"capital","prompt":"Write it with a capital letter: work","answer":"Work"},
        {"id":10,"type":"capital","prompt":"Write it with a capital letter: was","answer":"Was"},
        {"id":11,"type":"capital","prompt":"Write it with a capital letter: jelly","answer":"Jelly"},
        {"id":12,"type":"capital","prompt":"Write it with a capital letter: tag","answer":"Tag"},
        {"id":13,"type":"capital","prompt":"Write it with a capital letter: luck","answer":"Luck"},
        {"id":14,"type":"capital","prompt":"Write it with a capital letter: mow","answer":"Mow"},
        {"id":15,"type":"capital","prompt":"Write it with a capital letter: owe","answer":"Owe"},
        {"id":16,"type":"capital","prompt":"Write it with a capital letter: tap","answer":"Tap"},
        {"id":17,"type":"capital","prompt":"Write it with a capital letter: bend","answer":"Bend"},
        {"id":18,"type":"capital","prompt":"Write it with a capital letter: swam","answer":"Swam"},
        {"id":19,"type":"capital","prompt":"Write it with a capital letter: lead","answer":"Lead"},
        {"id":20,"type":"capital","prompt":"Write it with a capital letter: have","answer":"Have"},
        {"id":21,"type":"capital","prompt":"Write it with a capital letter: idea","answer":"Idea"},
        {"id":22,"type":"capital","prompt":"Write it with a capital letter: nurse","answer":"Nurse"},
        {"id":23,"type":"capital","prompt":"Write it with a capital letter: doe","answer":"Doe"},
        {"id":24,"type":"capital","prompt":"Write it with a capital letter: same","answer":"Same"}
]);
        checkCapitalisation(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(capitalSpec, g2, seedFrom([2, 'capital', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"capital","prompt":"Write it with a capital letter: gray","answer":"Gray"},
        {"id":26,"type":"capital","prompt":"Write it with a capital letter: dip","answer":"Dip"},
        {"id":27,"type":"capital","prompt":"Write it with a capital letter: who","answer":"Who"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(capitalSpec, getGradeConfig(3), seedFrom([3, 'capital', 0]))).toEqual([]);
    });
});
