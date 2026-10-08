// Unit tests for the DIALOGUE PUNCTUATION worksheet plugin (Year 5+).
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm or line banks change,
// these exact assertions fail — which is what we want, so a silent change to
// the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { advpunctSpec } from './AdvancedPunctuationWorksheet';

const g5 = getGradeConfig(5);
const g6 = getGradeConfig(6);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(advpunctSpec, grade, seedFrom([grade.id, advpunctSpec.id, 0]));
}

describe('advpunct plugin — declarative spec', () => {
    it('declares its sidebar label, glyph, page size and single-column layout', () => {
        expect(advpunctSpec.id).toBe('advpunct');
        expect(advpunctSpec.label).toBe('Dialogue Punctuation');
        expect(advpunctSpec.icon).toBe('❞');
        expect(advpunctSpec.perPage).toBe(16);
        // Prose lines run single-column.
        expect(advpunctSpec.singleColumn).toBe(true);
    });

    it('describes its scope (quotes, commas & new speakers)', () => {
        expect(advpunctSpec.scope(g5)).toBe('quotes, commas & new speakers');
        expect(advpunctSpec.scope(g6)).toBe('quotes, commas & new speakers');
    });

    it('is gated by the grade catalogue (Years 5..6 only, targeting Y5+)', () => {
        expect(advpunctSpec.offered(getGradeConfig(0))).toBe(false);
        expect(advpunctSpec.offered(getGradeConfig(1))).toBe(false);
        expect(advpunctSpec.offered(getGradeConfig(2))).toBe(false);
        expect(advpunctSpec.offered(getGradeConfig(3))).toBe(false);
        expect(advpunctSpec.offered(getGradeConfig(4))).toBe(false);
        expect(advpunctSpec.offered(g5)).toBe(true);
        expect(advpunctSpec.offered(g6)).toBe(true);
        expect(advpunctSpec.offered(getGradeConfig(7))).toBe(false);
        // Unoffered grades => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(advpunctSpec, getGradeConfig(2), seedFrom([2, 'advpunct', 0]))).toEqual([]);
    });
});

describe('advpunct — Year 5', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g5)).toEqual([
        {"prompt":"Which is punctuated correctly? (\"Whose turn is it to set the table?\" whispered Zoe. / \"Whose turn is it to set the table?\", whispered Zoe. / \"Whose turn is it to set the table\"? whispered Zoe.)","answer":"\"Whose turn is it to set the table?\" whispered Zoe.","id":1,"type":"advpunct"},
        {"prompt":"Which layout is right when the speaker changes? (\"Training is cancelled today,\" said Mia. asked Sam, \"Where is the map?\" / \"Training is cancelled today,\" said Mia.\n\"Where is the map?\" asked Sam. / \"Training is cancelled today,\" said Mia. \"Where is the map?\" asked Sam.)","answer":"\"Training is cancelled today,\" said Mia.\n\"Where is the map?\" asked Sam.","id":2,"type":"advpunct"},
        {"prompt":"Which layout is right when the speaker changes? (\"Training is cancelled today,\" said Mia. \"Where is the map?\" asked Sam. / \"Training is cancelled today,\" said Mia. asked Sam, \"Where is the map?\" / \"Training is cancelled today,\" said Mia.\n\"Where is the map?\" asked Sam.)","answer":"\"Training is cancelled today,\" said Mia.\n\"Where is the map?\" asked Sam.","id":3,"type":"advpunct"},
        {"prompt":"Which is punctuated correctly? (\"Whose turn is it to set the table\"? said Mia. / \"Whose turn is it to set the table?\" said Mia. / \"Whose turn is it to set the table?\", said Mia.)","answer":"\"Whose turn is it to set the table?\" said Mia.","id":4,"type":"advpunct"},
        {"prompt":"Punctuate the dialogue: Training is cancelled today replied Ben.","answer":"\"Training is cancelled today,\" replied Ben.","id":5,"type":"advpunct"},
        {"prompt":"Which is punctuated correctly? (\"Can we go to the beach today?\", replied Ben. / \"Can we go to the beach today?\" replied Ben. / \"Can we go to the beach today\"? replied Ben.)","answer":"\"Can we go to the beach today?\" replied Ben.","id":6,"type":"advpunct"},
        {"prompt":"Which layout is right when the speaker changes? (\"The movie starts at six,\" said Mia. \"Where is the map?\" asked Sam. / \"The movie starts at six,\" said Mia. asked Sam, \"Where is the map?\" / \"The movie starts at six,\" said Mia.\n\"Where is the map?\" asked Sam.)","answer":"\"The movie starts at six,\" said Mia.\n\"Where is the map?\" asked Sam.","id":7,"type":"advpunct"},
        {"prompt":"Which is punctuated correctly? (\"Training is cancelled today\", shouted Ava. / \"Training is cancelled today.\" shouted Ava. / \"Training is cancelled today,\" shouted Ava.)","answer":"\"Training is cancelled today,\" shouted Ava.","id":8,"type":"advpunct"},
        {"prompt":"Which layout is right when the speaker changes? (\"I brought the sports kit,\" said Mia. asked Sam, \"Where is the map?\" / \"I brought the sports kit,\" said Mia.\n\"Where is the map?\" asked Sam. / \"I brought the sports kit,\" said Mia. \"Where is the map?\" asked Sam.)","answer":"\"I brought the sports kit,\" said Mia.\n\"Where is the map?\" asked Sam.","id":9,"type":"advpunct"},
        {"prompt":"Which is punctuated correctly? (\"Whose turn is it to set the table\"? whispered Zoe. / \"Whose turn is it to set the table?\" whispered Zoe. / \"Whose turn is it to set the table?\", whispered Zoe.)","answer":"\"Whose turn is it to set the table?\" whispered Zoe.","id":10,"type":"advpunct"},
        {"prompt":"Punctuate the dialogue: Dinner is nearly ready said Mia.","answer":"\"Dinner is nearly ready,\" said Mia.","id":11,"type":"advpunct"},
        {"prompt":"Which is punctuated correctly? (\"We are going to the museum,\" asked Sam. / \"We are going to the museum.\" asked Sam. / \"We are going to the museum\", asked Sam.)","answer":"\"We are going to the museum,\" asked Sam.","id":12,"type":"advpunct"},
        {"prompt":"Which is punctuated correctly? (\"Whose turn is it to set the table\"? shouted Ava. / \"Whose turn is it to set the table?\", shouted Ava. / \"Whose turn is it to set the table?\" shouted Ava.)","answer":"\"Whose turn is it to set the table?\" shouted Ava.","id":13,"type":"advpunct"},
        {"prompt":"Which is punctuated correctly? (\"Whose turn is it to set the table\"? whispered Zoe. / \"Whose turn is it to set the table?\", whispered Zoe. / \"Whose turn is it to set the table?\" whispered Zoe.)","answer":"\"Whose turn is it to set the table?\" whispered Zoe.","id":14,"type":"advpunct"},
        {"prompt":"Which layout is right when the speaker changes? (\"I brought the sports kit,\" said Mia. \"Where is the map?\" asked Sam. / \"I brought the sports kit,\" said Mia.\n\"Where is the map?\" asked Sam. / \"I brought the sports kit,\" said Mia. asked Sam, \"Where is the map?\")","answer":"\"I brought the sports kit,\" said Mia.\n\"Where is the map?\" asked Sam.","id":15,"type":"advpunct"},
        {"prompt":"Punctuate the dialogue: Is the canteen still open asked Sam.","answer":"\"Is the canteen still open?\" asked Sam.","id":16,"type":"advpunct"}
        ]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(advpunctSpec, g5, seedFrom([5, 'advpunct', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Punctuate the dialogue: My project is on volcanoes replied Ben.","answer":"\"My project is on volcanoes,\" replied Ben.","id":17,"type":"advpunct"},
        {"prompt":"Which is punctuated correctly? (\"We won the grand final!\", said Mia. / \"We won the grand final!\" said Mia! / \"We won the grand final!\" said Mia.)","answer":"\"We won the grand final!\" said Mia.","id":18,"type":"advpunct"},
        {"prompt":"Which layout is right when the speaker changes? (\"The movie starts at six,\" said Mia. \"Where is the map?\" asked Sam. / \"The movie starts at six,\" said Mia.\n\"Where is the map?\" asked Sam. / \"The movie starts at six,\" said Mia. asked Sam, \"Where is the map?\")","answer":"\"The movie starts at six,\" said Mia.\n\"Where is the map?\" asked Sam.","id":19,"type":"advpunct"}
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(advpunctSpec, getGradeConfig(7), seedFrom([7, 'advpunct', 0]))).toEqual([]);
    });
});

describe('advpunct — Year 6', () => {
    it('matches the exact page-1 head (grade 6 rolls its own stream)', () => {
        expect(sheet(g6).slice(0, 3)).toEqual([
        {"prompt":"Which layout is right when the speaker changes? (\"I brought the sports kit,\" said Mia. asked Sam, \"Where is the map?\" / \"I brought the sports kit,\" said Mia.\n\"Where is the map?\" asked Sam. / \"I brought the sports kit,\" said Mia. \"Where is the map?\" asked Sam.)","answer":"\"I brought the sports kit,\" said Mia.\n\"Where is the map?\" asked Sam.","id":1,"type":"advpunct"},
        {"prompt":"Which is punctuated correctly? (\"Whose turn is it to set the table\"? said Mia. / \"Whose turn is it to set the table?\" said Mia. / \"Whose turn is it to set the table?\", said Mia.)","answer":"\"Whose turn is it to set the table?\" said Mia.","id":2,"type":"advpunct"},
        {"prompt":"Punctuate the dialogue: Who left the gate open asked Sam.","answer":"\"Who left the gate open?\" asked Sam.","id":3,"type":"advpunct"}
        ]);
    });
});
