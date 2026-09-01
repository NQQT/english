// Unit tests for the BEGINNING SOUNDS worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm, word banks, or caps
// change, these exact assertions fail — which is what we want, so a silent
// change to the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { soundsSpec } from './BeginningSoundsWorksheet';

const g0 = getGradeConfig(0);
const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(soundsSpec, grade, seedFrom([grade.id, soundsSpec.id, 0]));
}

describe('sounds plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(soundsSpec.id).toBe('sounds');
        expect(soundsSpec.label).toBe('Beginning Sounds');
        expect(soundsSpec.icon).toBe('♪');
        expect(soundsSpec.perPage).toBe(24);
    });

    it('describes its word-set scope from the grade caps', () => {
        expect(soundsSpec.scope(g0)).toBe('beginnings, word set 1');
        expect(soundsSpec.scope(g1)).toBe('beginnings, word set 2');
        expect(soundsSpec.scope(g2)).toBe('beginnings, word set 3');
    });

    it('is gated by the grade catalogue (Years 0..6 offer it, Year 7 does not)', () => {
        expect(soundsSpec.offered(g0)).toBe(true);
        expect(soundsSpec.offered(g1)).toBe(true);
        expect(soundsSpec.offered(g2)).toBe(true);
        expect(soundsSpec.offered(getGradeConfig(3))).toBe(true);
        expect(soundsSpec.offered(getGradeConfig(6))).toBe(true);
        expect(soundsSpec.offered(getGradeConfig(7))).toBe(false);
    });
});

// Semantic invariants: every generator kind is answerable from the prompt
// alone (see BeginningSoundsWorksheet.ts):
//   base   — the answer IS the printed word's first letter
//   MC     — exactly one option starts with the letter, and it is the answer
//   NOT    — exactly two options start with the letter; the answer does not
//   same   — the answer shares the printed word's first letter; the other two
//            options do not (and are not the word itself)
function checkSoundTruths(grade: GradeConfig) {
    for (const p of sheet(grade)) {
        const base = p.prompt.match(/^Which letter does "([a-z]+)" start with\?$/);
        const starts = p.prompt.match(/^Which word starts with the letter "([a-z])"\? \(([^)]+)\)$/);
        const not = p.prompt.match(/^Which word does NOT start with the letter "([a-z])"\? \(([^)]+)\)$/);
        const same = p.prompt.match(/^Which word starts with the same sound as "([a-z]+)"\? \(([^)]+)\)$/);
        if (base) {
            expect(p.answer).toBe(base[1][0]);
        } else if (starts) {
            const options = starts[2].split(', ');
            const matching = options.filter((o) => o[0] === starts[1]);
            expect(matching).toEqual([p.answer]);
        } else if (not) {
            const options = not[2].split(', ');
            expect(options.filter((o) => o[0] === not[1])).toHaveLength(2);
            expect(p.answer[0]).not.toBe(not[1]);
        } else if (same) {
            const options = same[2].split(', ');
            expect(p.answer[0]).toBe(same[1][0]);
            const others = options.filter((o) => o !== p.answer);
            expect(others).toHaveLength(2);
            for (const o of others) expect(o[0]).not.toBe(same[1][0]);
        } else {
            // Every prompt must fall into exactly one of the four kinds.
            throw new Error(`unrecognised sounds prompt: ${p.prompt}`);
        }
    }
}

describe('sounds — Prep (tier-1 starter word set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g0)).toEqual([
        {"prompt":"Which letter does \"pen\" start with?","answer":"p","id":1,"type":"sounds"},
        {"prompt":"Which word starts with the letter \"n\"? (sip, hat, net)","answer":"net","id":2,"type":"sounds"},
        {"prompt":"Which letter does \"bus\" start with?","answer":"b","id":3,"type":"sounds"},
        {"prompt":"Which word does NOT start with the letter \"m\"? (jam, map, moon)","answer":"jam","id":4,"type":"sounds"},
        {"prompt":"Which letter does \"pig\" start with?","answer":"p","id":5,"type":"sounds"},
        {"prompt":"Which letter does \"moon\" start with?","answer":"m","id":6,"type":"sounds"},
        {"prompt":"Which word starts with the same sound as \"pot\"? (pig, log, cat)","answer":"pig","id":7,"type":"sounds"},
        {"prompt":"Which word does NOT start with the letter \"c\"? (cup, bag, cat)","answer":"bag","id":8,"type":"sounds"},
        {"prompt":"Which word does NOT start with the letter \"l\"? (log, red, leg)","answer":"red","id":9,"type":"sounds"},
        {"prompt":"Which word starts with the same sound as \"sun\"? (wig, leg, sip)","answer":"sip","id":10,"type":"sounds"},
        {"prompt":"Which letter does \"bed\" start with?","answer":"b","id":11,"type":"sounds"},
        {"prompt":"Which letter does \"box\" start with?","answer":"b","id":12,"type":"sounds"},
        {"prompt":"Which letter does \"pin\" start with?","answer":"p","id":13,"type":"sounds"},
        {"prompt":"Which word starts with the same sound as \"cup\"? (map, rat, cat)","answer":"cat","id":14,"type":"sounds"},
        {"prompt":"Which letter does \"dog\" start with?","answer":"d","id":15,"type":"sounds"},
        {"prompt":"Which word starts with the letter \"p\"? (pot, fan, top)","answer":"pot","id":16,"type":"sounds"},
        {"prompt":"Which letter does \"net\" start with?","answer":"n","id":17,"type":"sounds"},
        {"prompt":"Which letter does \"cup\" start with?","answer":"c","id":18,"type":"sounds"},
        {"prompt":"Which letter does \"red\" start with?","answer":"r","id":19,"type":"sounds"},
        {"prompt":"Which letter does \"wig\" start with?","answer":"w","id":20,"type":"sounds"},
        {"prompt":"Which letter does \"cat\" start with?","answer":"c","id":21,"type":"sounds"},
        {"prompt":"Which word starts with the letter \"s\"? (fan, sip, bag)","answer":"sip","id":22,"type":"sounds"},
        {"prompt":"Which word does NOT start with the letter \"r\"? (rat, bus, red)","answer":"bus","id":23,"type":"sounds"},
        {"prompt":"Which word does NOT start with the letter \"b\"? (jam, bag, bed)","answer":"jam","id":24,"type":"sounds"},
        ]);
        checkSoundTruths(g0);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(soundsSpec, g0, seedFrom([0, 'sounds', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Which word starts with the letter \"s\"? (sip, bed, pot)","answer":"sip","id":25,"type":"sounds"},
        {"prompt":"Which letter does \"hat\" start with?","answer":"h","id":26,"type":"sounds"},
        {"prompt":"Which letter does \"sip\" start with?","answer":"s","id":27,"type":"sounds"},
        ]);
    });
});

describe('sounds — Year 1 (tier-2 common word set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"prompt":"Which word starts with the same sound as \"bird\"? (rat, box, cat)","answer":"box","id":1,"type":"sounds"},
        {"prompt":"Which word starts with the letter \"w\"? (wig, plane, fan)","answer":"wig","id":2,"type":"sounds"},
        {"prompt":"Which letter does \"bed\" start with?","answer":"b","id":3,"type":"sounds"},
        {"prompt":"Which word does NOT start with the letter \"l\"? (net, log, lemon)","answer":"net","id":4,"type":"sounds"},
        {"prompt":"Which word starts with the same sound as \"pot\"? (leg, bag, pin)","answer":"pin","id":5,"type":"sounds"},
        {"prompt":"Which word starts with the letter \"j\"? (jam, water, pig)","answer":"jam","id":6,"type":"sounds"},
        {"prompt":"Which word starts with the same sound as \"cup\"? (cat, log, house)","answer":"cat","id":7,"type":"sounds"},
        {"prompt":"Which word starts with the letter \"r\"? (rabbit, box, wig)","answer":"rabbit","id":8,"type":"sounds"},
        {"prompt":"Which letter does \"train\" start with?","answer":"t","id":9,"type":"sounds"},
        {"prompt":"Which word starts with the letter \"n\"? (night, light, tree)","answer":"night","id":10,"type":"sounds"},
        {"prompt":"Which word starts with the letter \"s\"? (bus, sun, moon)","answer":"sun","id":11,"type":"sounds"},
        {"prompt":"Which word starts with the letter \"p\"? (chair, dog, plane)","answer":"plane","id":12,"type":"sounds"},
        {"prompt":"Which word starts with the same sound as \"rabbit\"? (red, grass, pen)","answer":"red","id":13,"type":"sounds"},
        {"prompt":"Which letter does \"sun\" start with?","answer":"s","id":14,"type":"sounds"},
        {"prompt":"Which word does NOT start with the letter \"f\"? (fan, fish, hat)","answer":"hat","id":15,"type":"sounds"},
        {"prompt":"Which word does NOT start with the letter \"g\"? (grass, night, green)","answer":"night","id":16,"type":"sounds"},
        {"prompt":"Which word does NOT start with the letter \"m\"? (moon, tiger, map)","answer":"tiger","id":17,"type":"sounds"},
        {"prompt":"Which word starts with the same sound as \"red\"? (rabbit, bread, table)","answer":"rabbit","id":18,"type":"sounds"},
        {"prompt":"Which word does NOT start with the letter \"t\"? (table, tree, map)","answer":"map","id":19,"type":"sounds"},
        {"prompt":"Which letter does \"fish\" start with?","answer":"f","id":20,"type":"sounds"},
        {"prompt":"Which word starts with the same sound as \"green\"? (grass, jam, top)","answer":"grass","id":21,"type":"sounds"},
        {"prompt":"Which letter does \"purple\" start with?","answer":"p","id":22,"type":"sounds"},
        {"prompt":"Which word starts with the letter \"c\"? (lemon, apple, chair)","answer":"chair","id":23,"type":"sounds"},
        {"prompt":"Which word starts with the same sound as \"pin\"? (leg, fish, pot)","answer":"pot","id":24,"type":"sounds"},
        ]);
        checkSoundTruths(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(soundsSpec, g1, seedFrom([1, 'sounds', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Which word starts with the letter \"h\"? (train, rat, house)","answer":"house","id":25,"type":"sounds"},
        {"prompt":"Which word starts with the letter \"d\"? (fan, dog, bus)","answer":"dog","id":26,"type":"sounds"},
        {"prompt":"Which word starts with the letter \"b\"? (bird, dog, green)","answer":"bird","id":27,"type":"sounds"},
        ]);
    });
});

describe('sounds — Year 2 (tier-3 extended set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"prompt":"Which word starts with the letter \"t\"? (train, sun, lemon)","answer":"train","id":1,"type":"sounds"},
        {"prompt":"Which word starts with the letter \"f\"? (rat, bag, family)","answer":"family","id":2,"type":"sounds"},
        {"prompt":"Which letter does \"light\" start with?","answer":"l","id":3,"type":"sounds"},
        {"prompt":"Which word starts with the letter \"c\"? (pumpkin, dolphin, computer)","answer":"computer","id":4,"type":"sounds"},
        {"prompt":"Which letter does \"rabbit\" start with?","answer":"r","id":5,"type":"sounds"},
        {"prompt":"Which word starts with the letter \"p\"? (shirt, bus, pot)","answer":"pot","id":6,"type":"sounds"},
        {"prompt":"Which letter does \"train\" start with?","answer":"t","id":7,"type":"sounds"},
        {"prompt":"Which word starts with the letter \"r\"? (red, hat, window)","answer":"red","id":8,"type":"sounds"},
        {"prompt":"Which word does NOT start with the letter \"s\"? (fish, school, sip)","answer":"fish","id":9,"type":"sounds"},
        {"prompt":"Which word starts with the letter \"m\"? (leg, moon, tiger)","answer":"moon","id":10,"type":"sounds"},
        {"prompt":"Which word starts with the letter \"b\"? (night, butterfly, dog)","answer":"butterfly","id":11,"type":"sounds"},
        {"prompt":"Which letter does \"computer\" start with?","answer":"c","id":12,"type":"sounds"},
        {"prompt":"Which word does NOT start with the letter \"h\"? (house, hat, tree)","answer":"tree","id":13,"type":"sounds"},
        {"prompt":"Which word starts with the same sound as \"box\"? (teacher, bag, plane)","answer":"bag","id":14,"type":"sounds"},
        {"prompt":"Which word does NOT start with the letter \"w\"? (window, school, water)","answer":"school","id":15,"type":"sounds"},
        {"prompt":"Which word does NOT start with the letter \"n\"? (night, beautiful, net)","answer":"beautiful","id":16,"type":"sounds"},
        {"prompt":"Which letter does \"cat\" start with?","answer":"c","id":17,"type":"sounds"},
        {"prompt":"Which word starts with the same sound as \"button\"? (house, jam, bird)","answer":"bird","id":18,"type":"sounds"},
        {"prompt":"Which letter does \"elephant\" start with?","answer":"e","id":19,"type":"sounds"},
        {"prompt":"Which word starts with the letter \"l\"? (lemon, dinosaur, top)","answer":"lemon","id":20,"type":"sounds"},
        {"prompt":"Which letter does \"pot\" start with?","answer":"p","id":21,"type":"sounds"},
        {"prompt":"Which word starts with the letter \"e\"? (bird, elephant, chair)","answer":"elephant","id":22,"type":"sounds"},
        {"prompt":"Which letter does \"wig\" start with?","answer":"w","id":23,"type":"sounds"},
        {"prompt":"Which word starts with the same sound as \"chocolate\"? (red, chair, water)","answer":"chair","id":24,"type":"sounds"},
        ]);
        checkSoundTruths(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(soundsSpec, g2, seedFrom([2, 'sounds', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Which letter does \"cup\" start with?","answer":"c","id":25,"type":"sounds"},
        {"prompt":"Which word starts with the same sound as \"green\"? (table, grass, net)","answer":"grass","id":26,"type":"sounds"},
        {"prompt":"Which letter does \"purple\" start with?","answer":"p","id":27,"type":"sounds"},
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(soundsSpec, getGradeConfig(7), seedFrom([7, 'sounds', 0]))).toEqual([]);
    });
});
