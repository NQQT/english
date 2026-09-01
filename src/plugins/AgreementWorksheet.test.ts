// Unit tests for the SUBJECT–VERB AGREEMENT worksheet plugin (Year 5+).
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm or pair bank changes,
// these exact assertions fail — which is what we want, so a silent change to
// the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { agreementSpec } from './AgreementWorksheet';

const g5 = getGradeConfig(5);
const g6 = getGradeConfig(6);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(agreementSpec, grade, seedFrom([grade.id, agreementSpec.id, 0]));
}

describe('agreement plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(agreementSpec.id).toBe('agreement');
        expect(agreementSpec.label).toBe('Verb Agreement');
        expect(agreementSpec.icon).toBe('=');
        expect(agreementSpec.perPage).toBe(18);
    });

    it('describes its scope (subjects & verbs that match)', () => {
        expect(agreementSpec.scope(g5)).toBe('subjects & verbs that match');
        expect(agreementSpec.scope(g6)).toBe('subjects & verbs that match');
    });

    it('is gated by the grade catalogue (Years 3..6 only, targeting Y5+)', () => {
        expect(agreementSpec.offered(getGradeConfig(0))).toBe(false);
        expect(agreementSpec.offered(getGradeConfig(1))).toBe(false);
        expect(agreementSpec.offered(getGradeConfig(2))).toBe(false);
        expect(agreementSpec.offered(getGradeConfig(3))).toBe(true);
        expect(agreementSpec.offered(g5)).toBe(true);
        expect(agreementSpec.offered(g6)).toBe(true);
        expect(agreementSpec.offered(getGradeConfig(7))).toBe(false);
        // Unoffered grades => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(agreementSpec, getGradeConfig(2), seedFrom([2, 'agreement', 0]))).toEqual([]);
    });
});

describe('agreement — Year 5', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g5)).toEqual([
        {"prompt":"Which verb agrees: My brothers __ watching TV? (is, was, are)","answer":"are","id":1,"type":"agreement"},
        {"prompt":"Which verb agrees: The bird __ singing? (have, are, is)","answer":"is","id":2,"type":"agreement"},
        {"prompt":"Choose the correct verb: The kittens __ hiding.","answer":"were","id":3,"type":"agreement"},
        {"prompt":"Which verb agrees: The dog __ barking? (does, are, is)","answer":"is","id":4,"type":"agreement"},
        {"prompt":"Which subject fits: __ a happy. (The player or The players)","answer":"The players","id":5,"type":"agreement"},
        {"prompt":"Choose the correct verb: The teachers __ a new planner.","answer":"have","id":6,"type":"agreement"},
        {"prompt":"Which verb agrees: My cousins __ arrived? (have, has, do)","answer":"have","id":7,"type":"agreement"},
        {"prompt":"Which verb agrees: The men __ mending the fence? (was, are, were)","answer":"were","id":8,"type":"agreement"},
        {"prompt":"Choose the correct verb: The child __ reading quietly.","answer":"is","id":9,"type":"agreement"},
        {"prompt":"Which subject fits: __ d happy. (The mouse or The mice)","answer":"The mouse","id":10,"type":"agreement"},
        {"prompt":"Choose the correct verb: The women __ swimming laps.","answer":"are","id":11,"type":"agreement"},
        {"prompt":"Which subject fits: __ r happy. (The goose or The geese)","answer":"The geese","id":12,"type":"agreement"},
        {"prompt":"Which verb agrees: The babies __ sleeping? (is, have, are)","answer":"are","id":13,"type":"agreement"},
        {"prompt":"Which verb agrees: My friends __ coming over? (is, does, are)","answer":"are","id":14,"type":"agreement"},
        {"prompt":"Which subject fits: __ e happy. (The farmer or The farmers)","answer":"The farmers","id":15,"type":"agreement"},
        {"prompt":"Choose the correct verb: The student __ finished the test.","answer":"has","id":16,"type":"agreement"},
        {"prompt":"Which verb agrees: The teachers __ a new planner? (is, have, has)","answer":"have","id":17,"type":"agreement"},
        {"prompt":"Choose the correct verb: My friends __ coming over.","answer":"are","id":18,"type":"agreement"}
        ]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(agreementSpec, g5, seedFrom([5, 'agreement', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Which verb agrees: The mice __ sneaking about? (is, are, were)","answer":"are","id":19,"type":"agreement"},
        {"prompt":"Which subject fits: __ r happy. (The child or The children)","answer":"The children","id":20,"type":"agreement"},
        {"prompt":"Which verb agrees: The goose __ waddling to the pond? (has, were, was)","answer":"was","id":21,"type":"agreement"}
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(agreementSpec, getGradeConfig(7), seedFrom([7, 'agreement', 0]))).toEqual([]);
    });
});

describe('agreement — Year 6', () => {
    it('matches the exact page-1 head (grade 6 rolls its own stream)', () => {
        expect(sheet(g6).slice(0, 3)).toEqual([
        {"prompt":"Which subject fits: __ e happy. (The teacher or The teachers)","answer":"The teachers","id":1,"type":"agreement"},
        {"prompt":"Which subject fits: __ h happy. (The kitten or The kittens)","answer":"The kitten","id":2,"type":"agreement"},
        {"prompt":"Which subject fits: __ r happy. (The man or The men)","answer":"The men","id":3,"type":"agreement"}
        ]);
    });
});
