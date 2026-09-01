// Unit tests for the PRONOUNS worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm or item bank changes,
// these exact assertions fail — which is what we want, so a silent change to
// the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { pronounSpec } from './PronounWorksheet';

const g3 = getGradeConfig(3);
const g6 = getGradeConfig(6);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(pronounSpec, grade, seedFrom([grade.id, pronounSpec.id, 0]));
}

describe('pronoun plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(pronounSpec.id).toBe('pronoun');
        expect(pronounSpec.label).toBe('Pronouns');
        expect(pronounSpec.icon).toBe('⊙');
        expect(pronounSpec.perPage).toBe(18);
    });

    it('describes its scope (pronouns replace nouns)', () => {
        expect(pronounSpec.scope(g3)).toBe('pronouns replace nouns');
        expect(pronounSpec.scope(g6)).toBe('pronouns replace nouns');
    });

    it('is gated by the grade catalogue (Years 3..6 only)', () => {
        expect(pronounSpec.offered(getGradeConfig(0))).toBe(false);
        expect(pronounSpec.offered(getGradeConfig(1))).toBe(false);
        expect(pronounSpec.offered(getGradeConfig(2))).toBe(false);
        expect(pronounSpec.offered(g3)).toBe(true);
        expect(pronounSpec.offered(g6)).toBe(true);
        expect(pronounSpec.offered(getGradeConfig(7))).toBe(false);
        // Unoffered grades => empty sheet even with a dashboard-shaped seed.
        expect(generateSheet(pronounSpec, getGradeConfig(2), seedFrom([2, 'pronoun', 0]))).toEqual([]);
    });
});

describe('pronoun — Year 3', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g3)).toEqual([
        {"prompt":"Which pronoun can replace \"Jack\"? (she, he, it)","answer":"he","id":1,"type":"pronoun"},
        {"prompt":"Fill in the missing pronoun: __ told a long story. (she, it, he)","answer":"he","id":2,"type":"pronoun"},
        {"prompt":"Fill in the missing pronoun: __ won the running race. (she, it, we)","answer":"she","id":3,"type":"pronoun"},
        {"prompt":"Which possessive pronoun shows what belongs to Ava? (\"Ava's book\")","answer":"her","id":4,"type":"pronoun"},
        {"prompt":"Which pronoun can replace \"Sam\"? (they, we, he)","answer":"he","id":5,"type":"pronoun"},
        {"prompt":"Which pronoun can replace \"my dog\"? (he, it, they)","answer":"it","id":6,"type":"pronoun"},
        {"prompt":"Which possessive pronoun shows what belongs to the teacher? (\"the teacher's book\")","answer":"her","id":7,"type":"pronoun"},
        {"prompt":"Which possessive pronoun shows what belongs to the children? (\"the children's book\")","answer":"their","id":8,"type":"pronoun"},
        {"prompt":"Replace \"Dad\" with a pronoun: Dad did something kind.","answer":"he","id":9,"type":"pronoun"},
        {"prompt":"Which possessive pronoun shows what belongs to Zoe and Ben? (\"Zoe and Ben's book\")","answer":"their","id":10,"type":"pronoun"},
        {"prompt":"Which possessive pronoun shows what belongs to Mum? (\"Mum's book\")","answer":"her","id":11,"type":"pronoun"},
        {"prompt":"Fill in the missing pronoun: __ lost a tooth at school. (she, he, it)","answer":"he","id":12,"type":"pronoun"},
        {"prompt":"Which possessive pronoun shows what belongs to my cousin and I? (\"my cousin and I's book\")","answer":"our","id":13,"type":"pronoun"},
        {"prompt":"Which possessive pronoun shows what belongs to Mia? (\"Mia's book\")","answer":"her","id":14,"type":"pronoun"},
        {"prompt":"Fill in the missing pronoun: __ chased a butterfly. (it, he, she)","answer":"it","id":15,"type":"pronoun"},
        {"prompt":"Which possessive pronoun shows what belongs to the students? (\"the students's book\")","answer":"their","id":16,"type":"pronoun"},
        {"prompt":"Replace \"my brother and I\" with a pronoun: my brother and I did something kind.","answer":"we","id":17,"type":"pronoun"},
        {"prompt":"Which pronoun can replace \"the twins\"? (she, they, he)","answer":"they","id":18,"type":"pronoun"}
        ]);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(pronounSpec, g3, seedFrom([3, 'pronoun', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"prompt":"Fill in the missing pronoun: __ won the running race. (it, she, he)","answer":"she","id":19,"type":"pronoun"},
        {"prompt":"Fill in the missing pronoun: __ built a sandcastle. (we, they, he)","answer":"we","id":20,"type":"pronoun"},
        {"prompt":"Fill in the missing pronoun: __ lost a tooth at school. (we, he, she)","answer":"he","id":21,"type":"pronoun"}
        ]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(pronounSpec, getGradeConfig(7), seedFrom([7, 'pronoun', 0]))).toEqual([]);
    });
});

describe('pronoun — Year 6', () => {
    it('matches the exact page-1 head (grade 6 rolls its own stream)', () => {
        expect(sheet(g6).slice(0, 4)).toEqual([
        {"prompt":"Which possessive pronoun shows what belongs to my dog? (\"my dog's book\")","answer":"its","id":1,"type":"pronoun"},
        {"prompt":"Which pronoun can replace \"Mia\"? (it, she, we)","answer":"she","id":2,"type":"pronoun"},
        {"prompt":"Replace \"the children\" with a pronoun: the children did something kind.","answer":"they","id":3,"type":"pronoun"},
        {"prompt":"Fill in the missing pronoun: __ told a long story. (she, they, he)","answer":"he","id":4,"type":"pronoun"}
        ]);
    });
});
