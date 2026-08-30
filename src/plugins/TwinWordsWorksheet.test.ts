// Unit tests for the TWIN WORDS (HOMOPHONES) worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm, pair bank, or caps
// change, these exact assertions fail — which is what we want, so a silent
// change to the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { homophoneSpec } from './TwinWordsWorksheet';

const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(homophoneSpec, grade, seedFrom([grade.id, homophoneSpec.id, 0]));
}

describe('homophone plugin — declarative spec', () => {
    it('declares its sidebar label, glyph, page size and single-column layout', () => {
        expect(homophoneSpec.id).toBe('homophone');
        expect(homophoneSpec.label).toBe('Twin Words');
        expect(homophoneSpec.icon).toBe('2');
        expect(homophoneSpec.perPage).toBe(16);
        // Twin-word sentences are prose — single-column.
        expect(homophoneSpec.singleColumn).toBe(true);
    });

    it('describes its pair scope from the grade caps (basic vs tricky)', () => {
        expect(homophoneSpec.scope(g1)).toBe('basic pairs');
        expect(homophoneSpec.scope(g2)).toBe('basic & tricky pairs');
    });

    it('is gated by the grade catalogue (Year 1 and Year 2 only)', () => {
        expect(homophoneSpec.offered(getGradeConfig(0))).toBe(false);
        expect(homophoneSpec.offered(g1)).toBe(true);
        expect(homophoneSpec.offered(g2)).toBe(true);
        expect(homophoneSpec.offered(getGradeConfig(3))).toBe(false);
    });
});

// Semantic invariant: the answer is one of the two printed "(a or b)"
// options.
function checkOptionsContainAnswer(grade: GradeConfig) {
    for (const p of sheet(grade)) {
        const m = p.prompt.match(/\(([^)]+)\)\s*$/);
        expect(m).not.toBeNull();
        const options = m![1].split(' or ').map((s) => s.trim());
        expect(options).toContain(p.answer);
    }
}

describe('homophone — Year 1 (basic pairs only)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"id":1,"type":"homophone","prompt":"I have __ apples. (to or two)","answer":"two"},
        {"id":2,"type":"homophone","prompt":"Put the pencil __ . (their or there)","answer":"there"},
        {"id":3,"type":"homophone","prompt":"I want __ go to the park. (too or to)","answer":"to"},
        {"id":4,"type":"homophone","prompt":"__ late! I am sorry. (To or Too)","answer":"Too"},
        {"id":5,"type":"homophone","prompt":"Put the pencil __ . (their or there)","answer":"there"},
        {"id":6,"type":"homophone","prompt":"Put the pencil __ . (their or there)","answer":"there"},
        {"id":7,"type":"homophone","prompt":"Is that __ book? (you're or your)","answer":"your"},
        {"id":8,"type":"homophone","prompt":"Put the pencil __ . (their or there)","answer":"there"},
        {"id":9,"type":"homophone","prompt":"I have __ apples. (to or two)","answer":"two"},
        {"id":10,"type":"homophone","prompt":"I have __ apples. (to or two)","answer":"two"},
        {"id":11,"type":"homophone","prompt":"I want __ go to the park. (too or to)","answer":"to"},
        {"id":12,"type":"homophone","prompt":"__ late! I am sorry. (To or Too)","answer":"Too"},
        {"id":13,"type":"homophone","prompt":"The dog is over __ . (their or there)","answer":"there"},
        {"id":14,"type":"homophone","prompt":"I have __ apples. (to or two)","answer":"two"},
        {"id":15,"type":"homophone","prompt":"Put the pencil __ . (their or there)","answer":"there"},
        {"id":16,"type":"homophone","prompt":"Put the pencil __ . (their or there)","answer":"there"}
]);
        checkOptionsContainAnswer(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(homophoneSpec, g1, seedFrom([1, 'homophone', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":17,"type":"homophone","prompt":"Put the pencil __ . (their or there)","answer":"there"},
        {"id":18,"type":"homophone","prompt":"The dog is over __ . (their or there)","answer":"there"},
        {"id":19,"type":"homophone","prompt":"__ late! I am sorry. (To or Too)","answer":"Too"}
]);
    });
});

describe('homophone — Year 2 (adds the tricky pairs)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"homophone","prompt":"__ going to rain today. (Its or It's)","answer":"It's"},
        {"id":2,"type":"homophone","prompt":"Put the pencil __ . (their or there)","answer":"there"},
        {"id":3,"type":"homophone","prompt":"The cat licked __ paw. (it's or its)","answer":"its"},
        {"id":4,"type":"homophone","prompt":"The dog is over __ . (their or there)","answer":"there"},
        {"id":5,"type":"homophone","prompt":"Put the pencil __ . (their or there)","answer":"there"},
        {"id":6,"type":"homophone","prompt":"Where __ you going? (our or are)","answer":"are"},
        {"id":7,"type":"homophone","prompt":"The dog is over __ . (their or there)","answer":"there"},
        {"id":8,"type":"homophone","prompt":"I have __ apples. (to or two)","answer":"two"},
        {"id":9,"type":"homophone","prompt":"Put the pencil __ . (their or there)","answer":"there"},
        {"id":10,"type":"homophone","prompt":"The book is on __ desk. (here or her)","answer":"her"},
        {"id":11,"type":"homophone","prompt":"I want __ go to the park. (too or to)","answer":"to"},
        {"id":12,"type":"homophone","prompt":"__ went to the shop yesterday. (Their or They)","answer":"They"},
        {"id":13,"type":"homophone","prompt":"__ late! I am sorry. (To or Too)","answer":"Too"},
        {"id":14,"type":"homophone","prompt":"The dog is over __ . (their or there)","answer":"there"},
        {"id":15,"type":"homophone","prompt":"The cat licked __ paw. (it's or its)","answer":"its"},
        {"id":16,"type":"homophone","prompt":"The cat licked __ paw. (it's or its)","answer":"its"}
]);
        checkOptionsContainAnswer(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(homophoneSpec, g2, seedFrom([2, 'homophone', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":17,"type":"homophone","prompt":"__ going to rain today. (Its or It's)","answer":"It's"},
        {"id":18,"type":"homophone","prompt":"__ went to the shop yesterday. (Their or They)","answer":"They"},
        {"id":19,"type":"homophone","prompt":"The dog is over __ . (their or there)","answer":"there"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(homophoneSpec, getGradeConfig(3), seedFrom([3, 'homophone', 0]))).toEqual([]);
    });
});
