// Unit tests for the VOWELS worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm, word banks, or caps
// change, these exact assertions fail — which is what we want, so a silent
// change to the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { vowelSpec } from './VowelsWorksheet';

const g0 = getGradeConfig(0);
const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(vowelSpec, grade, seedFrom([grade.id, vowelSpec.id, 0]));
}

describe('vowel plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(vowelSpec.id).toBe('vowel');
        expect(vowelSpec.label).toBe('Vowels');
        expect(vowelSpec.icon).toBe('e');
        expect(vowelSpec.perPage).toBe(24);
    });

    it('describes its word-set scope from the grade caps', () => {
        expect(vowelSpec.scope(g0)).toBe('vowels, word set 1');
        expect(vowelSpec.scope(g1)).toBe('vowels, word set 2');
        expect(vowelSpec.scope(g2)).toBe('vowels, word set 3');
    });

    it('is gated by the grade catalogue (all implemented grades offer it)', () => {
        expect(vowelSpec.offered(g0)).toBe(true);
        expect(vowelSpec.offered(g1)).toBe(true);
        expect(vowelSpec.offered(g2)).toBe(true);
        expect(vowelSpec.offered(getGradeConfig(3))).toBe(false);
    });
});

// Semantic invariants: every generator kind is answerable from the prompt
// alone (see VowelsWorksheet.ts):
//   count  — the answer IS the true vowel count of the printed word
//   letter — the word has exactly one vowel; the answer names it
//   MC n   — exactly one option has n vowels, and it is the answer
//   MC 'a' — exactly one option contains the vowel letter, and it is the
//            answer
function vowelCount(word: string): number {
    let n = 0;
    for (const ch of word.toLowerCase()) if ('aeiou'.includes(ch)) n += 1;
    return n;
}
function checkVowelTruths(grade: GradeConfig) {
    for (const p of sheet(grade)) {
        const count = p.prompt.match(/^How many vowels are in "([a-z]+)"\?$/);
        const letter = p.prompt.match(/^Which letter in "([a-z]+)" is the vowel\?$/);
        const mcCount = p.prompt.match(/^Which word has (\d) vowels?\? \(([^)]+)\)$/);
        const mcLetter = p.prompt.match(/^Which word has the vowel "([a-z])"\? \(([^)]+)\)$/);
        if (count) {
            expect(p.answer).toBe(String(vowelCount(count[1])));
        } else if (letter) {
            expect(vowelCount(letter[1])).toBe(1);
            expect(p.answer).toBe(letter[1].split('').find((c) => 'aeiou'.includes(c)));
        } else if (mcCount) {
            const n = Number(mcCount[1]);
            const options = mcCount[2].split(', ');
            expect(options.filter((o) => vowelCount(o) === n)).toEqual([p.answer]);
        } else if (mcLetter) {
            const options = mcLetter[2].split(', ');
            expect(options.filter((o) => o.includes(mcLetter[1]))).toEqual([p.answer]);
        } else {
            // Every prompt must fall into exactly one of the four kinds.
            throw new Error(`unrecognised vowel prompt: ${p.prompt}`);
        }
    }
}

describe('vowel — Prep (tier-1 starter word set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g0)).toEqual([
        {"id":1,"type":"vowel","prompt":"How many vowels are in \"dog\"?","answer":"1"},
        {"id":2,"type":"vowel","prompt":"Which letter in \"leg\" is the vowel?","answer":"e"},
        {"id":3,"type":"vowel","prompt":"How many vowels are in \"sip\"?","answer":"1"},
        {"id":4,"type":"vowel","prompt":"Which letter in \"cat\" is the vowel?","answer":"a"},
        {"id":5,"type":"vowel","prompt":"How many vowels are in \"pot\"?","answer":"1"},
        {"id":6,"type":"vowel","prompt":"Which word has 1 vowel? (moon, wig)","answer":"wig"},
        {"id":7,"type":"vowel","prompt":"Which word has 1 vowel? (moon, rat)","answer":"rat"},
        {"id":8,"type":"vowel","prompt":"Which word has the vowel \"u\"? (sun, fan, bed)","answer":"sun"},
        {"id":9,"type":"vowel","prompt":"Which word has 1 vowel? (moon, map)","answer":"map"},
        {"id":10,"type":"vowel","prompt":"How many vowels are in \"bus\"?","answer":"1"},
        {"id":11,"type":"vowel","prompt":"Which word has 1 vowel? (moon, log)","answer":"log"},
        {"id":12,"type":"vowel","prompt":"Which letter in \"red\" is the vowel?","answer":"e"},
        {"id":13,"type":"vowel","prompt":"Which word has the vowel \"a\"? (map, wig, leg)","answer":"map"},
        {"id":14,"type":"vowel","prompt":"Which word has 1 vowel? (moon, sun)","answer":"sun"},
        {"id":15,"type":"vowel","prompt":"How many vowels are in \"pin\"?","answer":"1"},
        {"id":16,"type":"vowel","prompt":"Which word has 1 vowel? (moon, hat)","answer":"hat"},
        {"id":17,"type":"vowel","prompt":"How many vowels are in \"log\"?","answer":"1"},
        {"id":18,"type":"vowel","prompt":"Which word has the vowel \"o\"? (box, hat, rat)","answer":"box"},
        {"id":19,"type":"vowel","prompt":"How many vowels are in \"bed\"?","answer":"1"},
        {"id":20,"type":"vowel","prompt":"Which letter in \"dog\" is the vowel?","answer":"o"},
        {"id":21,"type":"vowel","prompt":"How many vowels are in \"net\"?","answer":"1"},
        {"id":22,"type":"vowel","prompt":"Which word has 1 vowel? (moon, bus)","answer":"bus"},
        {"id":23,"type":"vowel","prompt":"Which word has 1 vowel? (moon, net)","answer":"net"},
        {"id":24,"type":"vowel","prompt":"Which word has 1 vowel? (moon, top)","answer":"top"}
]);
        checkVowelTruths(g0);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(vowelSpec, g0, seedFrom([0, 'vowel', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"vowel","prompt":"Which letter in \"hat\" is the vowel?","answer":"a"},
        {"id":26,"type":"vowel","prompt":"Which letter in \"fan\" is the vowel?","answer":"a"},
        {"id":27,"type":"vowel","prompt":"Which word has the vowel \"i\"? (jam, bag, pig)","answer":"pig"}
]);
    });
});

describe('vowel — Year 1 (tier-2 common word set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"id":1,"type":"vowel","prompt":"Which word has the vowel \"u\"? (jam, bag, sun)","answer":"sun"},
        {"id":2,"type":"vowel","prompt":"How many vowels are in \"pot\"?","answer":"1"},
        {"id":3,"type":"vowel","prompt":"How many vowels are in \"table\"?","answer":"2"},
        {"id":4,"type":"vowel","prompt":"Which word has the vowel \"e\"? (fish, shirt, tree)","answer":"tree"},
        {"id":5,"type":"vowel","prompt":"How many vowels are in \"rabbit\"?","answer":"2"},
        {"id":6,"type":"vowel","prompt":"Which word has the vowel \"i\"? (map, purple, tiger)","answer":"tiger"},
        {"id":7,"type":"vowel","prompt":"Which letter in \"light\" is the vowel?","answer":"i"},
        {"id":8,"type":"vowel","prompt":"How many vowels are in \"fan\"?","answer":"1"},
        {"id":9,"type":"vowel","prompt":"Which word has the vowel \"o\"? (purple, rabbit, top)","answer":"top"},
        {"id":10,"type":"vowel","prompt":"How many vowels are in \"net\"?","answer":"1"},
        {"id":11,"type":"vowel","prompt":"Which word has the vowel \"a\"? (train, net, bus)","answer":"train"},
        {"id":12,"type":"vowel","prompt":"Which word has the vowel \"o\"? (rabbit, pot, table)","answer":"pot"},
        {"id":13,"type":"vowel","prompt":"Which word has the vowel \"e\"? (table, rat, bus)","answer":"table"},
        {"id":14,"type":"vowel","prompt":"Which letter in \"bag\" is the vowel?","answer":"a"},
        {"id":15,"type":"vowel","prompt":"How many vowels are in \"top\"?","answer":"1"},
        {"id":16,"type":"vowel","prompt":"Which word has 1 vowel? (tree, apple, dog)","answer":"dog"},
        {"id":17,"type":"vowel","prompt":"How many vowels are in \"moon\"?","answer":"2"},
        {"id":18,"type":"vowel","prompt":"How many vowels are in \"bread\"?","answer":"2"},
        {"id":19,"type":"vowel","prompt":"Which letter in \"night\" is the vowel?","answer":"i"},
        {"id":20,"type":"vowel","prompt":"Which word has the vowel \"u\"? (house, pot, tree)","answer":"house"},
        {"id":21,"type":"vowel","prompt":"Which word has 1 vowel? (pig, purple, train)","answer":"pig"},
        {"id":22,"type":"vowel","prompt":"Which word has 1 vowel? (plane, house, jam)","answer":"jam"},
        {"id":23,"type":"vowel","prompt":"Which word has the vowel \"a\"? (tiger, chair, moon)","answer":"chair"},
        {"id":24,"type":"vowel","prompt":"How many vowels are in \"fish\"?","answer":"1"}
]);
        checkVowelTruths(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(vowelSpec, g1, seedFrom([1, 'vowel', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"vowel","prompt":"Which word has the vowel \"i\"? (red, log, pin)","answer":"pin"},
        {"id":26,"type":"vowel","prompt":"Which word has 1 vowel? (chair, bird, water)","answer":"bird"},
        {"id":27,"type":"vowel","prompt":"Which word has 2 vowels? (sip, bus, lemon)","answer":"lemon"}
]);
    });
});

describe('vowel — Year 2 (tier-3 extended set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"vowel","prompt":"Which word has the vowel \"u\"? (house, moon, red)","answer":"house"},
        {"id":2,"type":"vowel","prompt":"Which word has the vowel \"a\"? (table, wig, window)","answer":"table"},
        {"id":3,"type":"vowel","prompt":"How many vowels are in \"apple\"?","answer":"2"},
        {"id":4,"type":"vowel","prompt":"Which word has the vowel \"i\"? (cup, wig, bus)","answer":"wig"},
        {"id":5,"type":"vowel","prompt":"How many vowels are in \"button\"?","answer":"2"},
        {"id":6,"type":"vowel","prompt":"How many vowels are in \"moon\"?","answer":"2"},
        {"id":7,"type":"vowel","prompt":"Which word has the vowel \"e\"? (map, pot, elephant)","answer":"elephant"},
        {"id":8,"type":"vowel","prompt":"How many vowels are in \"window\"?","answer":"2"},
        {"id":9,"type":"vowel","prompt":"Which letter in \"pot\" is the vowel?","answer":"o"},
        {"id":10,"type":"vowel","prompt":"Which word has the vowel \"o\"? (pin, bag, window)","answer":"window"},
        {"id":11,"type":"vowel","prompt":"How many vowels are in \"chocolate\"?","answer":"4"},
        {"id":12,"type":"vowel","prompt":"Which word has 2 vowels? (sip, water, beautiful)","answer":"water"},
        {"id":13,"type":"vowel","prompt":"How many vowels are in \"garden\"?","answer":"2"},
        {"id":14,"type":"vowel","prompt":"Which word has the vowel \"e\"? (chocolate, dolphin, family)","answer":"chocolate"},
        {"id":15,"type":"vowel","prompt":"How many vowels are in \"pumpkin\"?","answer":"2"},
        {"id":16,"type":"vowel","prompt":"Which word has the vowel \"a\"? (computer, top, grass)","answer":"grass"},
        {"id":17,"type":"vowel","prompt":"How many vowels are in \"rabbit\"?","answer":"2"},
        {"id":18,"type":"vowel","prompt":"Which word has 1 vowel? (house, chicken, fish)","answer":"fish"},
        {"id":19,"type":"vowel","prompt":"How many vowels are in \"leg\"?","answer":"1"},
        {"id":20,"type":"vowel","prompt":"How many vowels are in \"lemon\"?","answer":"2"},
        {"id":21,"type":"vowel","prompt":"Which word has 1 vowel? (bread, net, school)","answer":"net"},
        {"id":22,"type":"vowel","prompt":"Which word has the vowel \"i\"? (banana, dinosaur, pot)","answer":"dinosaur"},
        {"id":23,"type":"vowel","prompt":"Which word has the vowel \"u\"? (pig, box, bus)","answer":"bus"},
        {"id":24,"type":"vowel","prompt":"How many vowels are in \"plane\"?","answer":"2"}
]);
        checkVowelTruths(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(vowelSpec, g2, seedFrom([2, 'vowel', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"vowel","prompt":"How many vowels are in \"dinosaur\"?","answer":"4"},
        {"id":26,"type":"vowel","prompt":"How many vowels are in \"bag\"?","answer":"1"},
        {"id":27,"type":"vowel","prompt":"How many vowels are in \"purple\"?","answer":"2"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(vowelSpec, getGradeConfig(3), seedFrom([3, 'vowel', 0]))).toEqual([]);
    });
});
