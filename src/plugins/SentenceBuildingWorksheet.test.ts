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
//
// TWO WORD-BANK SHAPES (T4): legacy rows print the scrambled bank INSIDE THE
// PROMPT (parenthesised tail); early-band rows (Y1–3, see
// SentenceBuildingWorksheet.ts isEarlyCueBand branch) moved the bank into the
// `tileWords` metadata so it prints as word tiles, and their prompt no longer
// carries the parenthesised list. Both shapes are checked here; the invariant
// (bank is a permutation of the answer) is identical for either.
function checkPermutation(grade: GradeConfig) {
    for (const p of sheet(grade)) {
        let shown: string[];
        if (Array.isArray(p.tileWords)) {
            // Tile shape: the bank lives in the metadata (not in the prompt).
            shown = p.tileWords;
        } else {
            // Legacy shape: the bank is the prompt's parenthesised tail.
            const m = p.prompt.match(/\(([^)]+)\)\s*$/);
            expect(m).not.toBeNull();
            shown = m![1].split(', ').map((s) => s.trim());
        }
        const letters = (s: string) => [...s.replace(/ /g, '')].sort().join('');
        expect(letters(shown.join(''))).toBe(letters(p.answer));
    }
}

describe('sentence — Year 1 (2..4-word lines)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"prompt":"Put the words in the correct order: __, __.","answer":"Sue skips","tileBlanks":"word","tileWords":["skips","Sue"],"id":1,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.","answer":"Leo draws a cat","tileBlanks":"word","tileWords":["Leo","a cat","draws"],"id":2,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __.","answer":"My cousin swims","tileBlanks":"word","tileWords":["swims","My cousin"],"id":3,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.","answer":"Mia kicks the ball","tileBlanks":"word","tileWords":["Mia","the ball","kicks"],"id":4,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.","answer":"Sam reads a card","tileBlanks":"word","tileWords":["a card","reads","Sam"],"id":5,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.","answer":"Sam draws a tree","tileBlanks":"word","tileWords":["a tree","Sam","draws"],"id":6,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.","answer":"Mia finds a coin","tileBlanks":"word","tileWords":["finds","a coin","Mia"],"id":7,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.","answer":"Sue washes the dish","tileBlanks":"word","tileWords":["washes","the dish","Sue"],"id":8,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __.","answer":"Leo skips","tileBlanks":"word","tileWords":["skips","Leo"],"id":9,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __.","answer":"Sue swims","tileBlanks":"word","tileWords":["swims","Sue"],"id":10,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __.","answer":"My brother hops","tileBlanks":"word","tileWords":["hops","My brother"],"id":11,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __.","answer":"My sister hops","tileBlanks":"word","tileWords":["hops","My sister"],"id":12,"type":"sentence"}
        ]);
        checkPermutation(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(sentenceSpec, g1, seedFrom([1, 'sentence', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Put the words in the correct order: __, __, __.","answer":"Zoe finds a coin","tileBlanks":"word","tileWords":["finds","Zoe","a coin"],"id":13,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.","answer":"Mia carries the chair","tileBlanks":"word","tileWords":["carries","Mia","the chair"],"id":14,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __.","answer":"Leo naps","tileBlanks":"word","tileWords":["naps","Leo"],"id":15,"type":"sentence"}
        ]);
    });
});

describe('sentence — Year 2 (adds the 5-word templates)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"prompt":"Put the words in the correct order: __, __, __, __.","answer":"Mia eats a pear again","tileBlanks":"word","tileWords":["again","a pear","eats","Mia"],"id":1,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.","answer":"The frog washes the shirt","tileBlanks":"word","tileWords":["washes","The frog","the shirt"],"id":2,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __, __.","answer":"Sue eats a pear loudly","tileBlanks":"word","tileWords":["a pear","eats","loudly","Sue"],"id":3,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __.","answer":"Ben jumps","tileBlanks":"word","tileWords":["jumps","Ben"],"id":4,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.","answer":"Zoe washes the cup","tileBlanks":"word","tileWords":["washes","the cup","Zoe"],"id":5,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.","answer":"Mia sees the moon","tileBlanks":"word","tileWords":["Mia","the moon","sees"],"id":6,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __.","answer":"Mia skips","tileBlanks":"word","tileWords":["skips","Mia"],"id":7,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.","answer":"The baby finds a coin","tileBlanks":"word","tileWords":["The baby","a coin","finds"],"id":8,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.","answer":"Mia kicks the ball","tileBlanks":"word","tileWords":["Mia","the ball","kicks"],"id":9,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __.","answer":"The baby finds the key","tileBlanks":"word","tileWords":["the key","finds","The baby"],"id":10,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __, __, __.","answer":"Leo kicks a stone today","tileBlanks":"word","tileWords":["Leo","kicks","today","a stone"],"id":11,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __.","answer":"Ben swims","tileBlanks":"word","tileWords":["swims","Ben"],"id":12,"type":"sentence"}
        ]);
        checkPermutation(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(sentenceSpec, g2, seedFrom([2, 'sentence', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Put the words in the correct order: __, __, __, __.","answer":"Sue paints a picture again","tileBlanks":"word","tileWords":["again","Sue","a picture","paints"],"id":13,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __.","answer":"My cousin skips","tileBlanks":"word","tileWords":["skips","My cousin"],"id":14,"type":"sentence"},
        {"prompt":"Put the words in the correct order: __, __.","answer":"Leo claps","tileBlanks":"word","tileWords":["claps","Leo"],"id":15,"type":"sentence"}
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(sentenceSpec, getGradeConfig(7), seedFrom([7, 'sentence', 0]))).toEqual([]);
    });
});
