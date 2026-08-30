// Unit tests for the PAST TENSE worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm or pair bank change,
// these exact assertions fail — which is what we want, so a silent change to
// the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { tenseSpec } from './PastTenseWorksheet';

const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(tenseSpec, grade, seedFrom([grade.id, tenseSpec.id, 0]));
}

describe('tense plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(tenseSpec.id).toBe('tense');
        expect(tenseSpec.label).toBe('Past Tense');
        expect(tenseSpec.icon).toBe('→');
        expect(tenseSpec.perPage).toBe(24);
    });

    it('describes its scope (past forms)', () => {
        expect(tenseSpec.scope(g2)).toBe('past forms');
    });

    it('is gated by the grade catalogue (Year 2 only)', () => {
        expect(tenseSpec.offered(getGradeConfig(0))).toBe(false);
        expect(tenseSpec.offered(getGradeConfig(1))).toBe(false);
        expect(tenseSpec.offered(g2)).toBe(true);
        expect(tenseSpec.offered(getGradeConfig(3))).toBe(false);
        // Unoffered grades => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(tenseSpec, getGradeConfig(1), seedFrom([1, 'tense', 0]))).toEqual([]);
    });
});

describe('tense — Year 2', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"tense","prompt":"What is the past tense of \"take\"?","answer":"took"},
        {"id":2,"type":"tense","prompt":"What is the past tense of \"drive\"?","answer":"drove"},
        {"id":3,"type":"tense","prompt":"What is the past tense of \"walk\"?","answer":"walked"},
        {"id":4,"type":"tense","prompt":"What is the past tense of \"eat\"?","answer":"ate"},
        {"id":5,"type":"tense","prompt":"What is the past tense of \"take\"?","answer":"took"},
        {"id":6,"type":"tense","prompt":"What is the past tense of \"drive\"?","answer":"drove"},
        {"id":7,"type":"tense","prompt":"What is the past tense of \"write\"?","answer":"wrote"},
        {"id":8,"type":"tense","prompt":"What is the past tense of \"jump\"?","answer":"jumped"},
        {"id":9,"type":"tense","prompt":"What is the past tense of \"eat\"?","answer":"ate"},
        {"id":10,"type":"tense","prompt":"What is the past tense of \"run\"?","answer":"ran"},
        {"id":11,"type":"tense","prompt":"What is the past tense of \"see\"?","answer":"saw"},
        {"id":12,"type":"tense","prompt":"What is the past tense of \"go\"?","answer":"went"},
        {"id":13,"type":"tense","prompt":"What is the past tense of \"run\"?","answer":"ran"},
        {"id":14,"type":"tense","prompt":"What is the past tense of \"take\"?","answer":"took"},
        {"id":15,"type":"tense","prompt":"What is the past tense of \"kick\"?","answer":"kicked"},
        {"id":16,"type":"tense","prompt":"What is the past tense of \"walk\"?","answer":"walked"},
        {"id":17,"type":"tense","prompt":"What is the past tense of \"jump\"?","answer":"jumped"},
        {"id":18,"type":"tense","prompt":"What is the past tense of \"walk\"?","answer":"walked"},
        {"id":19,"type":"tense","prompt":"What is the past tense of \"kick\"?","answer":"kicked"},
        {"id":20,"type":"tense","prompt":"What is the past tense of \"play\"?","answer":"played"},
        {"id":21,"type":"tense","prompt":"What is the past tense of \"eat\"?","answer":"ate"},
        {"id":22,"type":"tense","prompt":"What is the past tense of \"see\"?","answer":"saw"},
        {"id":23,"type":"tense","prompt":"What is the past tense of \"make\"?","answer":"made"},
        {"id":24,"type":"tense","prompt":"What is the past tense of \"eat\"?","answer":"ate"}
]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(tenseSpec, g2, seedFrom([2, 'tense', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"tense","prompt":"What is the past tense of \"jump\"?","answer":"jumped"},
        {"id":26,"type":"tense","prompt":"What is the past tense of \"go\"?","answer":"went"},
        {"id":27,"type":"tense","prompt":"What is the past tense of \"see\"?","answer":"saw"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(tenseSpec, getGradeConfig(3), seedFrom([3, 'tense', 0]))).toEqual([]);
    });
});
