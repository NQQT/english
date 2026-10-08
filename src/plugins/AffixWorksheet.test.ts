// Unit tests for the PREFIXES & SUFFIXES (affix) worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE page-1 sheet
// (all prompts + answers) is pinned to exact expected values produced from the
// real generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). Pins cover page 1 only; generator
// invariants (MC answer in options, no answer printed in compose prompts,
// open-ended answers marked, 100-page capacity) cover the whole stream.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, createRng, type GradeConfig } from '../framework';
import { affixSpec } from './AffixWorksheet';

const g3 = getGradeConfig(3);
const g6 = getGradeConfig(6);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(affixSpec, grade, seedFrom([grade.id, affixSpec.id, 0]));
}

// Extract the trailing "(a, b, c)" option list from an MC prompt; null when
// the prompt is not multiple-choice.
function optionsOf(prompt: string): string[] | null {
    const m = prompt.match(/\(([^)]+)\)\s*$/);
    if (!m) return null;
    if (m[1].includes(' / ')) return m[1].split(' / ');
    if (m[1].includes(', ')) return m[1].split(', ');
    return null;
}

// A compose prompt must not print the answer. Single-word answers use
// word-boundary matching; sentence answers use plain includes.
function leaks(prompt: string, answer: string): boolean {
    if (answer.includes(' ')) return prompt.includes(answer);
    const escaped = answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(prompt);
}

describe('affix plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(affixSpec.id).toBe('affix');
        expect(affixSpec.label).toBe('Prefixes & Suffixes');
        expect(affixSpec.icon).toBe('±');
        // T4C: 8 roomy rows per page (was 18).
        expect(affixSpec.perPage).toBe(8);
    });

    it('describes its scope (word building blocks)', () => {
        expect(affixSpec.scope(g3)).toBe('word building blocks');
        expect(affixSpec.scope(g6)).toBe('word building blocks');
    });

    it('is gated by the grade catalogue (Years 3..6 only)', () => {
        expect(affixSpec.offered(getGradeConfig(0))).toBe(false);
        expect(affixSpec.offered(getGradeConfig(1))).toBe(false);
        expect(affixSpec.offered(getGradeConfig(2))).toBe(false);
        expect(affixSpec.offered(g3)).toBe(true);
        expect(affixSpec.offered(g6)).toBe(true);
        expect(affixSpec.offered(getGradeConfig(7))).toBe(false);
        // Unoffered grades => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(affixSpec, getGradeConfig(2), seedFrom([2, 'affix', 0]))).toEqual([]);
    });
});

describe('affix — Year 3', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g3)).toEqual([
            {"prompt":"Split \"rewrite\" into its prefix and base word.","answer":"re + write","id":1,"type":"affix"},
            {"prompt":"What does the suffix \"er\" do? (make/become, full of, person who)","answer":"person who","id":2,"type":"affix"},
            {"prompt":"What does the prefix \"uni\" do? (one, before, not)","answer":"one","id":3,"type":"affix"},
            {"prompt":"Split \"helpless\" into its suffix and base word.","answer":"help + less","id":4,"type":"affix"},
            {"prompt":"Write a word that has the suffix \"ing\".","answer":"Example: running (any real word with the suffix \"ing\" is correct)","id":5,"type":"affix"},
            {"prompt":"Write a word that has the suffix \"less\".","answer":"Example: helpless (any real word with the suffix \"less\" is correct)","id":6,"type":"affix"},
            {"prompt":"Add the suffix \"ness\" to \"kind\".","answer":"kindness","id":7,"type":"affix"},
            {"prompt":"Add the prefix \"un\" to \"fair\".","answer":"unfair","id":8,"type":"affix"}
        ]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(affixSpec, g3, seedFrom([3, 'affix', 0]), 2).pages[1].slice(0, 3)).toEqual([
            {"prompt":"Which word has the prefix \"sub\"? (submarine, colourful, comfortable)","answer":"submarine","id":9,"type":"affix"},
            {"prompt":"What does the suffix \"ise\" mean in \"apologise\"?","answer":"make/become","id":10,"type":"affix"},
            {"prompt":"What does the suffix \"ise\" do? (full of, doing now, make/become)","answer":"make/become","id":11,"type":"affix"}
        ]);
    });
});

describe('affix — Year 6', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g6)).toEqual([
            {"prompt":"Write a word that has the prefix \"pre\".","answer":"Example: preschool (any real word with the prefix \"pre\" is correct)","id":1,"type":"affix"},
            {"prompt":"What does the prefix \"un\" mean in \"unlock\"?","answer":"reverse","id":2,"type":"affix"},
            {"prompt":"Write a word that has the suffix \"ful\".","answer":"Example: colourful (any real word with the suffix \"ful\" is correct)","id":3,"type":"affix"},
            {"prompt":"What does the prefix \"dis\" do? (not, opposite, again)","answer":"opposite","id":4,"type":"affix"},
            {"prompt":"Which word fits: The cat crept __ past the sleeping dog. (silently, rudely, sweetly)","answer":"silently","id":5,"type":"affix"},
            {"prompt":"Which word has the suffix \"ing\"? (misspell, interview, teaching)","answer":"teaching","id":6,"type":"affix"},
            {"prompt":"Write a word that has the prefix \"dis\".","answer":"Example: disobey (any real word with the prefix \"dis\" is correct)","id":7,"type":"affix"},
            {"prompt":"What does the prefix \"non\" mean in \"nonsense\"?","answer":"not","id":8,"type":"affix"}
        ]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(affixSpec, g6, seedFrom([6, 'affix', 0]), 2).pages[1].slice(0, 3)).toEqual([
            {"prompt":"Write a word that has the suffix \"able\".","answer":"Example: movable (any real word with the suffix \"able\" is correct)","id":9,"type":"affix"},
            {"prompt":"Which word fits: Be __ when you carry the glass jug. (careful, careless, colourful)","answer":"careful","id":10,"type":"affix"},
            {"prompt":"Split \"supermarket\" into its prefix and base word.","answer":"super + market","id":11,"type":"affix"}
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(affixSpec, getGradeConfig(7), seedFrom([7, 'affix', 0]))).toEqual([]);
    });
});

describe('affix — generator invariants', () => {
    // Invariants run over the full 100-page request for every offered grade.
    for (const grade of [g3, g6]) {
        const ask = affixSpec.perPage * 100;
        const problems = affixSpec.generate(createRng(seedFrom([grade.id, affixSpec.id, 0])), grade.caps, ask);

        it(`year ${grade.id}: fills ${ask} unique prompts (capacity floor)`, () => {
            expect(problems.length).toBe(ask);
            expect(new Set(problems.map((p) => p.prompt)).size).toBe(ask);
        });

        it(`year ${grade.id}: every MC answer is one of its printed options`, () => {
            for (const p of problems) {
                const options = optionsOf(p.prompt);
                if (options) expect(options).toContain(p.answer);
            }
        });

        it(`year ${grade.id}: compose answers are never printed in their prompt`, () => {
            for (const p of problems) {
                if (p.answer.startsWith('Example:') || optionsOf(p.prompt)) continue;
                expect(leaks(p.prompt, p.answer)).toBe(false);
            }
        });

        it(`year ${grade.id}: open-ended answers are explicitly marked`, () => {
            for (const p of problems) {
                if (p.answer.startsWith('Example:')) expect(p.answer).toContain('(any');
            }
        });
    }
});
