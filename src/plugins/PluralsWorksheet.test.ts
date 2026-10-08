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

    it('is gated by the grade catalogue (Year 1..6 offer it, Year 7 does not)', () => {
        expect(pluralSpec.offered(getGradeConfig(0))).toBe(false);
        expect(pluralSpec.offered(g1)).toBe(true);
        expect(pluralSpec.offered(g2)).toBe(true);
        expect(pluralSpec.offered(getGradeConfig(3))).toBe(true);
        expect(pluralSpec.offered(getGradeConfig(6))).toBe(true);
        expect(pluralSpec.offered(getGradeConfig(7))).toBe(false);
    });
});

describe('plural — Year 1 (regular -s/-es endings only)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"prompt":"What is the singular of \"birds\"? (bird, kids, buses)","answer":"bird","visual":"bird","visualCount":3,"id":1,"type":"plural"},
        {"prompt":"What is the plural of \"leg\"? (nets, legs, watches)","answer":"legs","visualCount":1,"id":2,"type":"plural"},
        {"prompt":"What is the singular of \"cats\"?","answer":"cat","visual":"cat","visualCount":3,"id":3,"type":"plural"},
        {"prompt":"What is the plural of \"door\"?","answer":"doors","visual":"door","visualCount":1,"id":4,"type":"plural"},
        {"prompt":"What is the singular of \"frogs\"?","answer":"frog","visual":"frog","visualCount":3,"id":5,"type":"plural"},
        {"prompt":"What is the plural of \"moon\"?","answer":"moons","visual":"moon","visualCount":1,"id":6,"type":"plural"},
        {"prompt":"What is the singular of \"trees\"? (tree, balls, boats)","answer":"tree","visual":"tree","visualCount":3,"id":7,"type":"plural"},
        {"prompt":"What is the plural of \"cup\"?","answer":"cups","visual":"cup","visualCount":1,"id":8,"type":"plural"},
        {"prompt":"What is the singular of \"pigs\"? (jams, wigs, pig)","answer":"pig","visual":"pig","visualCount":3,"id":9,"type":"plural"},
        {"prompt":"What is the plural of \"bus\"? (buses, tree, hats)","answer":"buses","visual":"bus","visualCount":1,"id":10,"type":"plural"},
        {"prompt":"What is the singular of \"stars\"? (doors, star, pot)","answer":"star","visual":"star","visualCount":3,"id":11,"type":"plural"},
        {"prompt":"What is the plural of \"map\"?","answer":"maps","visual":"map","visualCount":1,"id":12,"type":"plural"},
        {"prompt":"What is the singular of \"dogs\"? (fans, dog, box)","answer":"dog","visual":"dog","visualCount":3,"id":13,"type":"plural"},
        {"prompt":"What is the plural of \"boat\"? (boats, moon, tops)","answer":"boats","visual":"boat","visualCount":1,"id":14,"type":"plural"},
        {"prompt":"What is the singular of \"pens\"?","answer":"pen","visual":"pen","visualCount":3,"id":15,"type":"plural"},
        {"prompt":"What is the plural of \"jam\"? (jams, buses, wig)","answer":"jams","visualCount":1,"id":16,"type":"plural"},
        {"prompt":"What is the singular of \"logs\"? (log, hat, balls)","answer":"log","visualCount":3,"id":17,"type":"plural"},
        {"prompt":"What is the plural of \"hat\"?","answer":"hats","visual":"hat","visualCount":1,"id":18,"type":"plural"},
        {"prompt":"What is the singular of \"balls\"?","answer":"ball","visual":"ball","visualCount":3,"id":19,"type":"plural"},
        {"prompt":"What is the plural of \"fan\"?","answer":"fans","visual":"fan","visualCount":1,"id":20,"type":"plural"},
        {"prompt":"What is the singular of \"bags\"?","answer":"bag","visual":"bag","visualCount":3,"id":21,"type":"plural"},
        {"prompt":"What is the plural of \"net\"?","answer":"nets","visual":"net","visualCount":1,"id":22,"type":"plural"},
        {"prompt":"What is the singular of \"tops\"?","answer":"top","visual":"top","visualCount":3,"id":23,"type":"plural"},
        {"prompt":"What is the plural of \"book\"? (books, frogs, map)","answer":"books","visualCount":1,"id":24,"type":"plural"}
        ]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(pluralSpec, g1, seedFrom([1, 'plural', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"What is the singular of \"boxes\"?","answer":"box","visual":"box","visualCount":3,"id":25,"type":"plural"},
        {"prompt":"What is the plural of \"kid\"? (net, nets, kids)","answer":"kids","visualCount":1,"id":26,"type":"plural"},
        {"prompt":"What is the singular of \"watches\"? (dog, log, watch)","answer":"watch","visual":"watch","visualCount":3,"id":27,"type":"plural"}
        ]);
    });
});

describe('plural — Year 2 (adds the irregular set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"prompt":"What is the plural of \"bus\"?","answer":"buses","visual":"bus","visualCount":1,"id":1,"type":"plural"},
        {"prompt":"What is the singular of \"doors\"? (foot, door, balls)","answer":"door","visual":"door","visualCount":3,"id":2,"type":"plural"},
        {"prompt":"What is the plural of \"cup\"? (cups, ball, balls)","answer":"cups","visual":"cup","visualCount":1,"id":3,"type":"plural"},
        {"prompt":"What is the singular of \"geese\"?","answer":"goose","visualCount":3,"id":4,"type":"plural"},
        {"prompt":"What is the plural of \"log\"?","answer":"logs","visualCount":1,"id":5,"type":"plural"},
        {"prompt":"What is the singular of \"pigs\"? (star, pig, pots)","answer":"pig","visual":"pig","visualCount":3,"id":6,"type":"plural"},
        {"prompt":"What is the plural of \"map\"? (child, maps, hat)","answer":"maps","visual":"map","visualCount":1,"id":7,"type":"plural"},
        {"prompt":"What is the singular of \"people\"? (person, net, men)","answer":"person","visualCount":3,"id":8,"type":"plural"},
        {"prompt":"What is the plural of \"boat\"? (tooth, boats, mouse)","answer":"boats","visual":"boat","visualCount":1,"id":9,"type":"plural"},
        {"prompt":"What is the singular of \"nets\"?","answer":"net","visual":"net","visualCount":3,"id":10,"type":"plural"},
        {"prompt":"What is the plural of \"tooth\"?","answer":"teeth","visualCount":1,"id":11,"type":"plural"},
        {"prompt":"What is the singular of \"tops\"? (top, wig, log)","answer":"top","visual":"top","visualCount":3,"id":12,"type":"plural"},
        {"prompt":"What is the plural of \"leg\"? (boats, star, legs)","answer":"legs","visualCount":1,"id":13,"type":"plural"},
        {"prompt":"What is the singular of \"jams\"?","answer":"jam","visualCount":3,"id":14,"type":"plural"},
        {"prompt":"What is the plural of \"box\"? (boxes, wig, boat)","answer":"boxes","visual":"box","visualCount":1,"id":15,"type":"plural"},
        {"prompt":"What is the singular of \"hats\"?","answer":"hat","visual":"hat","visualCount":3,"id":16,"type":"plural"},
        {"prompt":"What is the plural of \"cat\"? (bird, cats, birds)","answer":"cats","visual":"cat","visualCount":1,"id":17,"type":"plural"},
        {"prompt":"What is the singular of \"dogs\"?","answer":"dog","visual":"dog","visualCount":3,"id":18,"type":"plural"},
        {"prompt":"What is the plural of \"ball\"?","answer":"balls","visual":"ball","visualCount":1,"id":19,"type":"plural"},
        {"prompt":"What is the singular of \"watches\"?","answer":"watch","visual":"watch","visualCount":3,"id":20,"type":"plural"},
        {"prompt":"What is the plural of \"frog\"? (child, stars, frogs)","answer":"frogs","visual":"frog","visualCount":1,"id":21,"type":"plural"},
        {"prompt":"What is the singular of \"oxen\"?","answer":"ox","visualCount":3,"id":22,"type":"plural"},
        {"prompt":"What is the plural of \"bird\"? (birds, pot, woman)","answer":"birds","visual":"bird","visualCount":1,"id":23,"type":"plural"},
        {"prompt":"What is the singular of \"women\"?","answer":"woman","visualCount":3,"id":24,"type":"plural"}
        ]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(pluralSpec, g2, seedFrom([2, 'plural', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"What is the plural of \"tree\"? (boat, box, trees)","answer":"trees","visual":"tree","visualCount":1,"id":25,"type":"plural"},
        {"prompt":"What is the singular of \"pots\"? (bags, pot, fan)","answer":"pot","visual":"pot","visualCount":3,"id":26,"type":"plural"},
        {"prompt":"What is the plural of \"kid\"? (kid, pen, kids)","answer":"kids","visualCount":1,"id":27,"type":"plural"}
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(pluralSpec, getGradeConfig(7), seedFrom([7, 'plural', 0]))).toEqual([]);
    });
});
