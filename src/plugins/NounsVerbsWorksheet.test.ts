// Unit tests for the NOUNS & VERBS worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm or word banks change,
// these exact assertions fail — which is what we want, so a silent change to
// the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { grammarSpec } from './NounsVerbsWorksheet';

const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(grammarSpec, grade, seedFrom([grade.id, grammarSpec.id, 0]));
}

describe('grammar plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(grammarSpec.id).toBe('grammar');
        expect(grammarSpec.label).toBe('Nouns & Verbs');
        expect(grammarSpec.icon).toBe('&');
        expect(grammarSpec.perPage).toBe(24);
    });

    it('describes its scope (noun (thing) vs verb (action))', () => {
        expect(grammarSpec.scope(g2)).toBe('noun (thing) vs verb (action)');
    });

    it('is gated by the grade catalogue (Year 2 only)', () => {
        expect(grammarSpec.offered(getGradeConfig(0))).toBe(false);
        expect(grammarSpec.offered(getGradeConfig(1))).toBe(false);
        expect(grammarSpec.offered(g2)).toBe(true);
        expect(grammarSpec.offered(getGradeConfig(3))).toBe(false);
        // Unoffered grades => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(grammarSpec, getGradeConfig(1), seedFrom([1, 'grammar', 0]))).toEqual([]);
    });
});

describe('grammar — Year 2', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"grammar","prompt":"Is the word \"sing\" a noun (thing) or a verb (action)?","answer":"verb"},
        {"id":2,"type":"grammar","prompt":"Is the word \"button\" a noun (thing) or a verb (action)?","answer":"noun"},
        {"id":3,"type":"grammar","prompt":"Is the word \"write\" a noun (thing) or a verb (action)?","answer":"verb"},
        {"id":4,"type":"grammar","prompt":"Is the word \"fly\" a noun (thing) or a verb (action)?","answer":"verb"},
        {"id":5,"type":"grammar","prompt":"Is the word \"garden\" a noun (thing) or a verb (action)?","answer":"noun"},
        {"id":6,"type":"grammar","prompt":"Is the word \"window\" a noun (thing) or a verb (action)?","answer":"noun"},
        {"id":7,"type":"grammar","prompt":"Is the word \"grass\" a noun (thing) or a verb (action)?","answer":"noun"},
        {"id":8,"type":"grammar","prompt":"Is the word \"play\" a noun (thing) or a verb (action)?","answer":"verb"},
        {"id":9,"type":"grammar","prompt":"Is the word \"plane\" a noun (thing) or a verb (action)?","answer":"noun"},
        {"id":10,"type":"grammar","prompt":"Is the word \"walk\" a noun (thing) or a verb (action)?","answer":"verb"},
        {"id":11,"type":"grammar","prompt":"Is the word \"wash\" a noun (thing) or a verb (action)?","answer":"verb"},
        {"id":12,"type":"grammar","prompt":"Is the word \"chair\" a noun (thing) or a verb (action)?","answer":"noun"},
        {"id":13,"type":"grammar","prompt":"Is the word \"rabbit\" a noun (thing) or a verb (action)?","answer":"noun"},
        {"id":14,"type":"grammar","prompt":"Is the word \"cat\" a noun (thing) or a verb (action)?","answer":"noun"},
        {"id":15,"type":"grammar","prompt":"Is the word \"drive\" a noun (thing) or a verb (action)?","answer":"verb"},
        {"id":16,"type":"grammar","prompt":"Is the word \"dog\" a noun (thing) or a verb (action)?","answer":"noun"},
        {"id":17,"type":"grammar","prompt":"Is the word \"school\" a noun (thing) or a verb (action)?","answer":"noun"},
        {"id":18,"type":"grammar","prompt":"Is the word \"clap\" a noun (thing) or a verb (action)?","answer":"verb"},
        {"id":19,"type":"grammar","prompt":"Is the word \"fish\" a noun (thing) or a verb (action)?","answer":"noun"},
        {"id":20,"type":"grammar","prompt":"Is the word \"house\" a noun (thing) or a verb (action)?","answer":"noun"},
        {"id":21,"type":"grammar","prompt":"Is the word \"drink\" a noun (thing) or a verb (action)?","answer":"verb"},
        {"id":22,"type":"grammar","prompt":"Is the word \"tiger\" a noun (thing) or a verb (action)?","answer":"noun"},
        {"id":23,"type":"grammar","prompt":"Is the word \"apple\" a noun (thing) or a verb (action)?","answer":"noun"},
        {"id":24,"type":"grammar","prompt":"Is the word \"book\" a noun (thing) or a verb (action)?","answer":"noun"}
]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(grammarSpec, g2, seedFrom([2, 'grammar', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"grammar","prompt":"Is the word \"sleep\" a noun (thing) or a verb (action)?","answer":"verb"},
        {"id":26,"type":"grammar","prompt":"Is the word \"run\" a noun (thing) or a verb (action)?","answer":"verb"},
        {"id":27,"type":"grammar","prompt":"Is the word \"draw\" a noun (thing) or a verb (action)?","answer":"verb"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(grammarSpec, getGradeConfig(3), seedFrom([3, 'grammar', 0]))).toEqual([]);
    });
});
