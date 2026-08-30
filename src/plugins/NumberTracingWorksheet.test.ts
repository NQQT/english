// Unit tests for the NUMBER TRACING worksheet plugin.
//
// The tracing generators are ORDERED, not random: page 1 is 0–9 in counting
// order and every further page repeats the SAME ordered set, so the pins
// below are hand-computable without rolling any seed. These are the exact
// page-1 sheets (all rows) plus the page-3 restart pin.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { numberTraceSpec } from './NumberTracingWorksheet';

const g0 = getGradeConfig(0);
const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(numberTraceSpec, grade, seedFrom([grade.id, numberTraceSpec.id, 0]));
}

describe('numberTrace plugin — declarative spec', () => {
    it('declares its sidebar label, glyph, page size and single-column layout', () => {
        expect(numberTraceSpec.id).toBe('numberTrace');
        expect(numberTraceSpec.label).toBe('Number Tracing');
        expect(numberTraceSpec.icon).toBe('12');
        // 10 rows = exactly one 0–9 page.
        expect(numberTraceSpec.perPage).toBe(10);
        // Number rows print on long full-width writing lines — single-column.
        expect(numberTraceSpec.singleColumn).toBe(true);
    });

    it('describes its scope (0–9 number shapes)', () => {
        expect(numberTraceSpec.scope(g0)).toBe('0–9 number shapes');
    });

    it('is offered for Prep only (Y1/Y2 get reading tasks instead)', () => {
        expect(numberTraceSpec.offered(g0)).toBe(true);
        expect(numberTraceSpec.offered(g1)).toBe(false);
        expect(numberTraceSpec.offered(g2)).toBe(false);
        expect(numberTraceSpec.offered(getGradeConfig(3))).toBe(false);
        // Unoffered type => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(numberTraceSpec, g1, seedFrom([1, 'numberTrace', 0]))).toEqual([]);
        expect(generateSheet(numberTraceSpec, g2, seedFrom([2, 'numberTrace', 0]))).toEqual([]);
    });
});

describe('numberTrace — Prep (fixed ordered 0–9, no rng draws)', () => {
    it('matches the exact page-1 sheet (0–9, model + 3 faded copies)', () => {
        expect(sheet(g0)).toEqual([
        {"id":1,"type":"numberTrace","prompt":"Trace the number \"0\"","answer":"0","model":"0","trace":"0 0 0"},
        {"id":2,"type":"numberTrace","prompt":"Trace the number \"1\"","answer":"1","model":"1","trace":"1 1 1"},
        {"id":3,"type":"numberTrace","prompt":"Trace the number \"2\"","answer":"2","model":"2","trace":"2 2 2"},
        {"id":4,"type":"numberTrace","prompt":"Trace the number \"3\"","answer":"3","model":"3","trace":"3 3 3"},
        {"id":5,"type":"numberTrace","prompt":"Trace the number \"4\"","answer":"4","model":"4","trace":"4 4 4"},
        {"id":6,"type":"numberTrace","prompt":"Trace the number \"5\"","answer":"5","model":"5","trace":"5 5 5"},
        {"id":7,"type":"numberTrace","prompt":"Trace the number \"6\"","answer":"6","model":"6","trace":"6 6 6"},
        {"id":8,"type":"numberTrace","prompt":"Trace the number \"7\"","answer":"7","model":"7","trace":"7 7 7"},
        {"id":9,"type":"numberTrace","prompt":"Trace the number \"8\"","answer":"8","model":"8","trace":"8 8 8"},
        {"id":10,"type":"numberTrace","prompt":"Trace the number \"9\"","answer":"9","model":"9","trace":"9 9 9"}
]);
    });

    it('3-page documents restart the 0–9 stream with continuous ids', () => {
        const d = generateDocument(numberTraceSpec, g0, seedFrom([0, 'numberTrace', 0]), 3);
        expect(d.pages).toHaveLength(3);
        expect(d.total).toBe(30);
        // Third number page restarts the 0–9 stream at id 21.
        expect(d.pages[2][0]).toEqual({
            "id": 21,
            "type": "numberTrace",
            "prompt": "Trace the number \"0\"",
            "answer": "0",
            "model": "0",
            "trace": "0 0 0"
        });
    });

    // Semantic invariant: answer is a single digit; model = digit,
    // trace = 3 copies.
    it('every row is a single digit with model + 3 copies', () => {
        for (const p of sheet(g0)) {
            expect(/^[0-9]$/.test(p.answer)).toBe(true);
            expect(p.model).toBe(p.answer);
            expect(p.trace).toBe(`${p.answer} ${p.answer} ${p.answer}`);
        }
    });
});
