// Unit tests for the PLURALS worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm, pair banks, or caps
// change, these exact assertions fail — which is what we want, so a silent
// change to the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { pluralSpec } from './PluralsWorksheet';

const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(pluralSpec, grade, seedFrom([grade.id, pluralSpec.id, 0]));
}

describe('plural plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(pluralSpec.id).toBe('plural');
        expect(pluralSpec.label).toBe('Plurals');
        expect(pluralSpec.icon).toBe('s');
        expect(pluralSpec.perPage).toBe(24);
    });

    it('describes its pair scope from the grade caps (regular vs +irregular)', () => {
        expect(pluralSpec.scope(g1)).toBe('regular -s endings');
        expect(pluralSpec.scope(g2)).toBe('regular & irregular');
    });

    it('is gated by the grade catalogue (Year 1 and Year 2 only)', () => {
        expect(pluralSpec.offered(getGradeConfig(0))).toBe(false);
        expect(pluralSpec.offered(g1)).toBe(true);
        expect(pluralSpec.offered(g2)).toBe(true);
        expect(pluralSpec.offered(getGradeConfig(3))).toBe(false);
    });
});

describe('plural — Year 1 (regular -s/-es endings only)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"id":1,"type":"plural","prompt":"What is the singular of \"dogs\"?","answer":"dog"},
        {"id":2,"type":"plural","prompt":"What is the plural of \"cat\"?","answer":"cats"},
        {"id":3,"type":"plural","prompt":"What is the singular of \"doors\"?","answer":"door"},
        {"id":4,"type":"plural","prompt":"What is the plural of \"door\"?","answer":"doors"},
        {"id":5,"type":"plural","prompt":"What is the singular of \"maps\"?","answer":"map"},
        {"id":6,"type":"plural","prompt":"What is the plural of \"boat\"?","answer":"boats"},
        {"id":7,"type":"plural","prompt":"What is the singular of \"dogs\"?","answer":"dog"},
        {"id":8,"type":"plural","prompt":"What is the singular of \"pens\"?","answer":"pen"},
        {"id":9,"type":"plural","prompt":"What is the singular of \"cats\"?","answer":"cat"},
        {"id":10,"type":"plural","prompt":"What is the singular of \"buses\"?","answer":"bus"},
        {"id":11,"type":"plural","prompt":"What is the singular of \"dogs\"?","answer":"dog"},
        {"id":12,"type":"plural","prompt":"What is the singular of \"kids\"?","answer":"kid"},
        {"id":13,"type":"plural","prompt":"What is the singular of \"cats\"?","answer":"cat"},
        {"id":14,"type":"plural","prompt":"What is the plural of \"pig\"?","answer":"pigs"},
        {"id":15,"type":"plural","prompt":"What is the singular of \"watches\"?","answer":"watch"},
        {"id":16,"type":"plural","prompt":"What is the plural of \"pen\"?","answer":"pens"},
        {"id":17,"type":"plural","prompt":"What is the singular of \"doors\"?","answer":"door"},
        {"id":18,"type":"plural","prompt":"What is the singular of \"watches\"?","answer":"watch"},
        {"id":19,"type":"plural","prompt":"What is the plural of \"door\"?","answer":"doors"},
        {"id":20,"type":"plural","prompt":"What is the plural of \"bird\"?","answer":"birds"},
        {"id":21,"type":"plural","prompt":"What is the plural of \"pen\"?","answer":"pens"},
        {"id":22,"type":"plural","prompt":"What is the plural of \"dog\"?","answer":"dogs"},
        {"id":23,"type":"plural","prompt":"What is the singular of \"boats\"?","answer":"boat"},
        {"id":24,"type":"plural","prompt":"What is the plural of \"bus\"?","answer":"buses"}
]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(pluralSpec, g1, seedFrom([1, 'plural', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"plural","prompt":"What is the singular of \"maps\"?","answer":"map"},
        {"id":26,"type":"plural","prompt":"What is the plural of \"ball\"?","answer":"balls"},
        {"id":27,"type":"plural","prompt":"What is the singular of \"dogs\"?","answer":"dog"}
]);
    });
});

describe('plural — Year 2 (adds the irregular set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"plural","prompt":"What is the plural of \"boat\"?","answer":"boats"},
        {"id":2,"type":"plural","prompt":"What is the plural of \"kid\"?","answer":"kids"},
        {"id":3,"type":"plural","prompt":"What is the plural of \"tooth\"?","answer":"teeth"},
        {"id":4,"type":"plural","prompt":"What is the plural of \"bird\"?","answer":"birds"},
        {"id":5,"type":"plural","prompt":"What is the singular of \"pens\"?","answer":"pen"},
        {"id":6,"type":"plural","prompt":"What is the singular of \"people\"?","answer":"person"},
        {"id":7,"type":"plural","prompt":"What is the singular of \"geese\"?","answer":"goose"},
        {"id":8,"type":"plural","prompt":"What is the singular of \"boxes\"?","answer":"box"},
        {"id":9,"type":"plural","prompt":"What is the plural of \"cat\"?","answer":"cats"},
        {"id":10,"type":"plural","prompt":"What is the singular of \"stars\"?","answer":"star"},
        {"id":11,"type":"plural","prompt":"What is the singular of \"buses\"?","answer":"bus"},
        {"id":12,"type":"plural","prompt":"What is the plural of \"map\"?","answer":"maps"},
        {"id":13,"type":"plural","prompt":"What is the plural of \"star\"?","answer":"stars"},
        {"id":14,"type":"plural","prompt":"What is the plural of \"map\"?","answer":"maps"},
        {"id":15,"type":"plural","prompt":"What is the singular of \"birds\"?","answer":"bird"},
        {"id":16,"type":"plural","prompt":"What is the plural of \"door\"?","answer":"doors"},
        {"id":17,"type":"plural","prompt":"What is the singular of \"feet\"?","answer":"foot"},
        {"id":18,"type":"plural","prompt":"What is the singular of \"dogs\"?","answer":"dog"},
        {"id":19,"type":"plural","prompt":"What is the plural of \"foot\"?","answer":"feet"},
        {"id":20,"type":"plural","prompt":"What is the singular of \"buses\"?","answer":"bus"},
        {"id":21,"type":"plural","prompt":"What is the singular of \"pens\"?","answer":"pen"},
        {"id":22,"type":"plural","prompt":"What is the plural of \"ball\"?","answer":"balls"},
        {"id":23,"type":"plural","prompt":"What is the singular of \"pens\"?","answer":"pen"},
        {"id":24,"type":"plural","prompt":"What is the plural of \"pen\"?","answer":"pens"}
]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(pluralSpec, g2, seedFrom([2, 'plural', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"plural","prompt":"What is the singular of \"maps\"?","answer":"map"},
        {"id":26,"type":"plural","prompt":"What is the plural of \"mouse\"?","answer":"mice"},
        {"id":27,"type":"plural","prompt":"What is the plural of \"star\"?","answer":"stars"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(pluralSpec, getGradeConfig(3), seedFrom([3, 'plural', 0]))).toEqual([]);
    });
});
