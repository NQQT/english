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

    it('is gated by the grade catalogue (Year 1 and Year 2 only)', () => {
        expect(punctSpec.offered(getGradeConfig(0))).toBe(false);
        expect(punctSpec.offered(g1)).toBe(true);
        expect(punctSpec.offered(g2)).toBe(true);
        expect(punctSpec.offered(getGradeConfig(3))).toBe(false);
    });
});

describe('punct — Year 1', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"id":1,"type":"punct","prompt":"Add the right punctuation: What a great idea __","answer":"!"},
        {"id":2,"type":"punct","prompt":"Add the right punctuation: I love this book __","answer":"!"},
        {"id":3,"type":"punct","prompt":"Add the right punctuation: My friend is here __","answer":"."},
        {"id":4,"type":"punct","prompt":"Add the right punctuation: Do you have the cat __","answer":"?"},
        {"id":5,"type":"punct","prompt":"Add the right punctuation: The cat likes school __","answer":"."},
        {"id":6,"type":"punct","prompt":"Add the right punctuation: The cat is sleeping __","answer":"."},
        {"id":7,"type":"punct","prompt":"Add the right punctuation: Can you see the milk __","answer":"?"},
        {"id":8,"type":"punct","prompt":"Add the right punctuation: I am so hungry __","answer":"!"},
        {"id":9,"type":"punct","prompt":"Add the right punctuation: The teacher found the ball __","answer":"."},
        {"id":10,"type":"punct","prompt":"Add the right punctuation: The bird is sleeping __","answer":"."},
        {"id":11,"type":"punct","prompt":"Add the right punctuation: Can you see your book __","answer":"?"},
        {"id":12,"type":"punct","prompt":"Add the right punctuation: Look at that bird __","answer":"!"},
        {"id":13,"type":"punct","prompt":"Add the right punctuation: Do you have your book __","answer":"?"},
        {"id":14,"type":"punct","prompt":"Add the right punctuation: Do you have a pencil __","answer":"?"},
        {"id":15,"type":"punct","prompt":"Add the right punctuation: The boy likes school __","answer":"."},
        {"id":16,"type":"punct","prompt":"Add the right punctuation: Who is a bird __","answer":"?"},
        {"id":17,"type":"punct","prompt":"Add the right punctuation: The bird sings loudly __","answer":"."},
        {"id":18,"type":"punct","prompt":"Add the right punctuation: Do you have my hat __","answer":"?"},
        {"id":19,"type":"punct","prompt":"Add the right punctuation: We won the game __","answer":"!"},
        {"id":20,"type":"punct","prompt":"Add the right punctuation: Can you see the dog __","answer":"?"},
        {"id":21,"type":"punct","prompt":"Add the right punctuation: My dad is hungry __","answer":"."},
        {"id":22,"type":"punct","prompt":"Add the right punctuation: Who is your book __","answer":"?"},
        {"id":23,"type":"punct","prompt":"Add the right punctuation: The dog is happy __","answer":"."},
        {"id":24,"type":"punct","prompt":"Add the right punctuation: I love ice cream __","answer":"!"}
]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(punctSpec, g1, seedFrom([1, 'punct', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"punct","prompt":"Add the right punctuation: The dog is here __","answer":"."},
        {"id":26,"type":"punct","prompt":"Add the right punctuation: The boy found the ball __","answer":"."},
        {"id":27,"type":"punct","prompt":"Add the right punctuation: We did it __","answer":"!"}
]);
    });
});

describe('punct — Year 2', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"punct","prompt":"Add the right punctuation: Look at the moon __","answer":"!"},
        {"id":2,"type":"punct","prompt":"Add the right punctuation: Look at that bird __","answer":"!"},
        {"id":3,"type":"punct","prompt":"Add the right punctuation: Who is your book __","answer":"?"},
        {"id":4,"type":"punct","prompt":"Add the right punctuation: Can you see the ball __","answer":"?"},
        {"id":5,"type":"punct","prompt":"Add the right punctuation: The bird is hungry __","answer":"."},
        {"id":6,"type":"punct","prompt":"Add the right punctuation: Can you see the milk __","answer":"?"},
        {"id":7,"type":"punct","prompt":"Add the right punctuation: I love this book __","answer":"!"},
        {"id":8,"type":"punct","prompt":"Add the right punctuation: The baby is sleeping __","answer":"."},
        {"id":9,"type":"punct","prompt":"Add the right punctuation: The cat is here __","answer":"."},
        {"id":10,"type":"punct","prompt":"Add the right punctuation: What a sunny day __","answer":"!"},
        {"id":11,"type":"punct","prompt":"Add the right punctuation: The baby found the ball __","answer":"."},
        {"id":12,"type":"punct","prompt":"Add the right punctuation: We did it __","answer":"!"},
        {"id":13,"type":"punct","prompt":"Add the right punctuation: The teacher is sleeping __","answer":"."},
        {"id":14,"type":"punct","prompt":"Add the right punctuation: The cat found the ball __","answer":"."},
        {"id":15,"type":"punct","prompt":"Add the right punctuation: Do you have the cat __","answer":"?"},
        {"id":16,"type":"punct","prompt":"Add the right punctuation: Do you have the milk __","answer":"?"},
        {"id":17,"type":"punct","prompt":"Add the right punctuation: The dog is happy __","answer":"."},
        {"id":18,"type":"punct","prompt":"Add the right punctuation: My dad is sleeping __","answer":"."},
        {"id":19,"type":"punct","prompt":"Add the right punctuation: What a big dog __","answer":"!"},
        {"id":20,"type":"punct","prompt":"Add the right punctuation: Who is the ball __","answer":"?"},
        {"id":21,"type":"punct","prompt":"Add the right punctuation: Do you have a bird __","answer":"?"},
        {"id":22,"type":"punct","prompt":"Add the right punctuation: Where is my hat __","answer":"?"},
        {"id":23,"type":"punct","prompt":"Add the right punctuation: Do you have your book __","answer":"?"},
        {"id":24,"type":"punct","prompt":"Add the right punctuation: The bird runs fast __","answer":"."}
]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(punctSpec, g2, seedFrom([2, 'punct', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"punct","prompt":"Add the right punctuation: Do you have the ball __","answer":"?"},
        {"id":26,"type":"punct","prompt":"Add the right punctuation: Where is a bird __","answer":"?"},
        {"id":27,"type":"punct","prompt":"Add the right punctuation: Can you see my hat __","answer":"?"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(punctSpec, getGradeConfig(3), seedFrom([3, 'punct', 0]))).toEqual([]);
    });
});
