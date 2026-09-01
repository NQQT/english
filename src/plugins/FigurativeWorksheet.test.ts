// Unit tests for the FIGURATIVE LANGUAGE worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so sheet rows are pinned
// to exact expected values produced from the real generator with the same seed
// the framework uses (seedFrom([grade.id, spec.id, 0])).

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { figurativeSpec } from './FigurativeWorksheet';

const g3 = getGradeConfig(3);
const g6 = getGradeConfig(6);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(figurativeSpec, grade, seedFrom([grade.id, figurativeSpec.id, 0]));
}

describe('figurative plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(figurativeSpec.id).toBe('figurative');
        expect(figurativeSpec.label).toBe('Figurative Language');
        expect(figurativeSpec.icon).toBe('≋');
        expect(figurativeSpec.perPage).toBe(18);
    });

    it('describes its scope (the four taught techniques)', () => {
        expect(figurativeSpec.scope(g3)).toBe('simile, metaphor, personification, alliteration');
        expect(figurativeSpec.scope(g6)).toBe('simile, metaphor, personification, alliteration');
    });

    it('is gated by the grade catalogue (Years 3..6 only)', () => {
        expect(figurativeSpec.offered(getGradeConfig(0))).toBe(false);
        expect(figurativeSpec.offered(getGradeConfig(1))).toBe(false);
        expect(figurativeSpec.offered(getGradeConfig(2))).toBe(false);
        expect(figurativeSpec.offered(g3)).toBe(true);
        expect(figurativeSpec.offered(g6)).toBe(true);
        expect(figurativeSpec.offered(getGradeConfig(7))).toBe(false);
        // Unoffered grades => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(figurativeSpec, getGradeConfig(2), seedFrom([2, 'figurative', 0]))).toEqual([]);
    });
});

describe('figurative — Year 3', () => {
    it('matches the exact page-1 head', () => {
        expect(sheet(g3).slice(0, 8)).toEqual([
        {"prompt":"Which technique is used: \"the slippery snake slid silently\"? (alliteration, metaphor, personification, simile)","answer":"alliteration","id":1,"type":"figurative"},
        {"prompt":"Name the technique: \"the classroom was a zoo\"","answer":"metaphor","id":2,"type":"figurative"},
        {"prompt":"Name the technique: \"six sizzling sausages\"","answer":"alliteration","id":3,"type":"figurative"},
        {"prompt":"Which technique is used: \"the big brown bear\"? (personification, alliteration, metaphor, simile)","answer":"alliteration","id":4,"type":"figurative"},
        {"prompt":"Which technique is used: \"as brave as a lion\"? (metaphor, alliteration, simile, personification)","answer":"simile","id":5,"type":"figurative"},
        {"prompt":"Name the technique: \"the stars winked above\"","answer":"personification","id":6,"type":"figurative"},
        {"prompt":"Which example is a alliteration? (as cool as a cucumber / the waves clapped on the shore / six sizzling sausages)","answer":"six sizzling sausages","id":7,"type":"figurative"},
        {"prompt":"Name the technique: \"Peter Piper picked a peck\"","answer":"alliteration","id":8,"type":"figurative"}
        ]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(figurativeSpec, g3, seedFrom([3, 'figurative', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Name the technique: \"as cool as a cucumber\"","answer":"simile","id":19,"type":"figurative"},
        {"prompt":"Which example is a personification? (the wind whispered through the trees / as light as a feather / the classroom was a zoo)","answer":"the wind whispered through the trees","id":20,"type":"figurative"},
        {"prompt":"Which technique is used: \"bright blue butterflies\"? (personification, metaphor, alliteration, simile)","answer":"alliteration","id":21,"type":"figurative"}
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(figurativeSpec, getGradeConfig(7), seedFrom([7, 'figurative', 0]))).toEqual([]);
    });
});

describe('figurative — Year 6', () => {
    it('matches the exact page-1 head (grade 6 rolls its own stream)', () => {
        expect(sheet(g6).slice(0, 3)).toEqual([
        {"prompt":"Which technique is used: \"the big brown bear\"? (personification, simile, metaphor, alliteration)","answer":"alliteration","id":1,"type":"figurative"},
        {"prompt":"Which technique is used: \"as brave as a lion\"? (personification, metaphor, simile, alliteration)","answer":"simile","id":2,"type":"figurative"},
        {"prompt":"Which example is a metaphor? (as busy as a bee / the stars winked above / the classroom was a zoo)","answer":"the classroom was a zoo","id":3,"type":"figurative"}
        ]);
    });
});
