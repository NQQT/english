// Unit tests for the SIGHT & REAL WORDS worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm, word banks, or caps
// change, these exact assertions fail — which is what we want, so a silent
// change to the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { sightSpec } from './SightWordsWorksheet';
import { KNOWN_WORD_SET } from './words';

const g0 = getGradeConfig(0);
const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(sightSpec, grade, seedFrom([grade.id, sightSpec.id, 0]));
}

describe('sight plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(sightSpec.id).toBe('sight');
        expect(sightSpec.label).toBe('Sight & Real Words');
        expect(sightSpec.icon).toBe('A');
        expect(sightSpec.perPage).toBe(18);
    });

    it('describes its word-set scope from the grade caps', () => {
        expect(sightSpec.scope(g0)).toBe('word set 1');
        expect(sightSpec.scope(g1)).toBe('word set 2');
        expect(sightSpec.scope(g2)).toBe('word set 3');
    });

    it('is gated by the grade catalogue (Prep..Year 6 offer it, Year 7 does not)', () => {
        expect(sightSpec.offered(g0)).toBe(true);
        expect(sightSpec.offered(g1)).toBe(true);
        expect(sightSpec.offered(g2)).toBe(true);
        expect(sightSpec.offered(getGradeConfig(3))).toBe(true);
        expect(sightSpec.offered(getGradeConfig(6))).toBe(true);
        expect(sightSpec.offered(getGradeConfig(7))).toBe(false);
    });
});

// Semantic invariant on top of the exact pins: every sight line prints
// exactly ONE real word (a KNOWN_WORD_SET member) — and it is the answer.
function checkRealWordContract(grade: GradeConfig) {
    for (const p of sheet(grade)) {
        const m = p.prompt.match(/\(([^)]+)\)\s*$/);
        expect(m).not.toBeNull();
        const opts = m![1].split(', ').map((s) => s.trim());
        const real = opts.filter((o) => KNOWN_WORD_SET.has(o));
        expect(real).toEqual([p.answer]);
    }
}

describe('sight — Prep (tier-1 starter word set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g0)).toEqual([
        {"prompt":"Which is a real word? (doa, pig, mooa, jaa)","answer":"pig","id":1,"type":"sight"},
        {"prompt":"Which is a real word? (nea, raa, lea, top)","answer":"top","id":2,"type":"sight"},
        {"prompt":"Which is a real word? (cua, haa, bea, box)","answer":"box","id":3,"type":"sight"},
        {"prompt":"Which is a real word? (maa, caa, baa, pen)","answer":"pen","id":4,"type":"sight"},
        {"prompt":"Which is a real word? (rea, bua, sua, cup)","answer":"cup","id":5,"type":"sight"},
        {"prompt":"Which is a real word? (loa, faa, peb, bag)","answer":"bag","id":6,"type":"sight"},
        {"prompt":"Which is a real word? (cat, boa, wia, sia)","answer":"cat","id":7,"type":"sight"},
        {"prompt":"Which is a real word? (toa, sun, pia, poa)","answer":"sun","id":8,"type":"sight"},
        {"prompt":"Which is a real word? (sua, boa, red, mooa)","answer":"red","id":9,"type":"sight"},
        {"prompt":"Which is a real word? (fan, poa, raa, lea)","answer":"fan","id":10,"type":"sight"},
        {"prompt":"Which is a real word? (moon, sia, bua, haa)","answer":"moon","id":11,"type":"sight"},
        {"prompt":"Which is a real word? (pia, loa, nea, dog)","answer":"dog","id":12,"type":"sight"},
        {"prompt":"Which is a real word? (baa, rat, cua, faa)","answer":"rat","id":13,"type":"sight"},
        {"prompt":"Which is a real word? (bus, caa, jaa, peb)","answer":"bus","id":14,"type":"sight"},
        {"prompt":"Which is a real word? (rea, wia, pia, pin)","answer":"pin","id":15,"type":"sight"},
        {"prompt":"Which is a real word? (maa, pot, bea, doa)","answer":"pot","id":16,"type":"sight"},
        {"prompt":"Which is a real word? (toa, baa, bua, leg)","answer":"leg","id":17,"type":"sight"},
        {"prompt":"Which is a real word? (jam, jaa, faa, boa)","answer":"jam","id":18,"type":"sight"},
        ]);
        // Every distractor is a genuinely fake word.
        checkRealWordContract(g0);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(sightSpec, g0, seedFrom([0, 'sight', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Which is a real word? (map, maa, raa, peb)","answer":"map","id":19,"type":"sight"},
        {"prompt":"Which is a real word? (pia, lea, nea, wig)","answer":"wig","id":20,"type":"sight"},
        {"prompt":"Which is a real word? (net, loa, wia, sua)","answer":"net","id":21,"type":"sight"},
        ]);
    });
});

describe('sight — Year 1 (tier-2 common word set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"prompt":"Which is a real word? (jaa, table, boa, mooa)","answer":"table","id":1,"type":"sight"},
        {"prompt":"Which is a real word? (pia, housa, rat, shira)","answer":"rat","id":2,"type":"sight"},
        {"prompt":"Which is a real word? (pot, sua, plana, nea)","answer":"pot","id":3,"type":"sight"},
        {"prompt":"Which is a real word? (faa, rabbia, lemon, lemoa)","answer":"lemon","id":4,"type":"sight"},
        {"prompt":"Which is a real word? (sia, tiger, cua, bua)","answer":"tiger","id":5,"type":"sight"},
        {"prompt":"Which is a real word? (raa, leg, appla, traia)","answer":"leg","id":6,"type":"sight"},
        {"prompt":"Which is a real word? (caa, net, tabla, peb)","answer":"net","id":7,"type":"sight"},
        {"prompt":"Which is a real word? (hat, pia, loa, toa)","answer":"hat","id":8,"type":"sight"},
        {"prompt":"Which is a real word? (sip, ligha, bira, chaia)","answer":"sip","id":9,"type":"sight"},
        {"prompt":"Which is a real word? (cup, trea, breaa, watea)","answer":"cup","id":10,"type":"sight"},
        {"prompt":"Which is a real word? (log, bea, baa, rea)","answer":"log","id":11,"type":"sight"},
        {"prompt":"Which is a real word? (water, tigea, doa, lea)","answer":"water","id":12,"type":"sight"},
        {"prompt":"Which is a real word? (pen, grasa, maa, poa)","answer":"pen","id":13,"type":"sight"},
        {"prompt":"Which is a real word? (purpla, box, greea, nigha)","answer":"box","id":14,"type":"sight"},
        {"prompt":"Which is a real word? (wia, haa, bird, fisa)","answer":"bird","id":15,"type":"sight"},
        {"prompt":"Which is a real word? (sua, rea, boa, pig)","answer":"pig","id":16,"type":"sight"},
        {"prompt":"Which is a real word? (plane, appla, breaa, toa)","answer":"plane","id":17,"type":"sight"},
        {"prompt":"Which is a real word? (greea, grasa, plana, wig)","answer":"wig","id":18,"type":"sight"},
        ]);
        checkRealWordContract(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(sightSpec, g1, seedFrom([1, 'sight', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Which is a real word? (bira, caa, cua, purple)","answer":"purple","id":19,"type":"sight"},
        {"prompt":"Which is a real word? (sun, sia, raa, jaa)","answer":"sun","id":20,"type":"sight"},
        {"prompt":"Which is a real word? (fan, nea, mooa, fisa)","answer":"fan","id":21,"type":"sight"},
        ]);
    });

    it('3-page documents number ids continuously (page 3 starts at id 37)', () => {
        const d = generateDocument(sightSpec, g1, seedFrom([1, 'sight', 0]), 3);
        expect(d.pages).toHaveLength(3);
        expect(d.total).toBe(54);
        expect(d.pages.flat().map((p) => p.id)).toEqual(Array.from({ length: 54 }, (_, i) => i + 1));
        expect(d.pages[2].slice(0, 2)).toEqual([
        {"id":37,"type":"sight","prompt":"Which is a real word? (doa, trea, top, plana)","answer":"top"},
        {"id":38,"type":"sight","prompt":"Which is a real word? (tigea, apple, lemoa, greea)","answer":"apple"}
]);
    });
});

describe('sight — Year 2 (tier-3 extended set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"prompt":"Which is a real word? (chickea, doa, butterfly, housa)","answer":"butterfly","id":1,"type":"sight"},
        {"prompt":"Which is a real word? (rabbia, shira, bird, appla)","answer":"bird","id":2,"type":"sight"},
        {"prompt":"Which is a real word? (elephana, jaa, peb, green)","answer":"green","id":3,"type":"sight"},
        {"prompt":"Which is a real word? (sia, trea, family, wia)","answer":"family","id":4,"type":"sight"},
        {"prompt":"Which is a real word? (bea, rat, grasa, chocolata)","answer":"rat","id":5,"type":"sight"},
        {"prompt":"Which is a real word? (haa, raa, dinosaur, pumpkia)","answer":"dinosaur","id":6,"type":"sight"},
        {"prompt":"Which is a real word? (maa, dolphia, boa, purple)","answer":"purple","id":7,"type":"sight"},
        {"prompt":"Which is a real word? (beautiful, beautifua, tigea, watea)","answer":"beautiful","id":8,"type":"sight"},
        {"prompt":"Which is a real word? (pia, sun, caa, nea)","answer":"sun","id":9,"type":"sight"},
        {"prompt":"Which is a real word? (chaia, plana, faa, fan)","answer":"fan","id":10,"type":"sight"},
        {"prompt":"Which is a real word? (poa, lemoa, lemon, tabla)","answer":"lemon","id":11,"type":"sight"},
        {"prompt":"Which is a real word? (pin, pia, dinosaua, teachea)","answer":"pin","id":12,"type":"sight"},
        {"prompt":"Which is a real word? (bananb, map, fisa, famila)","answer":"map","id":13,"type":"sight"},
        {"prompt":"Which is a real word? (lea, windoa, banana, schooa)","answer":"banana","id":14,"type":"sight"},
        {"prompt":"Which is a real word? (greea, rea, table, loa)","answer":"table","id":15,"type":"sight"},
        {"prompt":"Which is a real word? (baa, window, bira, ligha)","answer":"window","id":16,"type":"sight"},
        {"prompt":"Which is a real word? (traia, garden, butterfla, mooa)","answer":"garden","id":17,"type":"sight"},
        {"prompt":"Which is a real word? (toa, chair, nigha, sua)","answer":"chair","id":18,"type":"sight"},
        ]);
        checkRealWordContract(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(sightSpec, g2, seedFrom([2, 'sight', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Which is a real word? (breaa, gardea, computea, moon)","answer":"moon","id":19,"type":"sight"},
        {"prompt":"Which is a real word? (cua, bua, buttoa, bread)","answer":"bread","id":20,"type":"sight"},
        {"prompt":"Which is a real word? (purpla, dolphia, traia, chocolate)","answer":"chocolate","id":21,"type":"sight"},
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(sightSpec, getGradeConfig(7), seedFrom([7, 'sight', 0]))).toEqual([]);
    });
});
