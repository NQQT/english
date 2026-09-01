// Unit tests for the COMMA LISTS worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm or list themes change,
// these exact assertions fail — which is what we want, so a silent change to
// the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { commaSpec } from './CommaListWorksheet';

const g3 = getGradeConfig(3);
const g6 = getGradeConfig(6);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(commaSpec, grade, seedFrom([grade.id, commaSpec.id, 0]));
}

describe('comma plugin — declarative spec', () => {
    it('declares its sidebar label, glyph, page size and single-column layout', () => {
        expect(commaSpec.id).toBe('comma');
        expect(commaSpec.label).toBe('Comma Lists');
        expect(commaSpec.icon).toBe(',');
        expect(commaSpec.perPage).toBe(16);
        // Prose lines run single-column.
        expect(commaSpec.singleColumn).toBe(true);
    });

    it('describes its scope (commas in lists)', () => {
        expect(commaSpec.scope(g3)).toBe('commas in lists');
        expect(commaSpec.scope(g6)).toBe('commas in lists');
    });

    it('is gated by the grade catalogue (Years 3..6 only)', () => {
        expect(commaSpec.offered(getGradeConfig(0))).toBe(false);
        expect(commaSpec.offered(getGradeConfig(1))).toBe(false);
        expect(commaSpec.offered(getGradeConfig(2))).toBe(false);
        expect(commaSpec.offered(g3)).toBe(true);
        expect(commaSpec.offered(g6)).toBe(true);
        expect(commaSpec.offered(getGradeConfig(7))).toBe(false);
        // Unoffered grades => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(commaSpec, getGradeConfig(2), seedFrom([2, 'comma', 0]))).toEqual([]);
    });
});

describe('comma — Year 3', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g3)).toEqual([
        {"prompt":"Rewrite with commas: My favourite sports are cricket swimming netball.","answer":"my favourite sports are cricket, swimming, netball","id":1,"type":"comma"},
        {"prompt":"Which list uses commas correctly? (counting, singing and dancing / counting, and singing, and dancing / counting singing dancing)","answer":"counting, singing and dancing","id":2,"type":"comma"},
        {"prompt":"How many items are in this list? spelling, counting, singing","answer":"3","id":3,"type":"comma"},
        {"prompt":"How many items are in this list? reading, writing, spelling, counting","answer":"4","id":4,"type":"comma"},
        {"prompt":"Which list uses commas correctly? (emus possums platypuses / emus, possums and platypuses / emus, and possums, and platypuses)","answer":"emus, possums and platypuses","id":5,"type":"comma"},
        {"prompt":"Rewrite with commas: For lunch I packed apples bananas pears grapes.","answer":"for lunch i packed apples, bananas, pears, grapes","id":6,"type":"comma"},
        {"prompt":"Which list uses commas correctly? (reading, and writing, and spelling / reading writing spelling / reading, writing and spelling)","answer":"reading, writing and spelling","id":7,"type":"comma"},
        {"prompt":"How many items are in this list? kangaroos, koalas, wombats, emus, possums","answer":"5","id":8,"type":"comma"},
        {"prompt":"Which list uses commas correctly? (bananas, pears, grapes, oranges and mangoes / bananas, and pears, and grapes, and oranges, and mangoes / bananas pears grapes oranges mangoes)","answer":"bananas, pears, grapes, oranges and mangoes","id":9,"type":"comma"},
        {"prompt":"Rewrite with commas: At the zoo we saw kangaroos koalas wombats emus.","answer":"at the zoo we saw kangaroos, koalas, wombats, emus","id":10,"type":"comma"},
        {"prompt":"Rewrite with commas: On our holiday we visited Sydney Brisbane Perth Adelaide.","answer":"on our holiday we visited Sydney, Brisbane, Perth, Adelaide","id":11,"type":"comma"},
        {"prompt":"Rewrite with commas: In my school bag I keep erasers paintbrushes scissors.","answer":"in my school bag i keep erasers, paintbrushes, scissors","id":12,"type":"comma"},
        {"prompt":"Which list uses commas correctly? (wombats emus possums / wombats, emus and possums / wombats, and emus, and possums)","answer":"wombats, emus and possums","id":13,"type":"comma"},
        {"prompt":"Rewrite with commas: My favourite sports are cricket swimming netball soccer.","answer":"my favourite sports are cricket, swimming, netball, soccer","id":14,"type":"comma"},
        {"prompt":"Which list uses commas correctly? (swimming, netball, soccer, athletics and tennis / swimming, and netball, and soccer, and athletics, and tennis / swimming netball soccer athletics tennis)","answer":"swimming, netball, soccer, athletics and tennis","id":15,"type":"comma"},
        {"prompt":"Which list uses commas correctly? (rulers, and erasers, and paintbrushes, and scissors / rulers, erasers, paintbrushes and scissors / rulers erasers paintbrushes scissors)","answer":"rulers, erasers, paintbrushes and scissors","id":16,"type":"comma"}
        ]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(commaSpec, g3, seedFrom([3, 'comma', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"How many items are in this list? rulers, erasers, paintbrushes, scissors, gluesticks","answer":"5","id":17,"type":"comma"},
        {"prompt":"Rewrite with commas: In the garden we planted writing spelling counting.","answer":"in the garden we planted writing, spelling, counting","id":18,"type":"comma"},
        {"prompt":"Rewrite with commas: At the zoo we saw wombats emus possums.","answer":"at the zoo we saw wombats, emus, possums","id":19,"type":"comma"}
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(commaSpec, getGradeConfig(7), seedFrom([7, 'comma', 0]))).toEqual([]);
    });
});

describe('comma — Year 6', () => {
    it('matches the exact page-1 head (grade 6 rolls its own stream)', () => {
        expect(sheet(g6).slice(0, 5)).toEqual([
        {"prompt":"Which list uses commas correctly? (pears, grapes and oranges / pears grapes oranges / pears, and grapes, and oranges)","answer":"pears, grapes and oranges","id":1,"type":"comma"},
        {"prompt":"Which list uses commas correctly? (reading writing spelling / reading, and writing, and spelling / reading, writing and spelling)","answer":"reading, writing and spelling","id":2,"type":"comma"},
        {"prompt":"How many items are in this list? Sydney, Brisbane, Perth","answer":"3","id":3,"type":"comma"},
        {"prompt":"Which list uses commas correctly? (writing, spelling, counting and singing / writing, and spelling, and counting, and singing / writing spelling counting singing)","answer":"writing, spelling, counting and singing","id":4,"type":"comma"},
        {"prompt":"Rewrite with commas: In the garden we planted reading writing spelling counting.","answer":"in the garden we planted reading, writing, spelling, counting","id":5,"type":"comma"}
        ]);
    });
});
