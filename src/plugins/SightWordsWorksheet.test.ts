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

    it('is gated by the grade catalogue (Prep, Year 1 and Year 2 offer it)', () => {
        expect(sightSpec.offered(g0)).toBe(true);
        expect(sightSpec.offered(g1)).toBe(true);
        expect(sightSpec.offered(g2)).toBe(true);
        expect(sightSpec.offered(getGradeConfig(3))).toBe(false);
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
        {"id":1,"type":"sight","prompt":"Which is a real word? (wia, rea, pig, faa)","answer":"pig"},
        {"id":2,"type":"sight","prompt":"Which is a real word? (fan, cua, caa, toa)","answer":"fan"},
        {"id":3,"type":"sight","prompt":"Which is a real word? (pea, wig, haa, doa)","answer":"wig"},
        {"id":4,"type":"sight","prompt":"Which is a real word? (doa, jam, mooa, poa)","answer":"jam"},
        {"id":5,"type":"sight","prompt":"Which is a real word? (pig, boa, poa, doa)","answer":"pig"},
        {"id":6,"type":"sight","prompt":"Which is a real word? (pea, sun, doa, caa)","answer":"sun"},
        {"id":7,"type":"sight","prompt":"Which is a real word? (sia, bua, loa, red)","answer":"red"},
        {"id":8,"type":"sight","prompt":"Which is a real word? (sia, lea, hat, mooa)","answer":"hat"},
        {"id":9,"type":"sight","prompt":"Which is a real word? (faa, sun, raa, lea)","answer":"sun"},
        {"id":10,"type":"sight","prompt":"Which is a real word? (wia, pia, moon, faa)","answer":"moon"},
        {"id":11,"type":"sight","prompt":"Which is a real word? (jam, pea, toa, rea)","answer":"jam"},
        {"id":12,"type":"sight","prompt":"Which is a real word? (doa, bua, cup, wia)","answer":"cup"},
        {"id":13,"type":"sight","prompt":"Which is a real word? (hat, baa, lea, sua)","answer":"hat"},
        {"id":14,"type":"sight","prompt":"Which is a real word? (cua, boa, sun, mooa)","answer":"sun"},
        {"id":15,"type":"sight","prompt":"Which is a real word? (pin, bua, wia, sua)","answer":"pin"},
        {"id":16,"type":"sight","prompt":"Which is a real word? (bus, poa, jaa, loa)","answer":"bus"},
        {"id":17,"type":"sight","prompt":"Which is a real word? (sua, wia, lea, jam)","answer":"jam"},
        {"id":18,"type":"sight","prompt":"Which is a real word? (pia, cua, bua, box)","answer":"box"}
]);
        // Every distractor is a genuinely fake word.
        checkRealWordContract(g0);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(sightSpec, g0, seedFrom([0, 'sight', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":19,"type":"sight","prompt":"Which is a real word? (sia, jaa, toa, sip)","answer":"sip"},
        {"id":20,"type":"sight","prompt":"Which is a real word? (toa, pin, raa, jaa)","answer":"pin"},
        {"id":21,"type":"sight","prompt":"Which is a real word? (rea, haa, sua, bus)","answer":"bus"}
]);
    });
});

describe('sight — Year 1 (tier-2 common word set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"id":1,"type":"sight","prompt":"Which is a real word? (raa, housa, table, sia)","answer":"table"},
        {"id":2,"type":"sight","prompt":"Which is a real word? (traia, sia, map, bea)","answer":"map"},
        {"id":3,"type":"sight","prompt":"Which is a real word? (plane, bira, mooa, tabla)","answer":"plane"},
        {"id":4,"type":"sight","prompt":"Which is a real word? (loa, greea, pia, night)","answer":"night"},
        {"id":5,"type":"sight","prompt":"Which is a real word? (boa, box, caa, haa)","answer":"box"},
        {"id":6,"type":"sight","prompt":"Which is a real word? (jaa, traia, greea, dog)","answer":"dog"},
        {"id":7,"type":"sight","prompt":"Which is a real word? (sia, wia, sua, rat)","answer":"rat"},
        {"id":8,"type":"sight","prompt":"Which is a real word? (ligha, sua, hat, lemoa)","answer":"hat"},
        {"id":9,"type":"sight","prompt":"Which is a real word? (nea, shira, net, rea)","answer":"net"},
        {"id":10,"type":"sight","prompt":"Which is a real word? (ligha, greea, housa, tree)","answer":"tree"},
        {"id":11,"type":"sight","prompt":"Which is a real word? (bird, chaia, traia, boa)","answer":"bird"},
        {"id":12,"type":"sight","prompt":"Which is a real word? (grass, rea, maa, chaia)","answer":"grass"},
        {"id":13,"type":"sight","prompt":"Which is a real word? (nea, light, appla, maa)","answer":"light"},
        {"id":14,"type":"sight","prompt":"Which is a real word? (bira, log, fisa, faa)","answer":"log"},
        {"id":15,"type":"sight","prompt":"Which is a real word? (plane, chaia, loa, jaa)","answer":"plane"},
        {"id":16,"type":"sight","prompt":"Which is a real word? (bira, tabla, purple, greea)","answer":"purple"},
        {"id":17,"type":"sight","prompt":"Which is a real word? (haa, tigea, lea, leg)","answer":"leg"},
        {"id":18,"type":"sight","prompt":"Which is a real word? (bira, traia, bread, greea)","answer":"bread"}
]);
        checkRealWordContract(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(sightSpec, g1, seedFrom([1, 'sight', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":19,"type":"sight","prompt":"Which is a real word? (watea, chaia, appla, rat)","answer":"rat"},
        {"id":20,"type":"sight","prompt":"Which is a real word? (tigea, bua, caa, sip)","answer":"sip"},
        {"id":21,"type":"sight","prompt":"Which is a real word? (fan, trea, mooa, bira)","answer":"fan"}
]);
    });

    it('3-page documents number ids continuously (page 3 starts at id 37)', () => {
        const d = generateDocument(sightSpec, g1, seedFrom([1, 'sight', 0]), 3);
        expect(d.pages).toHaveLength(3);
        expect(d.total).toBe(54);
        expect(d.pages.flat().map((p) => p.id)).toEqual(Array.from({ length: 54 }, (_, i) => i + 1));
        expect(d.pages[2].slice(0, 2)).toEqual([
        {"id":37,"type":"sight","prompt":"Which is a real word? (plane, appla, loa, raa)","answer":"plane"},
        {"id":38,"type":"sight","prompt":"Which is a real word? (pea, jam, rabbia, baa)","answer":"jam"}
]);
    });
});

describe('sight — Year 2 (tier-3 extended set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"sight","prompt":"Which is a real word? (butterfly, trea, beautifua, ligha)","answer":"butterfly"},
        {"id":2,"type":"sight","prompt":"Which is a real word? (toa, loa, beautifua, sun)","answer":"sun"},
        {"id":3,"type":"sight","prompt":"Which is a real word? (rabbia, purple, mooa, raa)","answer":"purple"},
        {"id":4,"type":"sight","prompt":"Which is a real word? (poa, sia, box, chaia)","answer":"box"},
        {"id":5,"type":"sight","prompt":"Which is a real word? (chickea, button, bananb, sia)","answer":"button"},
        {"id":6,"type":"sight","prompt":"Which is a real word? (top, rea, breaa, cua)","answer":"top"},
        {"id":7,"type":"sight","prompt":"Which is a real word? (fisa, rabbia, bread, chaia)","answer":"bread"},
        {"id":8,"type":"sight","prompt":"Which is a real word? (dog, rabbia, housa, watea)","answer":"dog"},
        {"id":9,"type":"sight","prompt":"Which is a real word? (chair, rea, chickea, loa)","answer":"chair"},
        {"id":10,"type":"sight","prompt":"Which is a real word? (faa, maa, watea, shirt)","answer":"shirt"},
        {"id":11,"type":"sight","prompt":"Which is a real word? (doa, rabbit, chickea, traia)","answer":"rabbit"},
        {"id":12,"type":"sight","prompt":"Which is a real word? (faa, button, grasa, bua)","answer":"button"},
        {"id":13,"type":"sight","prompt":"Which is a real word? (bread, shira, jaa, housa)","answer":"bread"},
        {"id":14,"type":"sight","prompt":"Which is a real word? (cua, pig, loa, elephana)","answer":"pig"},
        {"id":15,"type":"sight","prompt":"Which is a real word? (traia, cup, poa, plana)","answer":"cup"},
        {"id":16,"type":"sight","prompt":"Which is a real word? (fan, caa, butterfla, pia)","answer":"fan"},
        {"id":17,"type":"sight","prompt":"Which is a real word? (traia, shira, bus, wia)","answer":"bus"},
        {"id":18,"type":"sight","prompt":"Which is a real word? (trea, pig, teachea, raa)","answer":"pig"}
]);
        checkRealWordContract(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(sightSpec, g2, seedFrom([2, 'sight', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":19,"type":"sight","prompt":"Which is a real word? (teachea, bua, faa, bird)","answer":"bird"},
        {"id":20,"type":"sight","prompt":"Which is a real word? (famila, tabla, chair, buttoa)","answer":"chair"},
        {"id":21,"type":"sight","prompt":"Which is a real word? (pumpkia, computer, pia, bua)","answer":"computer"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(sightSpec, getGradeConfig(3), seedFrom([3, 'sight', 0]))).toEqual([]);
    });
});
