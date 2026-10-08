// Unit tests for the FIGURATIVE LANGUAGE worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so sheet rows are pinned
// to exact expected values produced from the real generator with the same seed
// the framework uses (seedFrom([grade.id, spec.id, 0])).

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { figurativeSpec } from './FigurativeWorksheet';

const g4 = getGradeConfig(4);
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
        expect(figurativeSpec.scope(g4)).toBe('simile, metaphor, personification, alliteration');
        expect(figurativeSpec.scope(g6)).toBe('simile, metaphor, personification, alliteration');
    });

    it('is gated by the grade catalogue (Years 4..6 only — staged after Y3 intro grammar)', () => {
        expect(figurativeSpec.offered(getGradeConfig(0))).toBe(false);
        expect(figurativeSpec.offered(getGradeConfig(1))).toBe(false);
        expect(figurativeSpec.offered(getGradeConfig(2))).toBe(false);
        expect(figurativeSpec.offered(getGradeConfig(3))).toBe(false);
        expect(figurativeSpec.offered(g4)).toBe(true);
        expect(figurativeSpec.offered(g6)).toBe(true);
        expect(figurativeSpec.offered(getGradeConfig(7))).toBe(false);
        // Unoffered grades => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(figurativeSpec, getGradeConfig(2), seedFrom([2, 'figurative', 0]))).toEqual([]);
    });
});

describe('figurative — Year 4', () => {
    it('matches the exact page-1 head', () => {
        expect(sheet(g4).slice(0, 8)).toEqual([
        {"prompt":"Which example is a metaphor? (bright blue butterflies / my room is a disaster zone / the waves clapped on the shore)","answer":"my room is a disaster zone","id":1,"type":"figurative"},
        {"prompt":"Name the technique: \"six sizzling sausages\"","answer":"alliteration","id":2,"type":"figurative"},
        {"prompt":"Which example is a metaphor? (the stars winked above / my room is a disaster zone / sings like an angel)","answer":"my room is a disaster zone","id":3,"type":"figurative"},
        {"prompt":"Which example is a personification? (six sizzling sausages / bright blue butterflies / the wind whispered through the trees)","answer":"the wind whispered through the trees","id":4,"type":"figurative"},
        {"prompt":"Which technique is used: \"her smile is sunshine\"? (metaphor, personification, alliteration, simile)","answer":"metaphor","id":5,"type":"figurative"},
        {"prompt":"Name the technique: \"sings like an angel\"","answer":"simile","id":6,"type":"figurative"},
        {"prompt":"Name the technique: \"eats like a horse\"","answer":"simile","id":7,"type":"figurative"},
        {"prompt":"Which example is a personification? (time is a thief / the stars winked above / the big brown bear)","answer":"the stars winked above","id":8,"type":"figurative"}
        ]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(figurativeSpec, g4, seedFrom([4, 'figurative', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Name the technique: \"as busy as a bee\"","answer":"simile","id":19,"type":"figurative"},
        {"prompt":"Which example is a simile? (the classroom was a zoo / the big brown bear / as brave as a lion)","answer":"as brave as a lion","id":20,"type":"figurative"},
        {"prompt":"Which example is a simile? (as light as a feather / the sun smiled down on us / wild and windy weather)","answer":"as light as a feather","id":21,"type":"figurative"}
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
