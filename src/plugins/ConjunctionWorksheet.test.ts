// Unit tests for the CONJUNCTIONS worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm or clause banks change,
// these exact assertions fail — which is what we want, so a silent change to
// the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { conjunctionSpec } from './ConjunctionWorksheet';

const g3 = getGradeConfig(3);
const g6 = getGradeConfig(6);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(conjunctionSpec, grade, seedFrom([grade.id, conjunctionSpec.id, 0]));
}

describe('conjunction plugin — declarative spec', () => {
    it('declares its sidebar label, glyph, page size and single-column layout', () => {
        expect(conjunctionSpec.id).toBe('conjunction');
        expect(conjunctionSpec.label).toBe('Conjunctions');
        expect(conjunctionSpec.icon).toBe('+');
        expect(conjunctionSpec.perPage).toBe(16);
        // Gap sentences are prose — single-column.
        expect(conjunctionSpec.singleColumn).toBe(true);
    });

    it('describes its scope (and, but, or, so, because)', () => {
        expect(conjunctionSpec.scope(g3)).toBe('and, but, or, so, because');
        expect(conjunctionSpec.scope(g6)).toBe('and, but, or, so, because');
    });

    it('is gated by the grade catalogue (Years 3..6 only)', () => {
        expect(conjunctionSpec.offered(getGradeConfig(0))).toBe(false);
        expect(conjunctionSpec.offered(getGradeConfig(1))).toBe(false);
        expect(conjunctionSpec.offered(getGradeConfig(2))).toBe(false);
        expect(conjunctionSpec.offered(g3)).toBe(true);
        expect(conjunctionSpec.offered(g6)).toBe(true);
        expect(conjunctionSpec.offered(getGradeConfig(7))).toBe(false);
        // Unoffered grades => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(conjunctionSpec, getGradeConfig(2), seedFrom([2, 'conjunction', 0]))).toEqual([]);
    });
});

describe('conjunction — Year 3', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g3)).toEqual([
        {"prompt":"__ you finish your homework, you can watch TV. (or, but, if)","answer":"if","id":1,"type":"conjunction"},
        {"prompt":"Join with the best conjunction: The bell rang __ we were hungry","answer":"because","id":2,"type":"conjunction"},
        {"prompt":"Which conjunction fits best: Mia finished her book __ the gate was locked (so, and, but)","answer":"but","id":3,"type":"conjunction"},
        {"prompt":"Which conjunction fits best: Sam ate all his lunch __ I was tired (but, so, because)","answer":"because","id":4,"type":"conjunction"},
        {"prompt":"Join with the best conjunction: The dog barked loudly __ I asked for a spare","answer":"so","id":5,"type":"conjunction"},
        {"prompt":"Join with the best conjunction: Mia finished her book __ we were hungry","answer":"because","id":6,"type":"conjunction"},
        {"prompt":"Take a jacket __ it gets cold. (or, but, if)","answer":"if","id":7,"type":"conjunction"},
        {"prompt":"Which conjunction fits best: The dog barked loudly __ we were hungry (but, and, because)","answer":"because","id":8,"type":"conjunction"},
        {"prompt":"Which conjunction fits best: Dad lit the barbecue __ we stayed inside (because, and, so)","answer":"so","id":9,"type":"conjunction"},
        {"prompt":"Wash your hands __ you eat dinner. (or, before, but)","answer":"before","id":10,"type":"conjunction"},
        {"prompt":"Join with the best conjunction: The bell rang __ I went to bed early","answer":"so","id":11,"type":"conjunction"},
        {"prompt":"Brush your teeth __ you go to bed. (before, but, or)","answer":"before","id":12,"type":"conjunction"},
        {"prompt":"Which conjunction fits best: The bell rang __ mum made dinner (so, and, but)","answer":"and","id":13,"type":"conjunction"},
        {"prompt":"Join with the best conjunction: We packed our bags __ mum made dinner","answer":"and","id":14,"type":"conjunction"},
        {"prompt":"Which conjunction fits best: Our team scored a goal __ they sang a song (but, because, and)","answer":"and","id":15,"type":"conjunction"},
        {"prompt":"Join with the best conjunction: I wanted to play outside __ nobody was home","answer":"but","id":16,"type":"conjunction"}
        ]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(conjunctionSpec, g3, seedFrom([3, 'conjunction', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Join with the best conjunction: Sam ate all his lunch __ he felt sick","answer":"because","id":17,"type":"conjunction"},
        {"prompt":"Which conjunction fits best: Our team scored a goal __ we waited for the next one (but, so, and)","answer":"so","id":18,"type":"conjunction"},
        {"prompt":"We always visit Nanna __ Sunday. (when, but, or)","answer":"when","id":19,"type":"conjunction"}
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(conjunctionSpec, getGradeConfig(7), seedFrom([7, 'conjunction', 0]))).toEqual([]);
    });
});

describe('conjunction — Year 6 (same catalogue, independent stream)', () => {
    it('matches the exact page-1 head (grade 6 rolls its own stream)', () => {
        expect(sheet(g6).slice(0, 4)).toEqual([
        {"prompt":"__ it snows, school closes early. (but, if, or)","answer":"if","id":1,"type":"conjunction"},
        {"prompt":"Which conjunction fits best: I wanted to play outside __ we ate together (so, because, but)","answer":"so","id":2,"type":"conjunction"},
        {"prompt":"We always visit Nanna __ Sunday. (or, but, when)","answer":"when","id":3,"type":"conjunction"},
        {"prompt":"__ you finish your homework, you can watch TV. (or, but, if)","answer":"if","id":4,"type":"conjunction"}
        ]);
    });
});
