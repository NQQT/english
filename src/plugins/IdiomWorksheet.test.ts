// Unit tests for the IDIOMS worksheet plugin (Year 5+).
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm or idiom bank changes,
// these exact assertions fail — which is what we want, so a silent change to
// the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { idiomSpec } from './IdiomWorksheet';

const g5 = getGradeConfig(5);
const g6 = getGradeConfig(6);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(idiomSpec, grade, seedFrom([grade.id, idiomSpec.id, 0]));
}

describe('idiom plugin — declarative spec', () => {
    it('declares its sidebar label, glyph, page size and single-column layout', () => {
        expect(idiomSpec.id).toBe('idiom');
        expect(idiomSpec.label).toBe('Idioms');
        expect(idiomSpec.icon).toBe('☁');
        expect(idiomSpec.perPage).toBe(16);
        // Prose lines run single-column.
        expect(idiomSpec.singleColumn).toBe(true);
    });

    it('describes its scope (sayings & their meanings)', () => {
        expect(idiomSpec.scope(g5)).toBe('sayings & their meanings');
        expect(idiomSpec.scope(g6)).toBe('sayings & their meanings');
    });

    it('is gated by the grade catalogue (Years 3..6 only, targeting Y5+)', () => {
        expect(idiomSpec.offered(getGradeConfig(0))).toBe(false);
        expect(idiomSpec.offered(getGradeConfig(1))).toBe(false);
        expect(idiomSpec.offered(getGradeConfig(2))).toBe(false);
        expect(idiomSpec.offered(getGradeConfig(3))).toBe(true);
        expect(idiomSpec.offered(g5)).toBe(true);
        expect(idiomSpec.offered(g6)).toBe(true);
        expect(idiomSpec.offered(getGradeConfig(7))).toBe(false);
        // Unoffered grades => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(idiomSpec, getGradeConfig(2), seedFrom([2, 'idiom', 0]))).toEqual([]);
    });
});

describe('idiom — Year 5', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g5)).toEqual([
        {"prompt":"Which sentence uses the idiom \"cold feet\" correctly? (When the party was cancelled, Sam was \"cold feet\" - nervous about something. / Miss Lee said \"cold feet\" because standing on ice. / Jake looked outside and saw \"cold feet\" - feeling chilly.)","answer":"When the party was cancelled, Sam was \"cold feet\" - nervous about something.","id":1,"type":"idiom"},
        {"prompt":"Which sentence uses the idiom \"in hot water\" correctly? (Miss Lee said \"in hot water\" because swimming at the beach. / Jake looked outside and saw \"in hot water\" - having a bath. / When the party was cancelled, Sam was \"in hot water\" - in trouble.)","answer":"When the party was cancelled, Sam was \"in hot water\" - in trouble.","id":2,"type":"idiom"},
        {"prompt":"Which sentence uses the idiom \"pull your socks up\" correctly? (Miss Lee said \"pull your socks up\" because tidy your room. / Jake looked outside and saw \"pull your socks up\" - get dressed faster. / When the party was cancelled, Sam was \"pull your socks up\" - try harder.)","answer":"When the party was cancelled, Sam was \"pull your socks up\" - try harder.","id":3,"type":"idiom"},
        {"prompt":"What does it mean to be \"on cloud nine\"? (dreaming at night / flying a plane / extremely happy)","answer":"extremely happy","id":4,"type":"idiom"},
        {"prompt":"Complete the idiom: __ last __","answer":"the last straw","id":5,"type":"idiom"},
        {"prompt":"Which sentence uses the idiom \"spill the beans\" correctly? (Miss Lee said \"spill the beans\" because lose your temper. / Jake looked outside and saw \"spill the beans\" - drop the dinner. / When the party was cancelled, Sam was \"spill the beans\" - reveal a secret.)","answer":"When the party was cancelled, Sam was \"spill the beans\" - reveal a secret.","id":6,"type":"idiom"},
        {"prompt":"Complete the idiom: __ of __","answer":"piece of cake","id":7,"type":"idiom"},
        {"prompt":"What does it mean to be \"hold your horses\"? (be patient / hug your pet / gallop away)","answer":"be patient","id":8,"type":"idiom"},
        {"prompt":"What does it mean to be \"over the moon\"? (delighted / on a trampoline / in outer space)","answer":"delighted","id":9,"type":"idiom"},
        {"prompt":"Which sentence uses the idiom \"big cheese\" correctly? (Jake looked outside and saw \"big cheese\" - a large block from the deli. / Miss Lee said \"big cheese\" because a popular snack. / When the party was cancelled, Sam was \"big cheese\" - the person in charge.)","answer":"When the party was cancelled, Sam was \"big cheese\" - the person in charge.","id":10,"type":"idiom"},
        {"prompt":"Which sentence uses the idiom \"butterflies in your tummy\" correctly? (When the party was cancelled, Sam was \"butterflies in your tummy\" - feeling nervous. / Miss Lee said \"butterflies in your tummy\" because feeling hungry. / Jake looked outside and saw \"butterflies in your tummy\" - a caterpillar home.)","answer":"When the party was cancelled, Sam was \"butterflies in your tummy\" - feeling nervous.","id":11,"type":"idiom"},
        {"prompt":"What does it mean to be \"keep your eyes peeled\"? (rub your eyes / stay alert and watch / take off your glasses)","answer":"stay alert and watch","id":12,"type":"idiom"},
        {"prompt":"Complete the idiom: __ the __","answer":"under the weather","id":13,"type":"idiom"},
        {"prompt":"What does it mean to be \"hit the sack\"? (punch a pillow / pack up the camping gear / go to bed)","answer":"go to bed","id":14,"type":"idiom"},
        {"prompt":"Which sentence uses the idiom \"raining cats and dogs\" correctly? (Jake looked outside and saw \"raining cats and dogs\" - pets falling from the sky. / When the party was cancelled, Sam was \"raining cats and dogs\" - raining very heavily. / Miss Lee said \"raining cats and dogs\" because a rain storm with animals.)","answer":"When the party was cancelled, Sam was \"raining cats and dogs\" - raining very heavily.","id":15,"type":"idiom"},
        {"prompt":"Which sentence uses the idiom \"head in the clouds\" correctly? (Jake looked outside and saw \"head in the clouds\" - being very tall. / When the party was cancelled, Sam was \"head in the clouds\" - daydreaming. / Miss Lee said \"head in the clouds\" because watching the sky.)","answer":"When the party was cancelled, Sam was \"head in the clouds\" - daydreaming.","id":16,"type":"idiom"}
        ]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(idiomSpec, g5, seedFrom([5, 'idiom', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Complete the idiom: __ a __","answer":"in a pickle","id":17,"type":"idiom"},
        {"prompt":"Complete the idiom: __ cats __ dogs","answer":"raining cats and dogs","id":18,"type":"idiom"},
        {"prompt":"What does it mean to be \"pull your socks up\"? (get dressed faster / tidy your room / try harder)","answer":"try harder","id":19,"type":"idiom"}
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(idiomSpec, getGradeConfig(7), seedFrom([7, 'idiom', 0]))).toEqual([]);
    });
});

describe('idiom — Year 6', () => {
    it('page 2 continues the exact stream (grade 6 rolls its own stream)', () => {
        expect(generateDocument(idiomSpec, g6, seedFrom([6, 'idiom', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Which sentence uses the idiom \"hit the sack\" correctly? (When the party was cancelled, Sam was \"hit the sack\" - go to bed. / Jake looked outside and saw \"hit the sack\" - punch a pillow. / Miss Lee said \"hit the sack\" because pack up the camping gear.)","answer":"When the party was cancelled, Sam was \"hit the sack\" - go to bed.","id":17,"type":"idiom"},
        {"prompt":"Which sentence uses the idiom \"cold feet\" correctly? (Jake looked outside and saw \"cold feet\" - feeling chilly. / Miss Lee said \"cold feet\" because standing on ice. / When the party was cancelled, Sam was \"cold feet\" - nervous about something.)","answer":"When the party was cancelled, Sam was \"cold feet\" - nervous about something.","id":18,"type":"idiom"},
        {"prompt":"What does it mean to be \"big cheese\"? (the person in charge / a large block from the deli / a popular snack)","answer":"the person in charge","id":19,"type":"idiom"}
        ]);
    });
});
