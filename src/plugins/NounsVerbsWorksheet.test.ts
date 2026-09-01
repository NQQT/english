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
        {"id":1,"type":"grammar","prompt":"Is the word \"draw\" a noun (thing) or a verb (action)?","answer":"verb"},
        {"id":2,"type":"grammar","prompt":"Find the verb: The dad kicks.","answer":"kicks"},
        {"id":3,"type":"grammar","prompt":"Which word is a noun (thing)? (sing, push, button)","answer":"button"},
        {"id":4,"type":"grammar","prompt":"Find the verb: The baby paints.","answer":"paints"},
        {"id":5,"type":"grammar","prompt":"Find the verb: The tiger writes.","answer":"writes"},
        {"id":6,"type":"grammar","prompt":"Which word is a noun (thing)? (dance, monkey, read)","answer":"monkey"},
        {"id":7,"type":"grammar","prompt":"Which word is a noun (thing)? (smile, sleep, chair)","answer":"chair"},
        {"id":8,"type":"grammar","prompt":"Find the verb: The baby cries.","answer":"cries"},
        {"id":9,"type":"grammar","prompt":"Find the verb: The girl draws.","answer":"draws"},
        {"id":10,"type":"grammar","prompt":"Is the word \"cloud\" a noun (thing) or a verb (action)?","answer":"noun"},
        {"id":11,"type":"grammar","prompt":"Which word is a noun (thing)? (eat, drive, river)","answer":"river"},
        {"id":12,"type":"grammar","prompt":"Find the noun: The frog hops.","answer":"frog"},
        {"id":13,"type":"grammar","prompt":"Is the word \"open\" a noun (thing) or a verb (action)?","answer":"verb"},
        {"id":14,"type":"grammar","prompt":"Find the noun: The frog walks.","answer":"frog"},
        {"id":15,"type":"grammar","prompt":"Which word is a verb (action)? (cat, climb, table)","answer":"climb"},
        {"id":16,"type":"grammar","prompt":"Which word is a verb (action)? (clap, bird, grass)","answer":"clap"},
        {"id":17,"type":"grammar","prompt":"Which word is a noun (thing)? (jump, swim, plane)","answer":"plane"},
        {"id":18,"type":"grammar","prompt":"Which word is a verb (action)? (garden, play, train)","answer":"play"},
        {"id":19,"type":"grammar","prompt":"Which word is a noun (thing)? (drink, carry, tree)","answer":"tree"},
        {"id":20,"type":"grammar","prompt":"Which word is a verb (action)? (crawl, fish, school)","answer":"crawl"},
        {"id":21,"type":"grammar","prompt":"Which word is a verb (action)? (dog, run, book)","answer":"run"},
        {"id":22,"type":"grammar","prompt":"Which word is a noun (thing)? (open, pull, tiger)","answer":"tiger"},
        {"id":23,"type":"grammar","prompt":"Which word is a verb (action)? (fly, flower, rocket)","answer":"fly"},
        {"id":24,"type":"grammar","prompt":"Find the verb: The frog washes.","answer":"washes"}
]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(grammarSpec, g2, seedFrom([2, 'grammar', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"grammar","prompt":"Which word is a verb (action)? (kitten, apple, pull)","answer":"pull"},
        {"id":26,"type":"grammar","prompt":"Which word is a verb (action)? (robot, cloud, push)","answer":"push"},
        {"id":27,"type":"grammar","prompt":"Which word is a verb (action)? (house, cry, pencil)","answer":"cry"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(grammarSpec, getGradeConfig(3), seedFrom([3, 'grammar', 0]))).toEqual([]);
    });
});
