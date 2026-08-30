// Unit tests for the RHYMING WORDS worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm, rhyme bank, or caps
// change, these exact assertions fail — which is what we want, so a silent
// change to the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { rhymeSpec } from './RhymingWordsWorksheet';

const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(rhymeSpec, grade, seedFrom([grade.id, rhymeSpec.id, 0]));
}

describe('rhyme plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(rhymeSpec.id).toBe('rhyme');
        expect(rhymeSpec.label).toBe('Rhyming Words');
        expect(rhymeSpec.icon).toBe('≈');
        expect(rhymeSpec.perPage).toBe(18);
    });

    it('describes its scope (rhyme families at every grade)', () => {
        expect(rhymeSpec.scope(g1)).toBe('rhyme families');
        expect(rhymeSpec.scope(g2)).toBe('rhyme families');
    });

    it('is gated by the grade catalogue (Year 1 and Year 2 only)', () => {
        expect(rhymeSpec.offered(getGradeConfig(0))).toBe(false);
        expect(rhymeSpec.offered(g1)).toBe(true);
        expect(rhymeSpec.offered(g2)).toBe(true);
        expect(rhymeSpec.offered(getGradeConfig(3))).toBe(false);
    });
});

// Semantic invariant: every rhyme line's answer is one of the printed options
// (nothing unanswerable on the page).
function checkOptionsContainAnswer(grade: GradeConfig) {
    for (const p of sheet(grade)) {
        const m = p.prompt.match(/\(([^)]+)\)\s*$/);
        expect(m).not.toBeNull();
        const options = m![1].split(', ').map((s) => s.trim());
        expect(options).toContain(p.answer);
    }
}

describe('rhyme — Year 1 (short + tier-2 families)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"id":1,"type":"rhyme","prompt":"Which word rhymes with \"rat\"? (king, hat, duck)","answer":"hat"},
        {"id":2,"type":"rhyme","prompt":"Which word rhymes with \"fan\"? (rock, tree, man)","answer":"man"},
        {"id":3,"type":"rhyme","prompt":"Which word rhymes with \"pen\"? (door, tree, ten)","answer":"ten"},
        {"id":4,"type":"rhyme","prompt":"Which word rhymes with \"fan\"? (door, duck, man)","answer":"man"},
        {"id":5,"type":"rhyme","prompt":"Which word rhymes with \"pot\"? (got, bird, fish)","answer":"got"},
        {"id":6,"type":"rhyme","prompt":"Which word rhymes with \"light\"? (star, night, duck)","answer":"night"},
        {"id":7,"type":"rhyme","prompt":"Which word rhymes with \"pot\"? (duck, star, hot)","answer":"hot"},
        {"id":8,"type":"rhyme","prompt":"Which word rhymes with \"red\"? (fed, bird, king)","answer":"fed"},
        {"id":9,"type":"rhyme","prompt":"Which word rhymes with \"fan\"? (king, bird, man)","answer":"man"},
        {"id":10,"type":"rhyme","prompt":"Which word rhymes with \"chair\"? (king, hair, tree)","answer":"hair"},
        {"id":11,"type":"rhyme","prompt":"Which word rhymes with \"pot\"? (door, rock, got)","answer":"got"},
        {"id":12,"type":"rhyme","prompt":"Which word rhymes with \"hat\"? (door, bat, duck)","answer":"bat"},
        {"id":13,"type":"rhyme","prompt":"Which word rhymes with \"top\"? (fish, hop, king)","answer":"hop"},
        {"id":14,"type":"rhyme","prompt":"Which word rhymes with \"pen\"? (star, ten, king)","answer":"ten"},
        {"id":15,"type":"rhyme","prompt":"Which word rhymes with \"night\"? (tree, light, bird)","answer":"light"},
        {"id":16,"type":"rhyme","prompt":"Which word rhymes with \"chair\"? (tree, hair, milk)","answer":"hair"},
        {"id":17,"type":"rhyme","prompt":"Which word rhymes with \"pig\"? (star, leaf, big)","answer":"big"},
        {"id":18,"type":"rhyme","prompt":"Which word rhymes with \"cat\"? (hat, fish, duck)","answer":"hat"}
]);
        checkOptionsContainAnswer(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(rhymeSpec, g1, seedFrom([1, 'rhyme', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":19,"type":"rhyme","prompt":"Which word rhymes with \"pot\"? (leaf, cot, rock)","answer":"cot"},
        {"id":20,"type":"rhyme","prompt":"Which word rhymes with \"night\"? (duck, sight, leaf)","answer":"sight"},
        {"id":21,"type":"rhyme","prompt":"Which word rhymes with \"pen\"? (ten, rock, door)","answer":"ten"}
]);
    });
});

describe('rhyme — Year 2 (adds the apple family)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"rhyme","prompt":"Which word rhymes with \"apple\"? (leaf, star, maple)","answer":"maple"},
        {"id":2,"type":"rhyme","prompt":"Which word rhymes with \"dog\"? (hog, door, duck)","answer":"hog"},
        {"id":3,"type":"rhyme","prompt":"Which word rhymes with \"dog\"? (hog, leaf, bird)","answer":"hog"},
        {"id":4,"type":"rhyme","prompt":"Which word rhymes with \"pig\"? (fish, rock, wig)","answer":"wig"},
        {"id":5,"type":"rhyme","prompt":"Which word rhymes with \"pot\"? (rock, king, cot)","answer":"cot"},
        {"id":6,"type":"rhyme","prompt":"Which word rhymes with \"dog\"? (leaf, log, king)","answer":"log"},
        {"id":7,"type":"rhyme","prompt":"Which word rhymes with \"top\"? (lop, star, milk)","answer":"lop"},
        {"id":8,"type":"rhyme","prompt":"Which word rhymes with \"rat\"? (bird, leaf, cat)","answer":"cat"},
        {"id":9,"type":"rhyme","prompt":"Which word rhymes with \"sun\"? (star, bird, run)","answer":"run"},
        {"id":10,"type":"rhyme","prompt":"Which word rhymes with \"red\"? (tree, duck, led)","answer":"led"},
        {"id":11,"type":"rhyme","prompt":"Which word rhymes with \"rat\"? (mat, duck, rock)","answer":"mat"},
        {"id":12,"type":"rhyme","prompt":"Which word rhymes with \"chair\"? (door, pair, rock)","answer":"pair"},
        {"id":13,"type":"rhyme","prompt":"Which word rhymes with \"fan\"? (fish, door, pan)","answer":"pan"},
        {"id":14,"type":"rhyme","prompt":"Which word rhymes with \"pin\"? (rock, tin, tree)","answer":"tin"},
        {"id":15,"type":"rhyme","prompt":"Which word rhymes with \"cat\"? (mat, duck, milk)","answer":"mat"},
        {"id":16,"type":"rhyme","prompt":"Which word rhymes with \"green\"? (mean, tree, door)","answer":"mean"},
        {"id":17,"type":"rhyme","prompt":"Which word rhymes with \"pin\"? (duck, bin, rock)","answer":"bin"},
        {"id":18,"type":"rhyme","prompt":"Which word rhymes with \"pen\"? (leaf, duck, hen)","answer":"hen"}
]);
        checkOptionsContainAnswer(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(rhymeSpec, g2, seedFrom([2, 'rhyme', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":19,"type":"rhyme","prompt":"Which word rhymes with \"night\"? (fish, sight, leaf)","answer":"sight"},
        {"id":20,"type":"rhyme","prompt":"Which word rhymes with \"apple\"? (door, star, maple)","answer":"maple"},
        {"id":21,"type":"rhyme","prompt":"Which word rhymes with \"pin\"? (star, fin, door)","answer":"fin"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(rhymeSpec, getGradeConfig(3), seedFrom([3, 'rhyme', 0]))).toEqual([]);
    });
});
