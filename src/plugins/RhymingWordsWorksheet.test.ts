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

    it('is gated by the grade catalogue (Year 1..6 offer it, Year 7 does not)', () => {
        expect(rhymeSpec.offered(getGradeConfig(0))).toBe(false);
        expect(rhymeSpec.offered(g1)).toBe(true);
        expect(rhymeSpec.offered(g2)).toBe(true);
        expect(rhymeSpec.offered(getGradeConfig(3))).toBe(true);
        expect(rhymeSpec.offered(getGradeConfig(6))).toBe(true);
        expect(rhymeSpec.offered(getGradeConfig(7))).toBe(false);
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
        {"prompt":"Which word rhymes with \"rat\"? (fat, leaf, hand)","answer":"fat","visual":"rat","id":1,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"bed\"? (milk, fed, star)","answer":"fed","visual":"bed","id":2,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"pin\"? (tin, west, star)","answer":"tin","id":3,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"light\"? (moon, night, nest)","answer":"night","visual":"light","id":4,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"hat\"? (bird, bat, spoon)","answer":"bat","visual":"hat","id":5,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"cup\"? (rock, pup, spoon)","answer":"pup","visual":"cup","id":6,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"pig\"? (moon, dig, leaf)","answer":"dig","visual":"pig","id":7,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"red\"? (tree, bed, duck)","answer":"bed","visual":"red","id":8,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"top\"? (spoon, duck, hop)","answer":"hop","visual":"top","id":9,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"fan\"? (hand, sand, can)","answer":"can","visual":"fan","id":10,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"cat\"? (bat, corn, nest)","answer":"bat","visual":"cat","id":11,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"green\"? (moon, king, clean)","answer":"clean","visual":"green","id":12,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"night\"? (flight, star, king)","answer":"flight","visual":"night","id":13,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"dog\"? (cloud, log, tree)","answer":"log","visual":"dog","id":14,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"sun\"? (fun, west, star)","answer":"fun","visual":"sun","id":15,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"chair\"? (bird, hair, duck)","answer":"hair","visual":"chair","id":16,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"pen\"? (bird, hen, moon)","answer":"hen","visual":"pen","id":17,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"pot\"? (fish, hot, king)","answer":"hot","visual":"pot","id":18,"type":"rhyme"}
        ]);
        checkOptionsContainAnswer(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(rhymeSpec, g1, seedFrom([1, 'rhyme', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Which word rhymes with \"pin\"? (west, bin, nest)","answer":"bin","id":19,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"green\"? (moon, screen, door)","answer":"screen","visual":"green","id":20,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"light\"? (tree, night, corn)","answer":"night","visual":"light","id":21,"type":"rhyme"}
        ]);
    });
});

describe('rhyme — Year 2 (adds the apple family)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"prompt":"Which word rhymes with \"apple\"? (gift, west, happy)","answer":"happy","visual":"apple","id":1,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"chair\"? (hand, pair, gift)","answer":"pair","visual":"chair","id":2,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"rat\"? (tree, leaf, fat)","answer":"fat","visual":"rat","id":3,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"fan\"? (can, door, sand)","answer":"can","visual":"fan","id":4,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"pen\"? (hen, sand, rock)","answer":"hen","visual":"pen","id":5,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"night\"? (star, gift, light)","answer":"light","visual":"night","id":6,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"dog\"? (star, log, west)","answer":"log","visual":"dog","id":7,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"green\"? (hand, moon, screen)","answer":"screen","visual":"green","id":8,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"pin\"? (tin, corn, leaf)","answer":"tin","id":9,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"bed\"? (fed, spoon, leaf)","answer":"fed","visual":"bed","id":10,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"red\"? (hand, rock, led)","answer":"led","visual":"red","id":11,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"hat\"? (fish, spoon, cat)","answer":"cat","visual":"hat","id":12,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"cat\"? (west, star, bat)","answer":"bat","visual":"cat","id":13,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"pig\"? (big, cloud, fish)","answer":"big","visual":"pig","id":14,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"pot\"? (cot, west, moon)","answer":"cot","visual":"pot","id":15,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"cup\"? (up, sand, hand)","answer":"up","visual":"cup","id":16,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"light\"? (spoon, flight, nest)","answer":"flight","visual":"light","id":17,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"sun\"? (cloud, gift, fun)","answer":"fun","visual":"sun","id":18,"type":"rhyme"}
        ]);
        checkOptionsContainAnswer(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(rhymeSpec, g2, seedFrom([2, 'rhyme', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Which word rhymes with \"top\"? (cloud, moon, lop)","answer":"lop","visual":"top","id":19,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"cup\"? (bird, nest, up)","answer":"up","visual":"cup","id":20,"type":"rhyme"},
        {"prompt":"Which word rhymes with \"green\"? (west, door, mean)","answer":"mean","visual":"green","id":21,"type":"rhyme"}
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(rhymeSpec, getGradeConfig(7), seedFrom([7, 'rhyme', 0]))).toEqual([]);
    });
});
