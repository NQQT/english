// Unit tests for the HOMOGRAPHS worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so sheet rows are pinned
// to exact expected values produced from the real generator with the same seed
// the framework uses (seedFrom([grade.id, spec.id, 0])).

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { homographSpec } from './HomographWorksheet';

const g3 = getGradeConfig(3);
const g6 = getGradeConfig(6);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(homographSpec, grade, seedFrom([grade.id, homographSpec.id, 0]));
}

describe('homograph plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(homographSpec.id).toBe('homograph');
        expect(homographSpec.label).toBe('Homographs');
        expect(homographSpec.icon).toBe('⚭');
        expect(homographSpec.perPage).toBe(18);
    });

    it('describes its scope (same spelling, new meaning)', () => {
        expect(homographSpec.scope(g3)).toBe('same spelling, new meaning');
        expect(homographSpec.scope(g6)).toBe('same spelling, new meaning');
    });

    it('is gated by the grade catalogue (Years 3..6 only)', () => {
        expect(homographSpec.offered(getGradeConfig(0))).toBe(false);
        expect(homographSpec.offered(getGradeConfig(1))).toBe(false);
        expect(homographSpec.offered(getGradeConfig(2))).toBe(false);
        expect(homographSpec.offered(g3)).toBe(true);
        expect(homographSpec.offered(g6)).toBe(true);
        expect(homographSpec.offered(getGradeConfig(7))).toBe(false);
        // Unoffered grades => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(homographSpec, getGradeConfig(2), seedFrom([2, 'homograph', 0]))).toEqual([]);
    });
});

describe('homograph — Year 3', () => {
    it('matches the exact page-1 head', () => {
        expect(sheet(g3).slice(0, 6)).toEqual([
        {"prompt":"Which word fits the gap: A __ buzzed around the kitchen. (rock, light, fly)","answer":"fly","id":1,"type":"homograph"},
        {"prompt":"Which word fits the gap: The dog gave a loud __ . (current, bark, ring)","answer":"bark","id":2,"type":"homograph"},
        {"prompt":"What does \"bat\" mean in this sentence? A __ flew out of the cave at dusk.","answer":"an animal","id":3,"type":"homograph"},
        {"prompt":"Which word fits the gap: A rubber __ held the letters together. (rock, band, letter)","answer":"band","id":4,"type":"homograph"},
        {"prompt":"Which word fits the gap: We saw a __ at the theatre. (bark, play, seal)","answer":"play","id":5,"type":"homograph"},
        {"prompt":"What does \"file\" mean in this sentence? The carpenter smoothed the edge with a __ .","answer":"a tool","id":6,"type":"homograph"}
        ]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(homographSpec, g3, seedFrom([3, 'homograph', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Which word fits both sentences: \"I posted a __ to my cousin.\" and \"Every __ of the alphabet has a shape.\"? (palm, letter, light)","answer":"letter","id":19,"type":"homograph"},
        {"prompt":"Which word fits both sentences: \"The room felt dark until she turned on the __ .\" and \"This bag is very __ to carry.\"? (light, crane, palm)","answer":"light","id":20,"type":"homograph"},
        {"prompt":"Which word fits the gap: Guitars, drums and a singer make a __ band. (match, play, rock)","answer":"rock","id":21,"type":"homograph"}
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(homographSpec, getGradeConfig(7), seedFrom([7, 'homograph', 0]))).toEqual([]);
    });
});

describe('homograph — Year 6', () => {
    it('matches the exact page-1 head (grade 6 rolls its own stream)', () => {
        expect(sheet(g6).slice(0, 3)).toEqual([
        {"prompt":"Which word fits the gap: The boat bumped against a __ . (rock, file, light)","answer":"rock","id":1,"type":"homograph"},
        {"prompt":"What does \"bat\" mean in this sentence? Pick up the __ and hit the ball.","answer":"a thing","id":2,"type":"homograph"},
        {"prompt":"Which word fits both sentences: \"A rubber __ held the letters together.\" and \"The school __ played at assembly.\"? (wave, bat, band)","answer":"band","id":3,"type":"homograph"}
        ]);
    });
});
