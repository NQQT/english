// Unit tests for the DIRECT SPEECH worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm or line banks change,
// these exact assertions fail — which is what we want, so a silent change to
// the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { speechSpec } from './SpeechWorksheet';

const g3 = getGradeConfig(3);
const g6 = getGradeConfig(6);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(speechSpec, grade, seedFrom([grade.id, speechSpec.id, 0]));
}

describe('speech plugin — declarative spec', () => {
    it('declares its sidebar label, glyph, page size and single-column layout', () => {
        expect(speechSpec.id).toBe('speech');
        expect(speechSpec.label).toBe('Direct Speech');
        expect(speechSpec.icon).toBe('❝');
        expect(speechSpec.perPage).toBe(16);
        // Prose lines run single-column.
        expect(speechSpec.singleColumn).toBe(true);
    });

    it('describes its scope (speech marks & reporting)', () => {
        expect(speechSpec.scope(g3)).toBe('speech marks & reporting');
        expect(speechSpec.scope(g6)).toBe('speech marks & reporting');
    });

    it('is gated by the grade catalogue (Years 3..6 only)', () => {
        expect(speechSpec.offered(getGradeConfig(0))).toBe(false);
        expect(speechSpec.offered(getGradeConfig(1))).toBe(false);
        expect(speechSpec.offered(getGradeConfig(2))).toBe(false);
        expect(speechSpec.offered(g3)).toBe(true);
        expect(speechSpec.offered(g6)).toBe(true);
        expect(speechSpec.offered(getGradeConfig(7))).toBe(false);
        // Unoffered grades => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(speechSpec, getGradeConfig(2), seedFrom([2, 'speech', 0]))).toEqual([]);
    });
});

describe('speech — Year 3', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g3)).toEqual([
        {"prompt":"Add the speech marks and commas: Asked Zoe Is the canteen still open","answer":"Asked Zoe, \"Is the canteen still open?\"","id":1,"type":"speech"},
        {"prompt":"Is this direct speech (someone speaking) or plain writing? \"Is the canteen still open?\" asked Ava.","answer":"direct speech","id":2,"type":"speech"},
        {"prompt":"Add the speech marks and commas: Can we go to the beach today. asked Zoe.","answer":"\"Can we go to the beach today?\" asked Zoe.","id":3,"type":"speech"},
        {"prompt":"Is this direct speech (someone speaking) or plain writing? We caught the ferry to the city.","answer":"plain writing","id":4,"type":"speech"},
        {"prompt":"Is this direct speech (someone speaking) or plain writing? \"My project is on volcanoes,\" said Leo.","answer":"direct speech","id":5,"type":"speech"},
        {"prompt":"Add the speech marks and commas: Look out below. said Ben.","answer":"\"Look out below!\" said Ben.","id":6,"type":"speech"},
        {"prompt":"Add the speech marks and commas: Where are my runners. asked Ava.","answer":"\"Where are my runners?\" asked Ava.","id":7,"type":"speech"},
        {"prompt":"Add the speech marks and commas: Can we go to the beach today. asked Jack.","answer":"\"Can we go to the beach today?\" asked Jack.","id":8,"type":"speech"},
        {"prompt":"Add the speech marks and commas: Said Ella The movie starts at six","answer":"Said Ella, \"The movie starts at six.\"","id":9,"type":"speech"},
        {"prompt":"Add the speech marks and commas: Said Mia My project is on volcanoes","answer":"Said Mia, \"My project is on volcanoes.\"","id":10,"type":"speech"},
        {"prompt":"Add the speech marks and commas: We won the grand final. said Leo.","answer":"\"We won the grand final!\" said Leo.","id":11,"type":"speech"},
        {"prompt":"Add the speech marks and commas: Asked Ava Can we go to the beach today","answer":"Asked Ava, \"Can we go to the beach today?\"","id":12,"type":"speech"},
        {"prompt":"Is this direct speech (someone speaking) or plain writing? \"I brought the sports kit,\" said Mia.","answer":"direct speech","id":13,"type":"speech"},
        {"prompt":"Add the speech marks and commas: Asked Jack Who left the gate open","answer":"Asked Jack, \"Who left the gate open?\"","id":14,"type":"speech"},
        {"prompt":"Which sentence shows the speech correctly? (\"My project is on volcanoes,\" said Ella. / \"My project is on volcanoes.\" said Ella. / \"My project is on volcanoes\", said Ella.)","answer":"\"My project is on volcanoes,\" said Ella.","id":15,"type":"speech"},
        {"prompt":"Is this direct speech (someone speaking) or plain writing? The library closes at five.","answer":"plain writing","id":16,"type":"speech"}
        ]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(speechSpec, g3, seedFrom([3, 'speech', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Is this direct speech (someone speaking) or plain writing? The dog ran across the park.","answer":"plain writing","id":17,"type":"speech"},
        {"prompt":"Add the speech marks and commas: What time is the bus coming. asked Zoe.","answer":"\"What time is the bus coming?\" asked Zoe.","id":18,"type":"speech"},
        {"prompt":"Which sentence shows the speech correctly? (\"My project is on volcanoes.\" said Ben. / \"My project is on volcanoes\", said Ben. / \"My project is on volcanoes,\" said Ben.)","answer":"\"My project is on volcanoes,\" said Ben.","id":19,"type":"speech"}
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(speechSpec, getGradeConfig(7), seedFrom([7, 'speech', 0]))).toEqual([]);
    });
});

describe('speech — Year 6', () => {
    it('matches the exact page-1 head (grade 6 rolls its own stream)', () => {
        expect(sheet(g6).slice(0, 5)).toEqual([
        {"prompt":"Which sentence shows the speech correctly? (\"That was so close\"! said Leo. / \"That was so close!\" said Leo. / \"That was so close!\", said Leo.)","answer":"\"That was so close!\" said Leo.","id":1,"type":"speech"},
        {"prompt":"Which sentence shows the speech correctly? (\"My plane actually flew\"! said Mia. / \"My plane actually flew!\", said Mia. / \"My plane actually flew!\" said Mia.)","answer":"\"My plane actually flew!\" said Mia.","id":2,"type":"speech"},
        {"prompt":"Add the speech marks and commas: That was so close. said Leo.","answer":"\"That was so close!\" said Leo.","id":3,"type":"speech"},
        {"prompt":"Add the speech marks and commas: Said Ben We are going to the museum","answer":"Said Ben, \"We are going to the museum.\"","id":4,"type":"speech"},
        {"prompt":"Add the speech marks and commas: I brought the sports kit. said Ella.","answer":"\"I brought the sports kit,\" said Ella.","id":5,"type":"speech"}
        ]);
    });
});
