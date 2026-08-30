// Unit tests for the WORD TRACING worksheet plugin.
//
// The tracing generators are ORDERED, not random: page 1 is the A–Z
// beginning-word set in writing order and every further page repeats the SAME
// ordered set, so the pins below are hand-computable without rolling any
// seed. These are the exact page-1 sheets (all rows) plus the page-2
// continuation head.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { wordTraceSpec } from './WordTracingWorksheet';
import { KNOWN_WORD_SET } from './words';

const g0 = getGradeConfig(0);
const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(wordTraceSpec, grade, seedFrom([grade.id, wordTraceSpec.id, 0]));
}

describe('wordTrace plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(wordTraceSpec.id).toBe('wordTrace');
        expect(wordTraceSpec.label).toBe('Word Tracing');
        expect(wordTraceSpec.icon).toBe('a');
        // 26 rows = exactly one A–Z beginning-word page (two-column grid).
        expect(wordTraceSpec.perPage).toBe(26);
    });

    it('describes its scope (A–Z beginning words)', () => {
        expect(wordTraceSpec.scope(g0)).toBe('A–Z beginning words');
    });

    it('is offered for Prep only (Y1/Y2 get reading tasks instead)', () => {
        expect(wordTraceSpec.offered(g0)).toBe(true);
        expect(wordTraceSpec.offered(g1)).toBe(false);
        expect(wordTraceSpec.offered(g2)).toBe(false);
        expect(wordTraceSpec.offered(getGradeConfig(3))).toBe(false);
        // Unoffered type => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(wordTraceSpec, g1, seedFrom([1, 'wordTrace', 0]))).toEqual([]);
        expect(generateSheet(wordTraceSpec, g2, seedFrom([2, 'wordTrace', 0]))).toEqual([]);
    });
});

describe('wordTrace — Prep (fixed ordered A–Z words, no rng draws)', () => {
    it('matches the exact page-1 sheet (letter model + beginning word)', () => {
        expect(sheet(g0)).toEqual([
        {"id":1,"type":"wordTrace","prompt":"Trace the word \"apple\" (begins with \"A\")","answer":"apple","model":"A","trace":"apple"},
        {"id":2,"type":"wordTrace","prompt":"Trace the word \"bird\" (begins with \"B\")","answer":"bird","model":"B","trace":"bird"},
        {"id":3,"type":"wordTrace","prompt":"Trace the word \"cat\" (begins with \"C\")","answer":"cat","model":"C","trace":"cat"},
        {"id":4,"type":"wordTrace","prompt":"Trace the word \"dog\" (begins with \"D\")","answer":"dog","model":"D","trace":"dog"},
        {"id":5,"type":"wordTrace","prompt":"Trace the word \"eat\" (begins with \"E\")","answer":"eat","model":"E","trace":"eat"},
        {"id":6,"type":"wordTrace","prompt":"Trace the word \"fish\" (begins with \"F\")","answer":"fish","model":"F","trace":"fish"},
        {"id":7,"type":"wordTrace","prompt":"Trace the word \"go\" (begins with \"G\")","answer":"go","model":"G","trace":"go"},
        {"id":8,"type":"wordTrace","prompt":"Trace the word \"hat\" (begins with \"H\")","answer":"hat","model":"H","trace":"hat"},
        {"id":9,"type":"wordTrace","prompt":"Trace the word \"in\" (begins with \"I\")","answer":"in","model":"I","trace":"in"},
        {"id":10,"type":"wordTrace","prompt":"Trace the word \"jam\" (begins with \"J\")","answer":"jam","model":"J","trace":"jam"},
        {"id":11,"type":"wordTrace","prompt":"Trace the word \"kick\" (begins with \"K\")","answer":"kick","model":"K","trace":"kick"},
        {"id":12,"type":"wordTrace","prompt":"Trace the word \"leg\" (begins with \"L\")","answer":"leg","model":"L","trace":"leg"},
        {"id":13,"type":"wordTrace","prompt":"Trace the word \"map\" (begins with \"M\")","answer":"map","model":"M","trace":"map"},
        {"id":14,"type":"wordTrace","prompt":"Trace the word \"net\" (begins with \"N\")","answer":"net","model":"N","trace":"net"},
        {"id":15,"type":"wordTrace","prompt":"Trace the word \"open\" (begins with \"O\")","answer":"open","model":"O","trace":"open"},
        {"id":16,"type":"wordTrace","prompt":"Trace the word \"pen\" (begins with \"P\")","answer":"pen","model":"P","trace":"pen"},
        {"id":17,"type":"wordTrace","prompt":"Trace the word \"queen\" (begins with \"Q\")","answer":"queen","model":"Q","trace":"queen"},
        {"id":18,"type":"wordTrace","prompt":"Trace the word \"rat\" (begins with \"R\")","answer":"rat","model":"R","trace":"rat"},
        {"id":19,"type":"wordTrace","prompt":"Trace the word \"sun\" (begins with \"S\")","answer":"sun","model":"S","trace":"sun"},
        {"id":20,"type":"wordTrace","prompt":"Trace the word \"top\" (begins with \"T\")","answer":"top","model":"T","trace":"top"},
        {"id":21,"type":"wordTrace","prompt":"Trace the word \"up\" (begins with \"U\")","answer":"up","model":"U","trace":"up"},
        {"id":22,"type":"wordTrace","prompt":"Trace the word \"van\" (begins with \"V\")","answer":"van","model":"V","trace":"van"},
        {"id":23,"type":"wordTrace","prompt":"Trace the word \"water\" (begins with \"W\")","answer":"water","model":"W","trace":"water"},
        {"id":24,"type":"wordTrace","prompt":"Trace the word \"xylophone\" (begins with \"X\")","answer":"xylophone","model":"X","trace":"xylophone"},
        {"id":25,"type":"wordTrace","prompt":"Trace the word \"yellow\" (begins with \"Y\")","answer":"yellow","model":"Y","trace":"yellow"},
        {"id":26,"type":"wordTrace","prompt":"Trace the word \"zoo\" (begins with \"Z\")","answer":"zoo","model":"Z","trace":"zoo"}
]);
    });

    it('page 2 repeats the A–Z word stream from the top (ids continue at 27)', () => {
        expect(generateDocument(wordTraceSpec, g0, seedFrom([0, 'wordTrace', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":27,"type":"wordTrace","prompt":"Trace the word \"apple\" (begins with \"A\")","answer":"apple","model":"A","trace":"apple"},
        {"id":28,"type":"wordTrace","prompt":"Trace the word \"bird\" (begins with \"B\")","answer":"bird","model":"B","trace":"bird"},
        {"id":29,"type":"wordTrace","prompt":"Trace the word \"cat\" (begins with \"C\")","answer":"cat","model":"C","trace":"cat"}
]);
    });

    // Semantic invariants: the trace target IS the word (the answer), the
    // model is its capital first letter, and every traced word is a real,
    // known word (Prep bank — see KNOWN_WORD_SET in words.ts).
    it('every row traces a real word with the right model letter', () => {
        for (const p of sheet(g0)) {
            expect(p.trace).toBe(p.answer);
            expect(p.model).toBe(p.answer[0].toUpperCase());
            expect(KNOWN_WORD_SET.has(p.answer)).toBe(true);
        }
    });
});
