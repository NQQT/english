// Unit tests for the SPELLING worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm, triple bank, or caps
// change, these exact assertions fail — which is what we want, so a silent
// change to the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { spellingSpec } from './SpellingWorksheet';

const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(spellingSpec, grade, seedFrom([grade.id, spellingSpec.id, 0]));
}

describe('spelling plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(spellingSpec.id).toBe('spelling');
        expect(spellingSpec.label).toBe('Spelling');
        expect(spellingSpec.icon).toBe('✎');
        expect(spellingSpec.perPage).toBe(18);
    });

    it('describes its word scope from the grade caps (short vs +tricky)', () => {
        expect(spellingSpec.scope(g1)).toBe('short words');
        expect(spellingSpec.scope(g2)).toBe('short & tricky words');
    });

    it('is gated by the grade catalogue (Year 1 and Year 2 only)', () => {
        expect(spellingSpec.offered(getGradeConfig(0))).toBe(false);
        expect(spellingSpec.offered(g1)).toBe(true);
        expect(spellingSpec.offered(g2)).toBe(true);
        expect(spellingSpec.offered(getGradeConfig(3))).toBe(false);
    });
});

// Semantic invariant: the answer is one of the three printed options.
function checkOptionsContainAnswer(grade: GradeConfig) {
    for (const p of sheet(grade)) {
        const m = p.prompt.match(/\(([^)]+)\)\s*$/);
        expect(m).not.toBeNull();
        const options = m![1].split(', ').map((s) => s.trim());
        expect(options).toContain(p.answer);
    }
}

describe('spelling — Year 1 (short words)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"id":1,"type":"spelling","prompt":"Which word is spelled correctly? (cubp, csup, cup)","answer":"cup"},
        {"id":2,"type":"spelling","prompt":"Which word is spelled correctly? (red, rend, rewd)","answer":"red"},
        {"id":3,"type":"spelling","prompt":"Which word is spelled correctly? (bus, bhus, bucs)","answer":"bus"},
        {"id":4,"type":"spelling","prompt":"Which word is spelled correctly? (lge, lbeg, leg)","answer":"leg"},
        {"id":5,"type":"spelling","prompt":"Which word is spelled correctly? (log, lolg, lofg)","answer":"log"},
        {"id":6,"type":"spelling","prompt":"Which word is spelled correctly? (pvig, pzig, pig)","answer":"pig"},
        {"id":7,"type":"spelling","prompt":"Which word is spelled correctly? (pvin, pin, plin)","answer":"pin"},
        {"id":8,"type":"spelling","prompt":"Which word is spelled correctly? (sun, sugn, sucn)","answer":"sun"},
        {"id":9,"type":"spelling","prompt":"Which word is spelled correctly? (night, nikght, nivght)","answer":"night"},
        {"id":10,"type":"spelling","prompt":"Which word is spelled correctly? (grasvs, grass, grasfs)","answer":"grass"},
        {"id":11,"type":"spelling","prompt":"Which word is spelled correctly? (purle, purpsle, purple)","answer":"purple"},
        {"id":12,"type":"spelling","prompt":"Which word is spelled correctly? (pecn, pevn, pen)","answer":"pen"},
        {"id":13,"type":"spelling","prompt":"Which word is spelled correctly? (wawter, wvater, water)","answer":"water"},
        {"id":14,"type":"spelling","prompt":"Which word is spelled correctly? (bevd, bed, berd)","answer":"bed"},
        {"id":15,"type":"spelling","prompt":"Which word is spelled correctly? (maap, mhap, map)","answer":"map"},
        {"id":16,"type":"spelling","prompt":"Which word is spelled correctly? (light, lignht, ltight)","answer":"light"},
        {"id":17,"type":"spelling","prompt":"Which word is spelled correctly? (bamg, bacg, bag)","answer":"bag"},
        {"id":18,"type":"spelling","prompt":"Which word is spelled correctly? (ficsh, finsh, fish)","answer":"fish"}
]);
        checkOptionsContainAnswer(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(spellingSpec, g1, seedFrom([1, 'spelling', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":19,"type":"spelling","prompt":"Which word is spelled correctly? (smhirt, shirt, shijrt)","answer":"shirt"},
        {"id":20,"type":"spelling","prompt":"Which word is spelled correctly? (rat, ramt, rhat)","answer":"rat"},
        {"id":21,"type":"spelling","prompt":"Which word is spelled correctly? (net, neft, nert)","answer":"net"}
]);
    });
});

describe('spelling — Year 2 (adds the tricky long words)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"spelling","prompt":"Which word is spelled correctly? (chicken, chicksen, chicsken)","answer":"chicken"},
        {"id":2,"type":"spelling","prompt":"Which word is spelled correctly? (lemon, lsemon, ljemon)","answer":"lemon"},
        {"id":3,"type":"spelling","prompt":"Which word is spelled correctly? (chocolsate, chocolate, chmocolate)","answer":"chocolate"},
        {"id":4,"type":"spelling","prompt":"Which word is spelled correctly? (shirt, sdhirt, sjhirt)","answer":"shirt"},
        {"id":5,"type":"spelling","prompt":"Which word is spelled correctly? (siip, ssip, sip)","answer":"sip"},
        {"id":6,"type":"spelling","prompt":"Which word is spelled correctly? (beauftiful, beautiful, beautigful)","answer":"beautiful"},
        {"id":7,"type":"spelling","prompt":"Which word is spelled correctly? (fan, fgan, fadn)","answer":"fan"},
        {"id":8,"type":"spelling","prompt":"Which word is spelled correctly? (cugp, cupp, cup)","answer":"cup"},
        {"id":9,"type":"spelling","prompt":"Which word is spelled correctly? (lseg, leg, lepg)","answer":"leg"},
        {"id":10,"type":"spelling","prompt":"Which word is spelled correctly? (grkeen, green, gren)","answer":"green"},
        {"id":11,"type":"spelling","prompt":"Which word is spelled correctly? (chair, chailr, chanir)","answer":"chair"},
        {"id":12,"type":"spelling","prompt":"Which word is spelled correctly? (hougse, ohuse, house)","answer":"house"},
        {"id":13,"type":"spelling","prompt":"Which word is spelled correctly? (mahp, mzap, map)","answer":"map"},
        {"id":14,"type":"spelling","prompt":"Which word is spelled correctly? (gardlen, garden, gwarden)","answer":"garden"},
        {"id":15,"type":"spelling","prompt":"Which word is spelled correctly? (tapble, table, tabrle)","answer":"table"},
        {"id":16,"type":"spelling","prompt":"Which word is spelled correctly? (pwen, pzen, pen)","answer":"pen"},
        {"id":17,"type":"spelling","prompt":"Which word is spelled correctly? (bpanana, banapna, banana)","answer":"banana"},
        {"id":18,"type":"spelling","prompt":"Which word is spelled correctly? (elephant, ehlephant, elephfant)","answer":"elephant"}
]);
        checkOptionsContainAnswer(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(spellingSpec, g2, seedFrom([2, 'spelling', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":19,"type":"spelling","prompt":"Which word is spelled correctly? (dbog, dlog, dog)","answer":"dog"},
        {"id":20,"type":"spelling","prompt":"Which word is spelled correctly? (trece, treve, tree)","answer":"tree"},
        {"id":21,"type":"spelling","prompt":"Which word is spelled correctly? (widnow, window, wintdow)","answer":"window"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(spellingSpec, getGradeConfig(3), seedFrom([3, 'spelling', 0]))).toEqual([]);
    });
});
