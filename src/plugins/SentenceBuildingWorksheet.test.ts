// Unit tests for the SENTENCE BUILDING worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm, template bank, or caps
// change, these exact assertions fail — which is what we want, so a silent
// change to the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { sentenceSpec } from './SentenceBuildingWorksheet';

const g0 = getGradeConfig(0);
const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(sentenceSpec, grade, seedFrom([grade.id, sentenceSpec.id, 0]));
}

describe('sentence plugin — declarative spec', () => {
    it('declares its sidebar label, glyph, page size and single-column layout', () => {
        expect(sentenceSpec.id).toBe('sentence');
        expect(sentenceSpec.label).toBe('Sentence Building');
        expect(sentenceSpec.icon).toBe('¶');
        expect(sentenceSpec.perPage).toBe(12);
        // Prose sheets print one scrambled line per row, full page width.
        expect(sentenceSpec.singleColumn).toBe(true);
    });

    it('describes its length scope from the grade caps', () => {
        expect(sentenceSpec.scope(g1)).toBe('up to 4 words');
        expect(sentenceSpec.scope(g2)).toBe('up to 5 words');
    });

    it('is gated by the grade catalogue (Year 1..6 offer it, Year 7 does not)', () => {
        expect(sentenceSpec.offered(g0)).toBe(false);
        expect(sentenceSpec.offered(g1)).toBe(true);
        expect(sentenceSpec.offered(g2)).toBe(true);
        expect(sentenceSpec.offered(getGradeConfig(3))).toBe(true);
        expect(sentenceSpec.offered(getGradeConfig(6))).toBe(true);
        expect(sentenceSpec.offered(getGradeConfig(7))).toBe(false);
        // Unoffered type => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(sentenceSpec, g0, seedFrom([0, 'sentence', 0]))).toEqual([]);
    });
});

// Semantic invariant: the printed scramble is a PERMUTATION of the answer's
// word units (the child can always rebuild the pinned answer from the line).
// The word units themselves may contain spaces (e.g. the two-word actor
// "My cousin" or object "a cat"), so the unit boundaries cannot be recovered
// from the answer string alone — instead the comparison folds both sides down
// to a sorted character multiset, which is exactly preserved by any
// permutation of the units.
function checkPermutation(grade: GradeConfig) {
    for (const p of sheet(grade)) {
        const m = p.prompt.match(/\(([^)]+)\)\s*$/);
        expect(m).not.toBeNull();
        const shown = m![1].split(', ').map((s) => s.trim());
        const letters = (s: string) => [...s.replace(/ /g, '')].sort().join('');
        expect(letters(shown.join(''))).toBe(letters(p.answer));
    }
}

describe('sentence — Year 1 (2..4-word lines)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"prompt":"Put the words in the correct order: __, __.  (skips, Sue)","answer":"Sue skips","id":1,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.  (Leo, a cat, draws)","answer":"Leo draws a cat","id":2,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __.  (swims, My cousin)","answer":"My cousin swims","id":3,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.  (Mia, the ball, kicks)","answer":"Mia kicks the ball","id":4,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.  (a card, reads, Sam)","answer":"Sam reads a card","id":5,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.  (a tree, Sam, draws)","answer":"Sam draws a tree","id":6,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.  (finds, a coin, Mia)","answer":"Mia finds a coin","id":7,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.  (washes, the dish, Sue)","answer":"Sue washes the dish","id":8,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __.  (skips, Leo)","answer":"Leo skips","id":9,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __.  (swims, Sue)","answer":"Sue swims","id":10,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __.  (hops, My brother)","answer":"My brother hops","id":11,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __.  (hops, My sister)","answer":"My sister hops","id":12,"type":"sentence"},
        ]);
        checkPermutation(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(sentenceSpec, g1, seedFrom([1, 'sentence', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Put the words in the correct order: __, __, __.  (finds, Zoe, a coin)","answer":"Zoe finds a coin","id":13,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.  (carries, Mia, the chair)","answer":"Mia carries the chair","id":14,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __.  (naps, Leo)","answer":"Leo naps","id":15,"type":"sentence"},
        ]);
    });
});

describe('sentence — Year 2 (adds the 5-word templates)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"prompt":"Put the words in the correct order: __, __, __, __.  (again, a pear, eats, Mia)","answer":"Mia eats a pear again","id":1,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.  (washes, The frog, the shirt)","answer":"The frog washes the shirt","id":2,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __, __.  (a pear, eats, loudly, Sue)","answer":"Sue eats a pear loudly","id":3,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __.  (jumps, Ben)","answer":"Ben jumps","id":4,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.  (washes, the cup, Zoe)","answer":"Zoe washes the cup","id":5,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.  (Mia, the moon, sees)","answer":"Mia sees the moon","id":6,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __.  (skips, Mia)","answer":"Mia skips","id":7,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.  (The baby, a coin, finds)","answer":"The baby finds a coin","id":8,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.  (Mia, the ball, kicks)","answer":"Mia kicks the ball","id":9,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.  (the key, finds, The baby)","answer":"The baby finds the key","id":10,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __, __.  (Leo, kicks, today, a stone)","answer":"Leo kicks a stone today","id":11,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __.  (swims, Ben)","answer":"Ben swims","id":12,"type":"sentence"},
        ]);
        checkPermutation(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(sentenceSpec, g2, seedFrom([2, 'sentence', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Put the words in the correct order: __, __, __, __.  (again, Sue, a picture, paints)","answer":"Sue paints a picture again","id":13,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __.  (skips, My cousin)","answer":"My cousin skips","id":14,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __.  (claps, Leo)","answer":"Leo claps","id":15,"type":"sentence"},
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(sentenceSpec, getGradeConfig(7), seedFrom([7, 'sentence', 0]))).toEqual([]);
    });
});
