// Unit tests for the SYLLABLES worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm or word bank change,
// these exact assertions fail — which is what we want, so a silent change to
// the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { syllableSpec } from './SyllablesWorksheet';

const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(syllableSpec, grade, seedFrom([grade.id, syllableSpec.id, 0]));
}

describe('syllable plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(syllableSpec.id).toBe('syllable');
        expect(syllableSpec.label).toBe('Syllables');
        expect(syllableSpec.icon).toBe('∿');
        expect(syllableSpec.perPage).toBe(18);
    });

    it('describes its scope (count the beats)', () => {
        expect(syllableSpec.scope(g2)).toBe('count the beats');
    });

    it('is gated by the grade catalogue (Year 2..6 offer it, Year 7 does not)', () => {
        expect(syllableSpec.offered(getGradeConfig(0))).toBe(false);
        expect(syllableSpec.offered(getGradeConfig(1))).toBe(false);
        expect(syllableSpec.offered(g2)).toBe(true);
        expect(syllableSpec.offered(getGradeConfig(3))).toBe(true);
        expect(syllableSpec.offered(getGradeConfig(6))).toBe(true);
        expect(syllableSpec.offered(getGradeConfig(7))).toBe(false);
        // Unoffered grades => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(syllableSpec, getGradeConfig(1), seedFrom([1, 'syllable', 0]))).toEqual([]);
    });
});

describe('syllable — Year 2', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"prompt":"How many syllables are in \"paper\"?","answer":"2","id":1,"type":"syllable"},
        {"prompt":"How many syllables are in \"together\"?","answer":"3","id":2,"type":"syllable"},
        {"prompt":"Which word has 3 syllables? (balloon, party, family)","answer":"family","id":3,"type":"syllable"},
        {"prompt":"Which word has 3 syllables? (rabbit, yellow, baby)","answer":"yellow","id":4,"type":"syllable"},
        {"prompt":"Which word has the same number of syllables as \"wonderful\"? (basket, telescope, caterpillar)","answer":"telescope","id":5,"type":"syllable"},
        {"prompt":"Which word has the same number of syllables as \"window\"? (helmet, dinosaur, computer)","answer":"helmet","id":6,"type":"syllable"},
        {"prompt":"Which word has 3 syllables? (umbrella, helmet, lady)","answer":"umbrella","id":7,"type":"syllable"},
        {"prompt":"Which word has 3 syllables? (napkin, telescope, summer)","answer":"telescope","id":8,"type":"syllable"},
        {"prompt":"Which word has 4 syllables? (alligator, bicycle, holiday)","answer":"alligator","id":9,"type":"syllable"},
        {"prompt":"Which word has 2 syllables? (helicopter, elephant, music)","answer":"music","id":10,"type":"syllable"},
        {"prompt":"Which word has the same number of syllables as \"water\"? (vanilla, radio, puppy)","answer":"puppy","id":11,"type":"syllable"},
        {"prompt":"Which word has 3 syllables? (pajamas, market, winter)","answer":"pajamas","id":12,"type":"syllable"},
        {"prompt":"How many syllables are in \"kitten\"?","answer":"2","id":13,"type":"syllable"},
        {"prompt":"Which word has 4 syllables? (tiger, monkey, avocado)","answer":"avocado","id":14,"type":"syllable"},
        {"prompt":"How many syllables are in \"gorilla\"?","answer":"3","id":15,"type":"syllable"},
        {"prompt":"Which word has 3 syllables? (animal, butter, candy)","answer":"animal","id":16,"type":"syllable"},
        {"prompt":"Which word has the same number of syllables as \"lion\"? (umbrella, story, together)","answer":"story","id":17,"type":"syllable"},
        {"prompt":"Which word has the same number of syllables as \"paper\"? (telescope, lady, potato)","answer":"lady","id":18,"type":"syllable"},
        ]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(syllableSpec, g2, seedFrom([2, 'syllable', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"How many syllables are in \"vanilla\"?","answer":"3","id":19,"type":"syllable"},
        {"prompt":"Which word has the same number of syllables as \"water\"? (window, yellow, family)","answer":"window","id":20,"type":"syllable"},
        {"prompt":"Which word has 3 syllables? (lion, crocodile, city)","answer":"crocodile","id":21,"type":"syllable"},
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(syllableSpec, getGradeConfig(7), seedFrom([7, 'syllable', 0]))).toEqual([]);
    });
});
