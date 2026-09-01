// Unit tests for the PUNCTUATION worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm or sentence pools
// change, these exact assertions fail — which is what we want, so a silent
// change to the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { punctSpec } from './PunctuationWorksheet';

const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(punctSpec, grade, seedFrom([grade.id, punctSpec.id, 0]));
}

describe('punct plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(punctSpec.id).toBe('punct');
        expect(punctSpec.label).toBe('Punctuation');
        expect(punctSpec.icon).toBe('?');
        expect(punctSpec.perPage).toBe(24);
    });

    it('describes its scope (. ? ! marks at every grade)', () => {
        expect(punctSpec.scope(g1)).toBe('. ? ! marks');
        expect(punctSpec.scope(g2)).toBe('. ? ! marks');
    });

    it('is gated by the grade catalogue (Year 1..6 offer it, Year 7 does not)', () => {
        expect(punctSpec.offered(getGradeConfig(0))).toBe(false);
        expect(punctSpec.offered(g1)).toBe(true);
        expect(punctSpec.offered(g2)).toBe(true);
        expect(punctSpec.offered(getGradeConfig(3))).toBe(true);
        expect(punctSpec.offered(getGradeConfig(6))).toBe(true);
        expect(punctSpec.offered(getGradeConfig(7))).toBe(false);
    });
});

describe('punct — Year 1', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"prompt":"Add the right punctuation: I am so tired __","answer":"!","id":1,"type":"punct"},
        {"prompt":"Which end mark fits: Have you seen a cookie __ (. ? !)","answer":"?","id":2,"type":"punct"},
        {"prompt":"Add the right punctuation: Who is a pencil __","answer":"?","id":3,"type":"punct"},
        {"prompt":"Which end mark fits: The teacher is happy __ (. ? !)","answer":".","id":4,"type":"punct"},
        {"prompt":"Which end mark fits: My brother rides a bike __ (. ? !)","answer":".","id":5,"type":"punct"},
        {"prompt":"Add the right punctuation: What a bright light __","answer":"!","id":6,"type":"punct"},
        {"prompt":"Which end mark fits: What is my coat __ (. ? !)","answer":"?","id":7,"type":"punct"},
        {"prompt":"Add the right punctuation: The dog drinks milk __","answer":".","id":8,"type":"punct"},
        {"prompt":"Add the right punctuation: Can I have the ball __","answer":"?","id":9,"type":"punct"},
        {"prompt":"Add the right punctuation: Have you seen a bird __","answer":"?","id":10,"type":"punct"},
        {"prompt":"Which end mark fits: Look at that bird __ (. ? !)","answer":"!","id":11,"type":"punct"},
        {"prompt":"Which end mark fits: What a shiny bell __ (. ? !)","answer":"!","id":12,"type":"punct"},
        {"prompt":"Add the right punctuation: What is my coat __","answer":"?","id":13,"type":"punct"},
        {"prompt":"Which end mark fits: My cousin paints pictures __ (. ? !)","answer":".","id":14,"type":"punct"},
        {"prompt":"Add the right punctuation: Do you have a cookie __","answer":"?","id":15,"type":"punct"},
        {"prompt":"Which end mark fits: The girl likes school __ (. ? !)","answer":".","id":16,"type":"punct"},
        {"prompt":"Add the right punctuation: I love ice cream __","answer":"!","id":17,"type":"punct"},
        {"prompt":"Add the right punctuation: My sister is here __","answer":".","id":18,"type":"punct"},
        {"prompt":"Which end mark fits: We did it __ (. ? !)","answer":"!","id":19,"type":"punct"},
        {"prompt":"Add the right punctuation: The cat reads a book __","answer":".","id":20,"type":"punct"},
        {"prompt":"Which end mark fits: Can you see the ball __ (. ? !)","answer":"?","id":21,"type":"punct"},
        {"prompt":"Which end mark fits: Look at the ponies __ (. ? !)","answer":"!","id":22,"type":"punct"},
        {"prompt":"Add the right punctuation: Look at the stars __","answer":"!","id":23,"type":"punct"},
        {"prompt":"Add the right punctuation: Who is the milk __","answer":"?","id":24,"type":"punct"},
        ]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(punctSpec, g1, seedFrom([1, 'punct', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Which end mark fits: The lion paints pictures __ (. ? !)","answer":".","id":25,"type":"punct"},
        {"prompt":"Which end mark fits: Where is a pencil __ (. ? !)","answer":"?","id":26,"type":"punct"},
        {"prompt":"Add the right punctuation: What a red kite __","answer":"!","id":27,"type":"punct"},
        ]);
    });
});

describe('punct — Year 2', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"prompt":"Add the right punctuation: I love my grandma __","answer":"!","id":1,"type":"punct"},
        {"prompt":"Add the right punctuation: My friend paints pictures __","answer":".","id":2,"type":"punct"},
        {"prompt":"Add the right punctuation: What is a cookie __","answer":"?","id":3,"type":"punct"},
        {"prompt":"Add the right punctuation: The girl runs fast __","answer":".","id":4,"type":"punct"},
        {"prompt":"Add the right punctuation: What a sweet kitten __","answer":"!","id":5,"type":"punct"},
        {"prompt":"Which end mark fits: The girl watches TV __ (. ? !)","answer":".","id":6,"type":"punct"},
        {"prompt":"Which end mark fits: What a fast car __ (. ? !)","answer":"!","id":7,"type":"punct"},
        {"prompt":"Which end mark fits: Where is the cat __ (. ? !)","answer":"?","id":8,"type":"punct"},
        {"prompt":"Add the right punctuation: I love my puppy __","answer":"!","id":9,"type":"punct"},
        {"prompt":"Which end mark fits: The rabbit is hungry __ (. ? !)","answer":".","id":10,"type":"punct"},
        {"prompt":"Add the right punctuation: Can I have my lunch __","answer":"?","id":11,"type":"punct"},
        {"prompt":"Add the right punctuation: The cat sings loudly __","answer":".","id":12,"type":"punct"},
        {"prompt":"Add the right punctuation: The girl rides a bike __","answer":".","id":13,"type":"punct"},
        {"prompt":"Add the right punctuation: The horse watches TV __","answer":".","id":14,"type":"punct"},
        {"prompt":"Add the right punctuation: What is the door __","answer":"?","id":15,"type":"punct"},
        {"prompt":"Add the right punctuation: The baby likes school __","answer":".","id":16,"type":"punct"},
        {"prompt":"Which end mark fits: My friend is happy __ (. ? !)","answer":".","id":17,"type":"punct"},
        {"prompt":"Which end mark fits: What a funny clown __ (. ? !)","answer":"!","id":18,"type":"punct"},
        {"prompt":"Add the right punctuation: Do you have my coat __","answer":"?","id":19,"type":"punct"},
        {"prompt":"Which end mark fits: I love this book __ (. ? !)","answer":"!","id":20,"type":"punct"},
        {"prompt":"Add the right punctuation: Have you seen the kite __","answer":"?","id":21,"type":"punct"},
        {"prompt":"Add the right punctuation: I love my bike __","answer":"!","id":22,"type":"punct"},
        {"prompt":"Add the right punctuation: What a big dog __","answer":"!","id":23,"type":"punct"},
        {"prompt":"Which end mark fits: What a huge fish __ (. ? !)","answer":"!","id":24,"type":"punct"},
        ]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(punctSpec, g2, seedFrom([2, 'punct', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Add the right punctuation: What a lovely song __","answer":"!","id":25,"type":"punct"},
        {"prompt":"Add the right punctuation: The boy drinks milk __","answer":".","id":26,"type":"punct"},
        {"prompt":"Which end mark fits: Can I have a flower __ (. ? !)","answer":"?","id":27,"type":"punct"},
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(punctSpec, getGradeConfig(7), seedFrom([7, 'punct', 0]))).toEqual([]);
    });
});
