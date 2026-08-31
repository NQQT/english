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
        {"id":1,"type":"plural","prompt":"What is the singular of \"birds\"? (bird, kids, buses)","answer":"bird"},
        {"id":2,"type":"plural","prompt":"What is the plural of \"leg\"? (nets, legs, watches)","answer":"legs"},
        {"id":3,"type":"plural","prompt":"What is the singular of \"cats\"?","answer":"cat"},
        {"id":4,"type":"plural","prompt":"What is the plural of \"door\"?","answer":"doors"},
        {"id":5,"type":"plural","prompt":"What is the singular of \"frogs\"?","answer":"frog"},
        {"id":6,"type":"plural","prompt":"What is the plural of \"moon\"?","answer":"moons"},
        {"id":7,"type":"plural","prompt":"What is the singular of \"trees\"? (tree, balls, boats)","answer":"tree"},
        {"id":8,"type":"plural","prompt":"What is the plural of \"cup\"?","answer":"cups"},
        {"id":9,"type":"plural","prompt":"What is the singular of \"pigs\"? (jams, wigs, pig)","answer":"pig"},
        {"id":10,"type":"plural","prompt":"What is the plural of \"bus\"? (buses, tree, hats)","answer":"buses"},
        {"id":11,"type":"plural","prompt":"What is the singular of \"stars\"? (doors, star, pot)","answer":"star"},
        {"id":12,"type":"plural","prompt":"What is the plural of \"map\"?","answer":"maps"},
        {"id":13,"type":"plural","prompt":"What is the singular of \"dogs\"? (fans, dog, box)","answer":"dog"},
        {"id":14,"type":"plural","prompt":"What is the plural of \"boat\"? (boats, moon, tops)","answer":"boats"},
        {"id":15,"type":"plural","prompt":"What is the singular of \"pens\"?","answer":"pen"},
        {"id":16,"type":"plural","prompt":"What is the plural of \"jam\"? (jams, buses, wig)","answer":"jams"},
        {"id":17,"type":"plural","prompt":"What is the singular of \"logs\"? (log, hat, balls)","answer":"log"},
        {"id":18,"type":"plural","prompt":"What is the plural of \"hat\"?","answer":"hats"},
        {"id":19,"type":"plural","prompt":"What is the singular of \"balls\"?","answer":"ball"},
        {"id":20,"type":"plural","prompt":"What is the plural of \"fan\"?","answer":"fans"},
        {"id":21,"type":"plural","prompt":"What is the singular of \"bags\"?","answer":"bag"},
        {"id":22,"type":"plural","prompt":"What is the plural of \"net\"?","answer":"nets"},
        {"id":23,"type":"plural","prompt":"What is the singular of \"tops\"?","answer":"top"},
        {"id":24,"type":"plural","prompt":"What is the plural of \"book\"? (books, frogs, map)","answer":"books"}
]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(pluralSpec, g1, seedFrom([1, 'plural', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"plural","prompt":"What is the singular of \"boxes\"?","answer":"box"},
        {"id":26,"type":"plural","prompt":"What is the plural of \"kid\"? (net, nets, kids)","answer":"kids"},
        {"id":27,"type":"plural","prompt":"What is the singular of \"watches\"? (dog, log, watch)","answer":"watch"}
]);
    });
});

describe('plural — Year 2 (adds the irregular set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"plural","prompt":"What is the plural of \"bus\"?","answer":"buses"},
        {"id":2,"type":"plural","prompt":"What is the singular of \"doors\"? (foot, door, balls)","answer":"door"},
        {"id":3,"type":"plural","prompt":"What is the plural of \"cup\"? (cups, ball, balls)","answer":"cups"},
        {"id":4,"type":"plural","prompt":"What is the singular of \"geese\"?","answer":"goose"},
        {"id":5,"type":"plural","prompt":"What is the plural of \"log\"?","answer":"logs"},
        {"id":6,"type":"plural","prompt":"What is the singular of \"pigs\"? (star, pig, pots)","answer":"pig"},
        {"id":7,"type":"plural","prompt":"What is the plural of \"map\"? (child, maps, hat)","answer":"maps"},
        {"id":8,"type":"plural","prompt":"What is the singular of \"people\"? (person, net, men)","answer":"person"},
        {"id":9,"type":"plural","prompt":"What is the plural of \"boat\"? (tooth, boats, mouse)","answer":"boats"},
        {"id":10,"type":"plural","prompt":"What is the singular of \"nets\"?","answer":"net"},
        {"id":11,"type":"plural","prompt":"What is the plural of \"tooth\"?","answer":"teeth"},
        {"id":12,"type":"plural","prompt":"What is the singular of \"tops\"? (top, wig, log)","answer":"top"},
        {"id":13,"type":"plural","prompt":"What is the plural of \"leg\"? (boats, star, legs)","answer":"legs"},
        {"id":14,"type":"plural","prompt":"What is the singular of \"jams\"?","answer":"jam"},
        {"id":15,"type":"plural","prompt":"What is the plural of \"box\"? (boxes, wig, boat)","answer":"boxes"},
        {"id":16,"type":"plural","prompt":"What is the singular of \"hats\"?","answer":"hat"},
        {"id":17,"type":"plural","prompt":"What is the plural of \"cat\"? (bird, cats, birds)","answer":"cats"},
        {"id":18,"type":"plural","prompt":"What is the singular of \"dogs\"?","answer":"dog"},
        {"id":19,"type":"plural","prompt":"What is the plural of \"ball\"?","answer":"balls"},
        {"id":20,"type":"plural","prompt":"What is the singular of \"watches\"?","answer":"watch"},
        {"id":21,"type":"plural","prompt":"What is the plural of \"frog\"? (child, stars, frogs)","answer":"frogs"},
        {"id":22,"type":"plural","prompt":"What is the singular of \"oxen\"?","answer":"ox"},
        {"id":23,"type":"plural","prompt":"What is the plural of \"bird\"? (birds, pot, woman)","answer":"birds"},
        {"id":24,"type":"plural","prompt":"What is the singular of \"women\"?","answer":"woman"}
]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(pluralSpec, g2, seedFrom([2, 'plural', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"plural","prompt":"What is the plural of \"tree\"? (boat, box, trees)","answer":"trees"},
        {"id":26,"type":"plural","prompt":"What is the singular of \"pots\"? (bags, pot, fan)","answer":"pot"},
        {"id":27,"type":"plural","prompt":"What is the plural of \"kid\"? (kid, pen, kids)","answer":"kids"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(pluralSpec, getGradeConfig(3), seedFrom([3, 'plural', 0]))).toEqual([]);
    });
});
