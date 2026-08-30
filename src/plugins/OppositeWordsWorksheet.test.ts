// Unit tests for the OPPOSITE WORDS worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm, pair bank, or caps
// change, these exact assertions fail — which is what we want, so a silent
// change to the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { oppositeSpec } from './OppositeWordsWorksheet';

const g0 = getGradeConfig(0);
const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(oppositeSpec, grade, seedFrom([grade.id, oppositeSpec.id, 0]));
}

describe('opposite plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(oppositeSpec.id).toBe('opposite');
        expect(oppositeSpec.label).toBe('Opposite Words');
        expect(oppositeSpec.icon).toBe('⇄');
        expect(oppositeSpec.perPage).toBe(24);
    });

    it('describes its pair scope from the grade caps (starter vs common)', () => {
        expect(oppositeSpec.scope(g0)).toBe('starter opposites');
        expect(oppositeSpec.scope(g1)).toBe('common opposites');
        expect(oppositeSpec.scope(g2)).toBe('common opposites');
    });

    it('is gated by the grade catalogue (Year 1 and Year 2 only)', () => {
        expect(oppositeSpec.offered(g0)).toBe(false);
        expect(oppositeSpec.offered(g1)).toBe(true);
        expect(oppositeSpec.offered(g2)).toBe(true);
        expect(oppositeSpec.offered(getGradeConfig(3))).toBe(false);
        // Unoffered type => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(oppositeSpec, g0, seedFrom([0, 'opposite', 0]))).toEqual([]);
    });
});

describe('opposite — Year 1 (tier-2 common word set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"id":1,"type":"opposite","prompt":"What is the opposite of \"in\"?","answer":"out"},
        {"id":2,"type":"opposite","prompt":"What is the opposite of \"cold\"?","answer":"hot"},
        {"id":3,"type":"opposite","prompt":"What is the opposite of \"light\"?","answer":"heavy"},
        {"id":4,"type":"opposite","prompt":"What is the opposite of \"down\"?","answer":"up"},
        {"id":5,"type":"opposite","prompt":"What is the opposite of \"light\"?","answer":"heavy"},
        {"id":6,"type":"opposite","prompt":"What is the opposite of \"short\"?","answer":"long"},
        {"id":7,"type":"opposite","prompt":"What is the opposite of \"heavy\"?","answer":"light"},
        {"id":8,"type":"opposite","prompt":"What is the opposite of \"early\"?","answer":"late"},
        {"id":9,"type":"opposite","prompt":"What is the opposite of \"fast\"?","answer":"slow"},
        {"id":10,"type":"opposite","prompt":"What is the opposite of \"short\"?","answer":"long"},
        {"id":11,"type":"opposite","prompt":"What is the opposite of \"big\"?","answer":"small"},
        {"id":12,"type":"opposite","prompt":"What is the opposite of \"short\"?","answer":"long"},
        {"id":13,"type":"opposite","prompt":"What is the opposite of \"easy\"?","answer":"hard"},
        {"id":14,"type":"opposite","prompt":"What is the opposite of \"easy\"?","answer":"hard"},
        {"id":15,"type":"opposite","prompt":"What is the opposite of \"heavy\"?","answer":"light"},
        {"id":16,"type":"opposite","prompt":"What is the opposite of \"out\"?","answer":"in"},
        {"id":17,"type":"opposite","prompt":"What is the opposite of \"late\"?","answer":"early"},
        {"id":18,"type":"opposite","prompt":"What is the opposite of \"heavy\"?","answer":"light"},
        {"id":19,"type":"opposite","prompt":"What is the opposite of \"sad\"?","answer":"happy"},
        {"id":20,"type":"opposite","prompt":"What is the opposite of \"old\"?","answer":"new"},
        {"id":21,"type":"opposite","prompt":"What is the opposite of \"early\"?","answer":"late"},
        {"id":22,"type":"opposite","prompt":"What is the opposite of \"hard\"?","answer":"easy"},
        {"id":23,"type":"opposite","prompt":"What is the opposite of \"big\"?","answer":"small"},
        {"id":24,"type":"opposite","prompt":"What is the opposite of \"down\"?","answer":"up"}
]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(oppositeSpec, g1, seedFrom([1, 'opposite', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"opposite","prompt":"What is the opposite of \"down\"?","answer":"up"},
        {"id":26,"type":"opposite","prompt":"What is the opposite of \"late\"?","answer":"early"},
        {"id":27,"type":"opposite","prompt":"What is the opposite of \"small\"?","answer":"big"}
]);
    });
});

describe('opposite — Year 2 (tricky set unused: same pair bank)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"opposite","prompt":"What is the opposite of \"short\"?","answer":"long"},
        {"id":2,"type":"opposite","prompt":"What is the opposite of \"easy\"?","answer":"hard"},
        {"id":3,"type":"opposite","prompt":"What is the opposite of \"small\"?","answer":"big"},
        {"id":4,"type":"opposite","prompt":"What is the opposite of \"hard\"?","answer":"easy"},
        {"id":5,"type":"opposite","prompt":"What is the opposite of \"light\"?","answer":"heavy"},
        {"id":6,"type":"opposite","prompt":"What is the opposite of \"down\"?","answer":"up"},
        {"id":7,"type":"opposite","prompt":"What is the opposite of \"out\"?","answer":"in"},
        {"id":8,"type":"opposite","prompt":"What is the opposite of \"in\"?","answer":"out"},
        {"id":9,"type":"opposite","prompt":"What is the opposite of \"short\"?","answer":"long"},
        {"id":10,"type":"opposite","prompt":"What is the opposite of \"down\"?","answer":"up"},
        {"id":11,"type":"opposite","prompt":"What is the opposite of \"sad\"?","answer":"happy"},
        {"id":12,"type":"opposite","prompt":"What is the opposite of \"open\"?","answer":"shut"},
        {"id":13,"type":"opposite","prompt":"What is the opposite of \"hard\"?","answer":"easy"},
        {"id":14,"type":"opposite","prompt":"What is the opposite of \"hot\"?","answer":"cold"},
        {"id":15,"type":"opposite","prompt":"What is the opposite of \"small\"?","answer":"big"},
        {"id":16,"type":"opposite","prompt":"What is the opposite of \"long\"?","answer":"short"},
        {"id":17,"type":"opposite","prompt":"What is the opposite of \"hot\"?","answer":"cold"},
        {"id":18,"type":"opposite","prompt":"What is the opposite of \"shut\"?","answer":"open"},
        {"id":19,"type":"opposite","prompt":"What is the opposite of \"light\"?","answer":"heavy"},
        {"id":20,"type":"opposite","prompt":"What is the opposite of \"light\"?","answer":"heavy"},
        {"id":21,"type":"opposite","prompt":"What is the opposite of \"old\"?","answer":"new"},
        {"id":22,"type":"opposite","prompt":"What is the opposite of \"light\"?","answer":"heavy"},
        {"id":23,"type":"opposite","prompt":"What is the opposite of \"hot\"?","answer":"cold"},
        {"id":24,"type":"opposite","prompt":"What is the opposite of \"hard\"?","answer":"easy"}
]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(oppositeSpec, g2, seedFrom([2, 'opposite', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"opposite","prompt":"What is the opposite of \"shut\"?","answer":"open"},
        {"id":26,"type":"opposite","prompt":"What is the opposite of \"open\"?","answer":"shut"},
        {"id":27,"type":"opposite","prompt":"What is the opposite of \"early\"?","answer":"late"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(oppositeSpec, getGradeConfig(3), seedFrom([3, 'opposite', 0]))).toEqual([]);
    });
});
