// Unit tests for the COMPOUND WORDS worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm or compound bank
// changes, these exact assertions fail — which is what we want, so a silent
// change to the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { compoundSpec } from './CompoundWorksheet';

const g3 = getGradeConfig(3);
const g6 = getGradeConfig(6);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(compoundSpec, grade, seedFrom([grade.id, compoundSpec.id, 0]));
}

describe('compound plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(compoundSpec.id).toBe('compound');
        expect(compoundSpec.label).toBe('Compound Words');
        expect(compoundSpec.icon).toBe('⚓');
        expect(compoundSpec.perPage).toBe(18);
    });

    it('describes its scope (two words, one word)', () => {
        expect(compoundSpec.scope(g3)).toBe('two words, one word');
        expect(compoundSpec.scope(g6)).toBe('two words, one word');
    });

    it('is gated by the grade catalogue (Years 3..6 only)', () => {
        expect(compoundSpec.offered(getGradeConfig(0))).toBe(false);
        expect(compoundSpec.offered(getGradeConfig(1))).toBe(false);
        expect(compoundSpec.offered(getGradeConfig(2))).toBe(false);
        expect(compoundSpec.offered(g3)).toBe(true);
        expect(compoundSpec.offered(g6)).toBe(true);
        expect(compoundSpec.offered(getGradeConfig(7))).toBe(false);
        // Unoffered grades => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(compoundSpec, getGradeConfig(2), seedFrom([2, 'compound', 0]))).toEqual([]);
    });
});

describe('compound — Year 3', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g3)).toEqual([
        {"prompt":"Which one is a real compound word? (hairbrush, buttermower, everyboard)","answer":"hairbrush","id":1,"type":"compound"},
        {"prompt":"Join into one word: star + fish","answer":"starfish","id":2,"type":"compound"},
        {"prompt":"Which word is made from \"water\" and \"fall\"? (sunpost, waterfall, bedroomdishwasher)","answer":"waterfall","id":3,"type":"compound"},
        {"prompt":"Which one is a real compound word? (somethingfall, everyone, manblack)","answer":"everyone","id":4,"type":"compound"},
        {"prompt":"Join into one word: cup + cake","answer":"cupcake","id":5,"type":"compound"},
        {"prompt":"Which word is made from \"play\" and \"ground\"? (butterflyflower, playground, dayground)","answer":"playground","id":6,"type":"compound"},
        {"prompt":"Which one is a real compound word? (keybow, outside, shellrain)","answer":"outside","id":7,"type":"compound"},
        {"prompt":"Which two words make up \"lawnmower\"?","answer":"lawn + mower","id":8,"type":"compound"},
        {"prompt":"Which word is made from \"butter\" and \"fly\"? (flowershop, butterfly, snowsomething)","answer":"butterfly","id":9,"type":"compound"},
        {"prompt":"Join into one word: dish + washer","answer":"dishwasher","id":10,"type":"compound"},
        {"prompt":"Which one is a real compound word? (blackgrandparent, mowernotebook, football)","answer":"football","id":11,"type":"compound"},
        {"prompt":"Which two words make up \"underground\"?","answer":"under + ground","id":12,"type":"compound"},
        {"prompt":"Which word is made from \"tree\" and \"house\"? (shelldishwasher, seashellbed, treehouse)","answer":"treehouse","id":13,"type":"compound"},
        {"prompt":"Join into one word: key + board","answer":"keyboard","id":14,"type":"compound"},
        {"prompt":"Which word is made from \"birth\" and \"day\"? (blackboardbutter, underkeyboard, birthday)","answer":"birthday","id":15,"type":"compound"},
        {"prompt":"Which word is made from \"note\" and \"book\"? (lampwater, hairlamp, notebook)","answer":"notebook","id":16,"type":"compound"},
        {"prompt":"Which word is made from \"day\" and \"dream\"? (daydream, brushsomething, treehousewaterfall)","answer":"daydream","id":17,"type":"compound"},
        {"prompt":"Join into one word: wind + mill","answer":"windmill","id":18,"type":"compound"}
        ]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(compoundSpec, g3, seedFrom([3, 'compound', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Which two words make up \"toothbrush\"?","answer":"tooth + brush","id":19,"type":"compound"},
        {"prompt":"Which two words make up \"bedroom\"?","answer":"bed + room","id":20,"type":"compound"},
        {"prompt":"Which one is a real compound word? (shellsandpit, lawnpost, sunflower)","answer":"sunflower","id":21,"type":"compound"}
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(compoundSpec, getGradeConfig(7), seedFrom([7, 'compound', 0]))).toEqual([]);
    });
});

describe('compound — Year 6', () => {
    it('matches the exact page-1 head (grade 6 rolls its own stream)', () => {
        expect(sheet(g6).slice(0, 5)).toEqual([
        {"prompt":"Join into one word: under + ground","answer":"underground","id":1,"type":"compound"},
        {"prompt":"Join into one word: day + dream","answer":"daydream","id":2,"type":"compound"},
        {"prompt":"Join into one word: sand + pit","answer":"sandpit","id":3,"type":"compound"},
        {"prompt":"Which word is made from \"star\" and \"fish\"? (cupcakekey, seacake, starfish)","answer":"starfish","id":4,"type":"compound"},
        {"prompt":"Which two words make up \"windmill\"?","answer":"wind + mill","id":5,"type":"compound"}
        ]);
    });
});
