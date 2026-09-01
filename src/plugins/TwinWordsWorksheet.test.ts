// Unit tests for the TWIN WORDS (HOMOPHONES) worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm, pair bank, or caps
// change, these exact assertions fail — which is what we want, so a silent
// change to the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { homophoneSpec } from './TwinWordsWorksheet';

const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(homophoneSpec, grade, seedFrom([grade.id, homophoneSpec.id, 0]));
}

describe('homophone plugin — declarative spec', () => {
    it('declares its sidebar label, glyph, page size and single-column layout', () => {
        expect(homophoneSpec.id).toBe('homophone');
        expect(homophoneSpec.label).toBe('Twin Words');
        expect(homophoneSpec.icon).toBe('2');
        expect(homophoneSpec.perPage).toBe(16);
        // Twin-word sentences are prose — single-column.
        expect(homophoneSpec.singleColumn).toBe(true);
    });

    it('describes its pair scope from the grade caps (basic vs tricky)', () => {
        expect(homophoneSpec.scope(g1)).toBe('basic pairs');
        expect(homophoneSpec.scope(g2)).toBe('basic & tricky pairs');
    });

    it('is gated by the grade catalogue (Year 1..6 offer it, Year 7 does not)', () => {
        expect(homophoneSpec.offered(getGradeConfig(0))).toBe(false);
        expect(homophoneSpec.offered(g1)).toBe(true);
        expect(homophoneSpec.offered(g2)).toBe(true);
        expect(homophoneSpec.offered(getGradeConfig(3))).toBe(true);
        expect(homophoneSpec.offered(getGradeConfig(6))).toBe(true);
        expect(homophoneSpec.offered(getGradeConfig(7))).toBe(false);
    });
});

// Semantic invariant: the answer is one of the two printed "(a or b)"
// options.
function checkOptionsContainAnswer(grade: GradeConfig) {
    for (const p of sheet(grade)) {
        const m = p.prompt.match(/\(([^)]+)\)\s*$/);
        expect(m).not.toBeNull();
        const options = m![1].split(' or ').map((s) => s.trim());
        expect(options).toContain(p.answer);
    }
}

describe('homophone — Year 1 (basic pairs only)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"prompt":"I am __ years old. (eight or ate)","answer":"eight","id":1,"type":"homophone"},
        {"prompt":"Put the pencil __ . (their or there)","answer":"there","id":2,"type":"homophone"},
        {"prompt":"I want __ go to the park. (too or to)","answer":"to","id":3,"type":"homophone"},
        {"prompt":"We will __ at the park gate. (meet or meat)","answer":"meet","id":4,"type":"homophone"},
        {"prompt":"The sky is __ . (blew or blue)","answer":"blue","id":5,"type":"homophone"},
        {"prompt":"The dog wagged its __ . (tail or tale)","answer":"tail","id":6,"type":"homophone"},
        {"prompt":"I go to school every __ . (week or weak)","answer":"week","id":7,"type":"homophone"},
        {"prompt":"The __ makes honey. (be or bee)","answer":"bee","id":8,"type":"homophone"},
        {"prompt":"I have __ apples. (to or two)","answer":"two","id":9,"type":"homophone"},
        {"prompt":"There are __ cookies left. (no or know)","answer":"no","id":10,"type":"homophone"},
        {"prompt":"The dog is over __ . (their or there)","answer":"there","id":11,"type":"homophone"},
        {"prompt":"__ late! I am sorry. (To or Too)","answer":"Too","id":12,"type":"homophone"},
        {"prompt":"Turn __ at the shop. (write or right)","answer":"right","id":13,"type":"homophone"},
        {"prompt":"I __ all the answers. (knew or new)","answer":"knew","id":14,"type":"homophone"},
        {"prompt":"I have a __ pencil case. (new or knew)","answer":"new","id":15,"type":"homophone"},
        {"prompt":"The boat sails on the __ . (see or sea)","answer":"sea","id":16,"type":"homophone"},
        ]);
        checkOptionsContainAnswer(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(homophoneSpec, g1, seedFrom([1, 'homophone', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"I will __ my name. (right or write)","answer":"write","id":17,"type":"homophone"},
        {"prompt":"The __ is very bright. (sun or son)","answer":"sun","id":18,"type":"homophone"},
        {"prompt":"The wind __ the door open. (blue or blew)","answer":"blew","id":19,"type":"homophone"},
        ]);
    });
});

describe('homophone — Year 2 (adds the tricky pairs)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"prompt":"My mum is very __ to me. (dear or deer)","answer":"dear","id":1,"type":"homophone"},
        {"prompt":"I have a __ pencil case. (new or knew)","answer":"new","id":2,"type":"homophone"},
        {"prompt":"Is that __ book? (you're or your)","answer":"your","id":3,"type":"homophone"},
        {"prompt":"Did you __ that noise? (here or hear)","answer":"hear","id":4,"type":"homophone"},
        {"prompt":"Her __ loves trucks. (son or sun)","answer":"son","id":5,"type":"homophone"},
        {"prompt":"I have __ crayons. (four or for)","answer":"four","id":6,"type":"homophone"},
        {"prompt":"Please sit __ me. (buy or by)","answer":"by","id":7,"type":"homophone"},
        {"prompt":"The wind __ the door open. (blue or blew)","answer":"blew","id":8,"type":"homophone"},
        {"prompt":"I want __ go to the park. (too or to)","answer":"to","id":9,"type":"homophone"},
        {"prompt":"The cat licked __ paw. (it's or its)","answer":"its","id":10,"type":"homophone"},
        {"prompt":"I saw a __ in the woods. (deer or dear)","answer":"deer","id":11,"type":"homophone"},
        {"prompt":"This gift is __ you. (for or four)","answer":"for","id":12,"type":"homophone"},
        {"prompt":"I will __ my warm coat. (wear or where)","answer":"wear","id":13,"type":"homophone"},
        {"prompt":"The __ flew over the hills. (plane or plain)","answer":"plane","id":14,"type":"homophone"},
        {"prompt":"Turn __ at the shop. (write or right)","answer":"right","id":15,"type":"homophone"},
        {"prompt":"There are __ cookies left. (no or know)","answer":"no","id":16,"type":"homophone"},
        ]);
        checkOptionsContainAnswer(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(homophoneSpec, g2, seedFrom([2, 'homophone', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"I have __ apples. (to or two)","answer":"two","id":17,"type":"homophone"},
        {"prompt":"Can I __ a treat? (buy or by)","answer":"buy","id":18,"type":"homophone"},
        {"prompt":"The __ is very bright. (sun or son)","answer":"sun","id":19,"type":"homophone"},
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(homophoneSpec, getGradeConfig(7), seedFrom([7, 'homophone', 0]))).toEqual([]);
    });
});
