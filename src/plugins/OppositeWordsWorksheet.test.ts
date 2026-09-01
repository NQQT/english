// Unit tests for the OPPOSITE WORDS worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm, pair bank, or caps
// change, these exact assertions fail — which is what we want, so a silent
// change to the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { oppositeSpec } from './OppositeWordsWorksheet';

const g0 = getGradeConfig(0);
const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(oppositeSpec, grade, seedFrom([grade.id, oppositeSpec.id, 0]));
}

describe('opposite plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(oppositeSpec.id).toBe('opposite');
        expect(oppositeSpec.label).toBe('Opposite Words');
        expect(oppositeSpec.icon).toBe('⇄');
        expect(oppositeSpec.perPage).toBe(24);
    });

    it('describes its pair scope from the grade caps (starter vs common)', () => {
        expect(oppositeSpec.scope(g0)).toBe('starter opposites');
        expect(oppositeSpec.scope(g1)).toBe('common opposites');
        expect(oppositeSpec.scope(g2)).toBe('common opposites');
    });

    it('is gated by the grade catalogue (Year 1..6 offer it, Year 7 does not)', () => {
        expect(oppositeSpec.offered(g0)).toBe(false);
        expect(oppositeSpec.offered(g1)).toBe(true);
        expect(oppositeSpec.offered(g2)).toBe(true);
        expect(oppositeSpec.offered(getGradeConfig(3))).toBe(true);
        expect(oppositeSpec.offered(getGradeConfig(6))).toBe(true);
        expect(oppositeSpec.offered(getGradeConfig(7))).toBe(false);
        // Unoffered type => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(oppositeSpec, g0, seedFrom([0, 'opposite', 0]))).toEqual([]);
    });
});

describe('opposite — Year 1 (tier-2 common word set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"prompt":"What is the opposite of \"dry\"?","answer":"wet","id":1,"type":"opposite"},
        {"prompt":"Which word means the opposite of \"down\"? (lose, up, sour)","answer":"up","id":2,"type":"opposite"},
        {"prompt":"What is the opposite of \"big\"?","answer":"small","id":3,"type":"opposite"},
        {"prompt":"Which word means the opposite of \"take\"? (give, happy, strong)","answer":"give","id":4,"type":"opposite"},
        {"prompt":"What is the opposite of \"clean\"?","answer":"dirty","id":5,"type":"opposite"},
        {"prompt":"Which word means the opposite of \"laugh\"? (cry, empty, out)","answer":"cry","id":6,"type":"opposite"},
        {"prompt":"What is the opposite of \"long\"?","answer":"short","id":7,"type":"opposite"},
        {"prompt":"What is the opposite of \"pull\"?","answer":"push","id":8,"type":"opposite"},
        {"prompt":"Which word means the opposite of \"far\"? (last, long, near)","answer":"near","id":9,"type":"opposite"},
        {"prompt":"Which word means the opposite of \"go\"? (weak, come, shut)","answer":"come","id":10,"type":"opposite"},
        {"prompt":"What is the opposite of \"heavy\"?","answer":"light","id":11,"type":"opposite"},
        {"prompt":"Which word means the opposite of \"quiet\"? (happy, pull, loud)","answer":"loud","id":12,"type":"opposite"},
        {"prompt":"What is the opposite of \"night\"?","answer":"day","id":13,"type":"opposite"},
        {"prompt":"What is the opposite of \"fast\"?","answer":"slow","id":14,"type":"opposite"},
        {"prompt":"What is the opposite of \"lose\"?","answer":"win","id":15,"type":"opposite"},
        {"prompt":"Which word means the opposite of \"happy\"? (first, sad, lose)","answer":"sad","id":16,"type":"opposite"},
        {"prompt":"What is the opposite of \"empty\"?","answer":"full","id":17,"type":"opposite"},
        {"prompt":"What is the opposite of \"sour\"?","answer":"sweet","id":18,"type":"opposite"},
        {"prompt":"What is the opposite of \"below\"?","answer":"above","id":19,"type":"opposite"},
        {"prompt":"What is the opposite of \"new\"?","answer":"old","id":20,"type":"opposite"},
        {"prompt":"Which word means the opposite of \"weak\"? (strong, old, day)","answer":"strong","id":21,"type":"opposite"},
        {"prompt":"Which word means the opposite of \"front\"? (strong, big, back)","answer":"back","id":22,"type":"opposite"},
        {"prompt":"What is the opposite of \"open\"?","answer":"shut","id":23,"type":"opposite"},
        {"prompt":"What is the opposite of \"late\"?","answer":"early","id":24,"type":"opposite"},
        ]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(oppositeSpec, g1, seedFrom([1, 'opposite', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Which word means the opposite of \"hard\"? (sweet, easy, go)","answer":"easy","id":25,"type":"opposite"},
        {"prompt":"What is the opposite of \"hot\"?","answer":"cold","id":26,"type":"opposite"},
        {"prompt":"Which word means the opposite of \"over\"? (short, give, under)","answer":"under","id":27,"type":"opposite"},
        ]);
    });
});

describe('opposite — Year 2 (tricky set unused: same pair bank)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"prompt":"What is the opposite of \"come\"?","answer":"go","id":1,"type":"opposite"},
        {"prompt":"What is the opposite of \"push\"?","answer":"pull","id":2,"type":"opposite"},
        {"prompt":"What is the opposite of \"strong\"?","answer":"weak","id":3,"type":"opposite"},
        {"prompt":"Which word means the opposite of \"slow\"? (fast, sweet, back)","answer":"fast","id":4,"type":"opposite"},
        {"prompt":"Which word means the opposite of \"dirty\"? (back, last, clean)","answer":"clean","id":5,"type":"opposite"},
        {"prompt":"Which word means the opposite of \"over\"? (quiet, under, last)","answer":"under","id":6,"type":"opposite"},
        {"prompt":"What is the opposite of \"below\"?","answer":"above","id":7,"type":"opposite"},
        {"prompt":"Which word means the opposite of \"empty\"? (under, back, full)","answer":"full","id":8,"type":"opposite"},
        {"prompt":"Which word means the opposite of \"wet\"? (quiet, dry, give)","answer":"dry","id":9,"type":"opposite"},
        {"prompt":"Which word means the opposite of \"front\"? (old, empty, back)","answer":"back","id":10,"type":"opposite"},
        {"prompt":"What is the opposite of \"sad\"?","answer":"happy","id":11,"type":"opposite"},
        {"prompt":"Which word means the opposite of \"far\"? (near, under, go)","answer":"near","id":12,"type":"opposite"},
        {"prompt":"What is the opposite of \"heavy\"?","answer":"light","id":13,"type":"opposite"},
        {"prompt":"Which word means the opposite of \"old\"? (cold, new, lose)","answer":"new","id":14,"type":"opposite"},
        {"prompt":"What is the opposite of \"open\"?","answer":"shut","id":15,"type":"opposite"},
        {"prompt":"Which word means the opposite of \"cold\"? (big, dry, hot)","answer":"hot","id":16,"type":"opposite"},
        {"prompt":"What is the opposite of \"short\"?","answer":"long","id":17,"type":"opposite"},
        {"prompt":"What is the opposite of \"cry\"?","answer":"laugh","id":18,"type":"opposite"},
        {"prompt":"Which word means the opposite of \"up\"? (loud, above, down)","answer":"down","id":19,"type":"opposite"},
        {"prompt":"What is the opposite of \"day\"?","answer":"night","id":20,"type":"opposite"},
        {"prompt":"Which word means the opposite of \"lose\"? (win, above, big)","answer":"win","id":21,"type":"opposite"},
        {"prompt":"Which word means the opposite of \"in\"? (out, over, easy)","answer":"out","id":22,"type":"opposite"},
        {"prompt":"What is the opposite of \"first\"?","answer":"last","id":23,"type":"opposite"},
        {"prompt":"Which word means the opposite of \"early\"? (slow, late, out)","answer":"late","id":24,"type":"opposite"},
        ]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(oppositeSpec, g2, seedFrom([2, 'opposite', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Which word means the opposite of \"take\"? (long, far, give)","answer":"give","id":25,"type":"opposite"},
        {"prompt":"What is the opposite of \"sweet\"?","answer":"sour","id":26,"type":"opposite"},
        {"prompt":"What is the opposite of \"quiet\"?","answer":"loud","id":27,"type":"opposite"},
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(oppositeSpec, getGradeConfig(7), seedFrom([7, 'opposite', 0]))).toEqual([]);
    });
});
