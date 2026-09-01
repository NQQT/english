// Unit tests for the PREFIXES & SUFFIXES worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm or affix banks change,
// these exact assertions fail — which is what we want, so a silent change to
// the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { affixSpec } from './AffixWorksheet';

const g3 = getGradeConfig(3);
const g6 = getGradeConfig(6);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(affixSpec, grade, seedFrom([grade.id, affixSpec.id, 0]));
}

describe('affix plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(affixSpec.id).toBe('affix');
        expect(affixSpec.label).toBe('Prefixes & Suffixes');
        expect(affixSpec.icon).toBe('±');
        expect(affixSpec.perPage).toBe(18);
    });

    it('describes its scope (word building blocks)', () => {
        expect(affixSpec.scope(g3)).toBe('word building blocks');
        expect(affixSpec.scope(g6)).toBe('word building blocks');
    });

    it('is gated by the grade catalogue (Years 3..6 only)', () => {
        expect(affixSpec.offered(getGradeConfig(0))).toBe(false);
        expect(affixSpec.offered(getGradeConfig(1))).toBe(false);
        expect(affixSpec.offered(getGradeConfig(2))).toBe(false);
        expect(affixSpec.offered(g3)).toBe(true);
        expect(affixSpec.offered(g6)).toBe(true);
        expect(affixSpec.offered(getGradeConfig(7))).toBe(false);
        // Unoffered grades => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(affixSpec, getGradeConfig(2), seedFrom([2, 'affix', 0]))).toEqual([]);
    });
});

describe('affix — Year 3', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g3)).toEqual([
        {"prompt":"Which word has the suffix \"er\"? (refill, teacher, preview)","answer":"teacher","id":1,"type":"affix"},
        {"prompt":"Which word has the prefix \"un\"? (teacher, hopeless, unpack)","answer":"unpack","id":2,"type":"affix"},
        {"prompt":"What does the suffix \"ly\" do? (in that way, make/become, person who)","answer":"in that way","id":3,"type":"affix"},
        {"prompt":"Which word has the prefix \"under\"? (undersize, organise, slowly)","answer":"undersize","id":4,"type":"affix"},
        {"prompt":"Add the prefix \"sub\" to \"marine\".","answer":"submarine","id":5,"type":"affix"},
        {"prompt":"What does the prefix \"re\" mean in \"replay\"?","answer":"again","id":6,"type":"affix"},
        {"prompt":"Which word has the suffix \"ing\"? (running, replay, disagree)","answer":"running","id":7,"type":"affix"},
        {"prompt":"Add the prefix \"dis\" to \"honest\".","answer":"dishonest","id":8,"type":"affix"},
        {"prompt":"What does the suffix \"ed\" do? (in that way, already happened, doing now)","answer":"already happened","id":9,"type":"affix"},
        {"prompt":"Add the suffix \"ise\" to \"apolog\".","answer":"apologise","id":10,"type":"affix"},
        {"prompt":"What does the suffix \"able\" mean in \"comfortable\"?","answer":"able to be","id":11,"type":"affix"},
        {"prompt":"What does the prefix \"over\" mean in \"overcook\"?","answer":"too much","id":12,"type":"affix"},
        {"prompt":"Add the suffix \"less\" to \"hope\".","answer":"hopeless","id":13,"type":"affix"},
        {"prompt":"What does the suffix \"less\" mean in \"careless\"?","answer":"without","id":14,"type":"affix"},
        {"prompt":"Add the prefix \"un\" to \"fair\".","answer":"unfair","id":15,"type":"affix"},
        {"prompt":"What does the prefix \"un\" mean in \"unlock\"?","answer":"reverse","id":16,"type":"affix"},
        {"prompt":"Which word has the prefix \"dis\"? (disagree, organise, realise)","answer":"disagree","id":17,"type":"affix"},
        {"prompt":"Add the prefix \"dis\" to \"appear\".","answer":"disappear","id":18,"type":"affix"}
        ]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(affixSpec, g3, seedFrom([3, 'affix', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Which word has the suffix \"er\"? (singer, dishonest, disappear)","answer":"singer","id":19,"type":"affix"},
        {"prompt":"Which word has the prefix \"re\"? (teacher, jumped, refill)","answer":"refill","id":20,"type":"affix"},
        {"prompt":"Which word has the suffix \"ise\"? (refill, unlock, organise)","answer":"organise","id":21,"type":"affix"}
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(affixSpec, getGradeConfig(7), seedFrom([7, 'affix', 0]))).toEqual([]);
    });
});

describe('affix — Year 6', () => {
    it('matches the exact page-1 head (grade 6 rolls its own stream)', () => {
        expect(sheet(g6).slice(0, 5)).toEqual([
        {"prompt":"What does the prefix \"un\" mean in \"unpack\"?","answer":"reverse","id":1,"type":"affix"},
        {"prompt":"What does the prefix \"re\" do? (again, opposite, under)","answer":"again","id":2,"type":"affix"},
        {"prompt":"What does the prefix \"mis\" do? (again, opposite, wrongly)","answer":"wrongly","id":3,"type":"affix"},
        {"prompt":"What does the suffix \"less\" mean in \"careless\"?","answer":"without","id":4,"type":"affix"},
        {"prompt":"What does the prefix \"over\" mean in \"overcook\"?","answer":"too much","id":5,"type":"affix"}
        ]);
    });
});
