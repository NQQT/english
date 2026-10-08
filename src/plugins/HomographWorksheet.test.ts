// Unit tests for the HOMOGRAPHS worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so sheet rows are pinned
// to exact expected values produced from the real generator with the same seed
// the framework uses (seedFrom([grade.id, spec.id, 0])).

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { homographSpec } from './HomographWorksheet';

const g4 = getGradeConfig(4);
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
        expect(homographSpec.scope(g4)).toBe('same spelling, new meaning');
        expect(homographSpec.scope(g6)).toBe('same spelling, new meaning');
    });

    it('is gated by the grade catalogue (Years 4..6 only — staged after Y3 intro grammar)', () => {
        expect(homographSpec.offered(getGradeConfig(0))).toBe(false);
        expect(homographSpec.offered(getGradeConfig(1))).toBe(false);
        expect(homographSpec.offered(getGradeConfig(2))).toBe(false);
        expect(homographSpec.offered(getGradeConfig(3))).toBe(false);
        expect(homographSpec.offered(g4)).toBe(true);
        expect(homographSpec.offered(g6)).toBe(true);
        expect(homographSpec.offered(getGradeConfig(7))).toBe(false);
        // Unoffered grades => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(homographSpec, getGradeConfig(2), seedFrom([2, 'homograph', 0]))).toEqual([]);
    });
});

describe('homograph — Year 4', () => {
    it('matches the exact page-1 head', () => {
        expect(sheet(g4).slice(0, 6)).toEqual([
        {"prompt":"Which word fits both sentences: \"The surfer rode a huge __ .\" and \"Give your friend a friendly __ goodbye.\"? (watch, file, wave)","answer":"wave","id":1,"type":"homograph"},
        {"prompt":"What does \"watch\" mean in this sentence? I checked my __ for the time.","answer":"a thing","id":2,"type":"homograph"},
        {"prompt":"What does \"match\" mean in this sentence? Use a __ to light the candle.","answer":"a thing","id":3,"type":"homograph"},
        {"prompt":"Which word fits both sentences: \"The boat bumped against a __ .\" and \"Guitars, drums and a singer make a __ band.\"? (rock, fly, current)","answer":"rock","id":4,"type":"homograph"},
        {"prompt":"What does \"band\" mean in this sentence? A rubber __ held the letters together.","answer":"a thing","id":5,"type":"homograph"},
        {"prompt":"Which word fits the gap: Electric __ flows through the wire. (current, bat, play)","answer":"current","id":6,"type":"homograph"}
        ]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(homographSpec, g4, seedFrom([4, 'homograph', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Which word fits both sentences: \"The children __ in the park.\" and \"We saw a __ at the theatre.\"? (ring, light, play)","answer":"play","id":19,"type":"homograph"},
        {"prompt":"What does \"palm\" mean in this sentence? The __ of my hand itched.","answer":"a body part","id":20,"type":"homograph"},
        {"prompt":"Which word fits both sentences: \"A __ flopped onto the rocks.\" and \"She pressed a __ on the envelope.\"? (match, seal, wave)","answer":"seal","id":21,"type":"homograph"}
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
