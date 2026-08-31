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
        {"id":1,"type":"rhyme","prompt":"Which word rhymes with \"rat\"? (fat, leaf, hand)","answer":"fat"},
        {"id":2,"type":"rhyme","prompt":"Which word rhymes with \"bed\"? (milk, fed, star)","answer":"fed"},
        {"id":3,"type":"rhyme","prompt":"Which word rhymes with \"pin\"? (tin, west, star)","answer":"tin"},
        {"id":4,"type":"rhyme","prompt":"Which word rhymes with \"light\"? (moon, night, nest)","answer":"night"},
        {"id":5,"type":"rhyme","prompt":"Which word rhymes with \"hat\"? (bird, bat, spoon)","answer":"bat"},
        {"id":6,"type":"rhyme","prompt":"Which word rhymes with \"cup\"? (rock, pup, spoon)","answer":"pup"},
        {"id":7,"type":"rhyme","prompt":"Which word rhymes with \"pig\"? (moon, dig, leaf)","answer":"dig"},
        {"id":8,"type":"rhyme","prompt":"Which word rhymes with \"red\"? (tree, bed, duck)","answer":"bed"},
        {"id":9,"type":"rhyme","prompt":"Which word rhymes with \"top\"? (spoon, duck, hop)","answer":"hop"},
        {"id":10,"type":"rhyme","prompt":"Which word rhymes with \"fan\"? (hand, sand, can)","answer":"can"},
        {"id":11,"type":"rhyme","prompt":"Which word rhymes with \"cat\"? (bat, corn, nest)","answer":"bat"},
        {"id":12,"type":"rhyme","prompt":"Which word rhymes with \"green\"? (moon, king, clean)","answer":"clean"},
        {"id":13,"type":"rhyme","prompt":"Which word rhymes with \"night\"? (flight, star, king)","answer":"flight"},
        {"id":14,"type":"rhyme","prompt":"Which word rhymes with \"dog\"? (cloud, log, tree)","answer":"log"},
        {"id":15,"type":"rhyme","prompt":"Which word rhymes with \"sun\"? (fun, west, star)","answer":"fun"},
        {"id":16,"type":"rhyme","prompt":"Which word rhymes with \"chair\"? (bird, hair, duck)","answer":"hair"},
        {"id":17,"type":"rhyme","prompt":"Which word rhymes with \"pen\"? (bird, hen, moon)","answer":"hen"},
        {"id":18,"type":"rhyme","prompt":"Which word rhymes with \"pot\"? (fish, hot, king)","answer":"hot"}
]);
        checkOptionsContainAnswer(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(rhymeSpec, g1, seedFrom([1, 'rhyme', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":19,"type":"rhyme","prompt":"Which word rhymes with \"pin\"? (west, bin, nest)","answer":"bin"},
        {"id":20,"type":"rhyme","prompt":"Which word rhymes with \"green\"? (moon, screen, door)","answer":"screen"},
        {"id":21,"type":"rhyme","prompt":"Which word rhymes with \"light\"? (tree, night, corn)","answer":"night"}
]);
    });
});

describe('rhyme — Year 2 (adds the apple family)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"rhyme","prompt":"Which word rhymes with \"apple\"? (gift, west, happy)","answer":"happy"},
        {"id":2,"type":"rhyme","prompt":"Which word rhymes with \"chair\"? (hand, pair, gift)","answer":"pair"},
        {"id":3,"type":"rhyme","prompt":"Which word rhymes with \"rat\"? (tree, leaf, fat)","answer":"fat"},
        {"id":4,"type":"rhyme","prompt":"Which word rhymes with \"fan\"? (can, door, sand)","answer":"can"},
        {"id":5,"type":"rhyme","prompt":"Which word rhymes with \"pen\"? (hen, sand, rock)","answer":"hen"},
        {"id":6,"type":"rhyme","prompt":"Which word rhymes with \"night\"? (star, gift, light)","answer":"light"},
        {"id":7,"type":"rhyme","prompt":"Which word rhymes with \"dog\"? (star, log, west)","answer":"log"},
        {"id":8,"type":"rhyme","prompt":"Which word rhymes with \"green\"? (hand, moon, screen)","answer":"screen"},
        {"id":9,"type":"rhyme","prompt":"Which word rhymes with \"pin\"? (tin, corn, leaf)","answer":"tin"},
        {"id":10,"type":"rhyme","prompt":"Which word rhymes with \"bed\"? (fed, spoon, leaf)","answer":"fed"},
        {"id":11,"type":"rhyme","prompt":"Which word rhymes with \"red\"? (hand, rock, led)","answer":"led"},
        {"id":12,"type":"rhyme","prompt":"Which word rhymes with \"hat\"? (fish, spoon, cat)","answer":"cat"},
        {"id":13,"type":"rhyme","prompt":"Which word rhymes with \"cat\"? (west, star, bat)","answer":"bat"},
        {"id":14,"type":"rhyme","prompt":"Which word rhymes with \"pig\"? (big, cloud, fish)","answer":"big"},
        {"id":15,"type":"rhyme","prompt":"Which word rhymes with \"pot\"? (cot, west, moon)","answer":"cot"},
        {"id":16,"type":"rhyme","prompt":"Which word rhymes with \"cup\"? (up, sand, hand)","answer":"up"},
        {"id":17,"type":"rhyme","prompt":"Which word rhymes with \"light\"? (spoon, flight, nest)","answer":"flight"},
        {"id":18,"type":"rhyme","prompt":"Which word rhymes with \"sun\"? (cloud, gift, fun)","answer":"fun"}
]);
        checkOptionsContainAnswer(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(rhymeSpec, g2, seedFrom([2, 'rhyme', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":19,"type":"rhyme","prompt":"Which word rhymes with \"top\"? (cloud, moon, lop)","answer":"lop"},
        {"id":20,"type":"rhyme","prompt":"Which word rhymes with \"cup\"? (bird, nest, up)","answer":"up"},
        {"id":21,"type":"rhyme","prompt":"Which word rhymes with \"green\"? (west, door, mean)","answer":"mean"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(rhymeSpec, getGradeConfig(3), seedFrom([3, 'rhyme', 0]))).toEqual([]);
    });
});
