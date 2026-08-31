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

// Semantic invariant: a count line reports the true vowel count; a "which
// letter" line names the (single) vowel letter of the word.
function vowelCount(word: string): number {
    let n = 0;
    for (const ch of word.toLowerCase()) if ('aeiou'.includes(ch)) n += 1;
    return n;
}
function checkVowelTruths(grade: GradeConfig) {
    for (const p of sheet(grade)) {
        const word = p.prompt.match(/"([a-z]+)"/)![1];
        if (p.prompt.startsWith('Which letter')) {
            expect(vowelCount(word)).toBe(1);
            expect(p.answer).toBe(word.split('').find((c) => 'aeiou'.includes(c)));
        } else {
            expect(p.answer).toBe(String(vowelCount(word)));
        }
    }
}

describe('vowel — Prep (tier-1 starter word set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g0)).toEqual([
        {"id":1,"type":"vowel","prompt":"How many vowels are in \"dog\"?","answer":"1"},
        {"id":2,"type":"vowel","prompt":"Which letter in \"leg\" is the vowel?","answer":"e"},
        {"id":3,"type":"vowel","prompt":"Which letter in \"sip\" is the vowel?","answer":"i"},
        {"id":4,"type":"vowel","prompt":"Which letter in \"cat\" is the vowel?","answer":"a"},
        {"id":5,"type":"vowel","prompt":"Which letter in \"pot\" is the vowel?","answer":"o"},
        {"id":6,"type":"vowel","prompt":"Which letter in \"wig\" is the vowel?","answer":"i"},
        {"id":7,"type":"vowel","prompt":"Which letter in \"jam\" is the vowel?","answer":"a"},
        {"id":8,"type":"vowel","prompt":"Which letter in \"bus\" is the vowel?","answer":"u"},
        {"id":9,"type":"vowel","prompt":"Which letter in \"red\" is the vowel?","answer":"e"},
        {"id":10,"type":"vowel","prompt":"How many vowels are in \"rat\"?","answer":"1"},
        {"id":11,"type":"vowel","prompt":"Which letter in \"pig\" is the vowel?","answer":"i"},
        {"id":12,"type":"vowel","prompt":"How many vowels are in \"bag\"?","answer":"1"},
        {"id":13,"type":"vowel","prompt":"Which letter in \"bed\" is the vowel?","answer":"e"},
        {"id":14,"type":"vowel","prompt":"Which letter in \"map\" is the vowel?","answer":"a"},
        {"id":15,"type":"vowel","prompt":"How many vowels are in \"net\"?","answer":"1"},
        {"id":16,"type":"vowel","prompt":"How many vowels are in \"box\"?","answer":"1"},
        {"id":17,"type":"vowel","prompt":"Which letter in \"top\" is the vowel?","answer":"o"},
        {"id":18,"type":"vowel","prompt":"How many vowels are in \"sun\"?","answer":"1"},
        {"id":19,"type":"vowel","prompt":"Which letter in \"fan\" is the vowel?","answer":"a"},
        {"id":20,"type":"vowel","prompt":"Which letter in \"pin\" is the vowel?","answer":"i"},
        {"id":21,"type":"vowel","prompt":"Which letter in \"cup\" is the vowel?","answer":"u"},
        {"id":22,"type":"vowel","prompt":"Which letter in \"pen\" is the vowel?","answer":"e"},
        {"id":23,"type":"vowel","prompt":"How many vowels are in \"hat\"?","answer":"1"},
        {"id":24,"type":"vowel","prompt":"Which letter in \"log\" is the vowel?","answer":"o"}
]);
        checkVowelTruths(g0);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(vowelSpec, g0, seedFrom([0, 'vowel', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"vowel","prompt":"How many vowels are in \"moon\"?","answer":"2"},
        {"id":26,"type":"vowel","prompt":"How many vowels are in \"pig\"?","answer":"1"},
        {"id":27,"type":"vowel","prompt":"How many vowels are in \"log\"?","answer":"1"}
]);
    });
});

describe('vowel — Year 1 (tier-2 common word set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"id":1,"type":"vowel","prompt":"How many vowels are in \"pot\"?","answer":"1"},
        {"id":2,"type":"vowel","prompt":"How many vowels are in \"table\"?","answer":"2"},
        {"id":3,"type":"vowel","prompt":"How many vowels are in \"rabbit\"?","answer":"2"},
        {"id":4,"type":"vowel","prompt":"Which letter in \"light\" is the vowel?","answer":"i"},
        {"id":5,"type":"vowel","prompt":"How many vowels are in \"fan\"?","answer":"1"},
        {"id":6,"type":"vowel","prompt":"How many vowels are in \"net\"?","answer":"1"},
        {"id":7,"type":"vowel","prompt":"How many vowels are in \"bag\"?","answer":"1"},
        {"id":8,"type":"vowel","prompt":"Which letter in \"top\" is the vowel?","answer":"o"},
        {"id":9,"type":"vowel","prompt":"Which letter in \"dog\" is the vowel?","answer":"o"},
        {"id":10,"type":"vowel","prompt":"Which letter in \"cat\" is the vowel?","answer":"a"},
        {"id":11,"type":"vowel","prompt":"Which letter in \"red\" is the vowel?","answer":"e"},
        {"id":12,"type":"vowel","prompt":"Which letter in \"hat\" is the vowel?","answer":"a"},
        {"id":13,"type":"vowel","prompt":"Which letter in \"log\" is the vowel?","answer":"o"},
        {"id":14,"type":"vowel","prompt":"How many vowels are in \"apple\"?","answer":"2"},
        {"id":15,"type":"vowel","prompt":"Which letter in \"shirt\" is the vowel?","answer":"i"},
        {"id":16,"type":"vowel","prompt":"How many vowels are in \"pen\"?","answer":"1"},
        {"id":17,"type":"vowel","prompt":"Which letter in \"grass\" is the vowel?","answer":"a"},
        {"id":18,"type":"vowel","prompt":"How many vowels are in \"cup\"?","answer":"1"},
        {"id":19,"type":"vowel","prompt":"How many vowels are in \"rat\"?","answer":"1"},
        {"id":20,"type":"vowel","prompt":"Which letter in \"bed\" is the vowel?","answer":"e"},
        {"id":21,"type":"vowel","prompt":"How many vowels are in \"pin\"?","answer":"1"},
        {"id":22,"type":"vowel","prompt":"How many vowels are in \"tree\"?","answer":"2"},
        {"id":23,"type":"vowel","prompt":"How many vowels are in \"moon\"?","answer":"2"},
        {"id":24,"type":"vowel","prompt":"How many vowels are in \"bread\"?","answer":"2"}
]);
        checkVowelTruths(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(vowelSpec, g1, seedFrom([1, 'vowel', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"vowel","prompt":"Which letter in \"night\" is the vowel?","answer":"i"},
        {"id":26,"type":"vowel","prompt":"How many vowels are in \"pig\"?","answer":"1"},
        {"id":27,"type":"vowel","prompt":"How many vowels are in \"train\"?","answer":"2"}
]);
    });
});

describe('vowel — Year 2 (tier-3 extended set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"vowel","prompt":"How many vowels are in \"apple\"?","answer":"2"},
        {"id":2,"type":"vowel","prompt":"How many vowels are in \"button\"?","answer":"2"},
        {"id":3,"type":"vowel","prompt":"How many vowels are in \"moon\"?","answer":"2"},
        {"id":4,"type":"vowel","prompt":"How many vowels are in \"window\"?","answer":"2"},
        {"id":5,"type":"vowel","prompt":"How many vowels are in \"pot\"?","answer":"1"},
        {"id":6,"type":"vowel","prompt":"How many vowels are in \"chocolate\"?","answer":"4"},
        {"id":7,"type":"vowel","prompt":"How many vowels are in \"water\"?","answer":"2"},
        {"id":8,"type":"vowel","prompt":"How many vowels are in \"green\"?","answer":"2"},
        {"id":9,"type":"vowel","prompt":"How many vowels are in \"beautiful\"?","answer":"5"},
        {"id":10,"type":"vowel","prompt":"Which letter in \"sip\" is the vowel?","answer":"i"},
        {"id":11,"type":"vowel","prompt":"How many vowels are in \"garden\"?","answer":"2"},
        {"id":12,"type":"vowel","prompt":"How many vowels are in \"pumpkin\"?","answer":"2"},
        {"id":13,"type":"vowel","prompt":"How many vowels are in \"rabbit\"?","answer":"2"},
        {"id":14,"type":"vowel","prompt":"How many vowels are in \"fish\"?","answer":"1"},
        {"id":15,"type":"vowel","prompt":"How many vowels are in \"hat\"?","answer":"1"},
        {"id":16,"type":"vowel","prompt":"How many vowels are in \"house\"?","answer":"3"},
        {"id":17,"type":"vowel","prompt":"How many vowels are in \"chicken\"?","answer":"2"},
        {"id":18,"type":"vowel","prompt":"How many vowels are in \"leg\"?","answer":"1"},
        {"id":19,"type":"vowel","prompt":"How many vowels are in \"lemon\"?","answer":"2"},
        {"id":20,"type":"vowel","prompt":"Which letter in \"net\" is the vowel?","answer":"e"},
        {"id":21,"type":"vowel","prompt":"How many vowels are in \"bread\"?","answer":"2"},
        {"id":22,"type":"vowel","prompt":"How many vowels are in \"school\"?","answer":"2"},
        {"id":23,"type":"vowel","prompt":"How many vowels are in \"plane\"?","answer":"2"},
        {"id":24,"type":"vowel","prompt":"How many vowels are in \"dinosaur\"?","answer":"4"}
]);
        checkVowelTruths(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(vowelSpec, g2, seedFrom([2, 'vowel', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"vowel","prompt":"Which letter in \"bag\" is the vowel?","answer":"a"},
        {"id":26,"type":"vowel","prompt":"How many vowels are in \"purple\"?","answer":"2"},
        {"id":27,"type":"vowel","prompt":"How many vowels are in \"dolphin\"?","answer":"2"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(vowelSpec, getGradeConfig(3), seedFrom([3, 'vowel', 0]))).toEqual([]);
    });
});
