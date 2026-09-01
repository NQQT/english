// Unit tests for the APOSTROPHES worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm or item banks change,
// these exact assertions fail — which is what we want, so a silent change to
// the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { apostropheSpec } from './ApostropheWorksheet';

const g3 = getGradeConfig(3);
const g6 = getGradeConfig(6);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(apostropheSpec, grade, seedFrom([grade.id, apostropheSpec.id, 0]));
}

describe('apostrophe plugin — declarative spec', () => {
    it('declares its sidebar label, glyph, page size and single-column layout', () => {
        expect(apostropheSpec.id).toBe('apostrophe');
        expect(apostropheSpec.label).toBe('Apostrophes');
        expect(apostropheSpec.icon).toBe("'");
        expect(apostropheSpec.perPage).toBe(16);
        // Prose lines run single-column.
        expect(apostropheSpec.singleColumn).toBe(true);
    });

    it('describes its scope (possessives & contractions)', () => {
        expect(apostropheSpec.scope(g3)).toBe('possessives & contractions');
        expect(apostropheSpec.scope(g6)).toBe('possessives & contractions');
    });

    it('is gated by the grade catalogue (Years 3..6 only)', () => {
        expect(apostropheSpec.offered(getGradeConfig(0))).toBe(false);
        expect(apostropheSpec.offered(getGradeConfig(1))).toBe(false);
        expect(apostropheSpec.offered(getGradeConfig(2))).toBe(false);
        expect(apostropheSpec.offered(g3)).toBe(true);
        expect(apostropheSpec.offered(g6)).toBe(true);
        expect(apostropheSpec.offered(getGradeConfig(7))).toBe(false);
        // Unoffered grades => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(apostropheSpec, getGradeConfig(2), seedFrom([2, 'apostrophe', 0]))).toEqual([]);
    });
});

describe('apostrophe — Year 3', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g3)).toEqual([
        {"prompt":"Write the contraction for \"it is\".","answer":"it's","id":1,"type":"apostrophe"},
        {"prompt":"Which shows that Ben owns something? (Ben's, Bens', Bens)","answer":"Ben's","id":2,"type":"apostrophe"},
        {"prompt":"Which contraction fits: __ are my friends. (you're, youre, youre')","answer":"you're","id":3,"type":"apostrophe"},
        {"prompt":"Which contraction fits: He __ know the answer. (doesnt, doesn't, doesnt')","answer":"doesn't","id":4,"type":"apostrophe"},
        {"prompt":"Which contraction fits: I __ like spinach. (dont, don't, dont')","answer":"don't","id":5,"type":"apostrophe"},
        {"prompt":"Which shows that The girl owns something? (The girls, The girls', The girl's)","answer":"The girl's","id":6,"type":"apostrophe"},
        {"prompt":"Which shows that Our team owns something? (Our team's, Our teams, Our teams')","answer":"Our team's","id":7,"type":"apostrophe"},
        {"prompt":"Which contraction fits: The dog __ stop barking. (didnt', didn't, didnt)","answer":"didn't","id":8,"type":"apostrophe"},
        {"prompt":"Which shows that The farmer owns something? (The farmers, The farmer's, The farmers')","answer":"The farmer's","id":9,"type":"apostrophe"},
        {"prompt":"Which shows that The doctor owns something? (The doctor's, The doctors', The doctors)","answer":"The doctor's","id":10,"type":"apostrophe"},
        {"prompt":"Which contraction fits: __ going to the library. (were, we're, were')","answer":"we're","id":11,"type":"apostrophe"},
        {"prompt":"Which shows that Ava owns something? (Avas', Ava's, Avas)","answer":"Ava's","id":12,"type":"apostrophe"},
        {"prompt":"Which contraction fits: She __ sing at the concert. (wont', won't, wont)","answer":"won't","id":13,"type":"apostrophe"},
        {"prompt":"Write the contraction for \"do not\".","answer":"don't","id":14,"type":"apostrophe"},
        {"prompt":"Which contraction fits: We __ late for school. (wont', wont, won't)","answer":"won't","id":15,"type":"apostrophe"},
        {"prompt":"Which contraction fits: He __ eaten his lunch. (hasn't, hasnt', hasnt)","answer":"hasn't","id":16,"type":"apostrophe"}
        ]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(apostropheSpec, g3, seedFrom([3, 'apostrophe', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Which shows that My sister owns something? (My sister's, My sisters', My sisters)","answer":"My sister's","id":17,"type":"apostrophe"},
        {"prompt":"Write the contraction for \"have not\".","answer":"haven't","id":18,"type":"apostrophe"},
        {"prompt":"Which shows that The dog owns something? (The dog's, The dogs, The dogs')","answer":"The dog's","id":19,"type":"apostrophe"}
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(apostropheSpec, getGradeConfig(7), seedFrom([7, 'apostrophe', 0]))).toEqual([]);
    });
});

describe('apostrophe — Year 6', () => {
    it('matches the exact page-1 head (grade 6 rolls its own stream)', () => {
        expect(sheet(g6).slice(0, 5)).toEqual([
        {"prompt":"Which shows that The girl owns something? (The girls', The girl's, The girls)","answer":"The girl's","id":1,"type":"apostrophe"},
        {"prompt":"Write the contraction for \"will not\".","answer":"won't","id":2,"type":"apostrophe"},
        {"prompt":"Which contraction fits: __ going to the library. (were', we're, were)","answer":"we're","id":3,"type":"apostrophe"},
        {"prompt":"Which shows that My brother owns something? (My brothers', My brother's, My brothers)","answer":"My brother's","id":4,"type":"apostrophe"},
        {"prompt":"Fill in the missing word: Fill up __ bowl, please. (the cat)","answer":"the cat's","id":5,"type":"apostrophe"}
        ]);
    });
});
