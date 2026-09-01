// Unit tests for the CAPITAL LETTERS worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm, word banks, or caps
// change, these exact assertions fail — which is what we want, so a silent
// change to the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { capitalSpec } from './CapitalLettersWorksheet';

const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(capitalSpec, grade, seedFrom([grade.id, capitalSpec.id, 0]));
}

describe('capital plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(capitalSpec.id).toBe('capital');
        expect(capitalSpec.label).toBe('Capital Letters');
        expect(capitalSpec.icon).toBe('A!');
        expect(capitalSpec.perPage).toBe(24);
    });

    it('describes its scope (word starts at every grade)', () => {
        expect(capitalSpec.scope(g1)).toBe('word starts');
        expect(capitalSpec.scope(g2)).toBe('word starts');
    });

    it('is gated by the grade catalogue (Year 1 and Year 2 only)', () => {
        expect(capitalSpec.offered(getGradeConfig(0))).toBe(false);
        expect(capitalSpec.offered(g1)).toBe(true);
        expect(capitalSpec.offered(g2)).toBe(true);
        expect(capitalSpec.offered(getGradeConfig(3))).toBe(false);
    });
});

// Semantic invariants: every generator kind is answerable from the prompt
// alone (see CapitalLettersWorksheet.ts):
//   word     — the answer is the printed word with its first letter capitalised
//   needs    — the printed line contains the lower-case answer word
//   correct  — the answer is one of the two printed sentences and the ONLY
//              one with both an uppercase sentence start and an uppercase name
function checkCapitalisation(grade: GradeConfig) {
    for (const p of sheet(grade)) {
        const word = p.prompt.match(/capital letter: ([a-z]+)$/)!;
        const needs = p.prompt.match(/^Which word needs a capital letter\? (.+)$/);
        const correct = p.prompt.match(/^Which sentence is written correctly\? \((.+) \/ (.+)\)$/);
        if (word) {
            expect(p.answer).toBe(word[1][0].toUpperCase() + word[1].slice(1));
        } else if (needs) {
            // The line is all lower-case and contains the answer as a word.
            expect(needs[1]).toBe(needs[1].toLowerCase());
            expect(needs[1].split(' ')).toContain(p.answer);
            expect(p.answer[0]).toBe(p.answer[0].toLowerCase());
        } else if (correct) {
            const options = [correct[1], correct[2]];
            expect(options).toContain(p.answer);
            // Exactly one option is correctly written (start + name capitals).
            const ok = options.filter((s) => {
                const words = s.replace('.', '').split(' ');
                return words[0][0] === words[0][0].toUpperCase() && words[3][0] === words[3][0].toUpperCase();
            });
            expect(ok).toEqual([p.answer]);
        } else {
            // Every prompt must fall into exactly one of the three kinds.
            throw new Error(`unrecognised capital prompt: ${p.prompt}`);
        }
    }
}

describe('capital — Year 1 (tier-2 common word set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"id":1,"type":"capital","prompt":"Write it with a capital letter: elf","answer":"Elf"},
        {"id":2,"type":"capital","prompt":"Which sentence is written correctly? (The dog and Mia sang a song. / the dog and Mia sang a song.)","answer":"The dog and Mia sang a song."},
        {"id":3,"type":"capital","prompt":"Which sentence is written correctly? (The boy and Ivy ran fast. / The boy and ivy ran fast.)","answer":"The boy and Ivy ran fast."},
        {"id":4,"type":"capital","prompt":"Which word needs a capital letter? the baby and leo played outside.","answer":"leo"},
        {"id":5,"type":"capital","prompt":"Which sentence is written correctly? (My dad and Ben went home. / my dad and Ben went home.)","answer":"My dad and Ben went home."},
        {"id":6,"type":"capital","prompt":"Which word needs a capital letter? my friend and eli made a mess.","answer":"eli"},
        {"id":7,"type":"capital","prompt":"Which word needs a capital letter? the girl and sam read a book.","answer":"sam"},
        {"id":8,"type":"capital","prompt":"Which sentence is written correctly? (My mom and Zoe ate lunch. / my mom and Zoe ate lunch.)","answer":"My mom and Zoe ate lunch."},
        {"id":9,"type":"capital","prompt":"Which sentence is written correctly? (The cat and Max found a coin. / the cat and Max found a coin.)","answer":"The cat and Max found a coin."},
        {"id":10,"type":"capital","prompt":"Write it with a capital letter: they","answer":"They"},
        {"id":11,"type":"capital","prompt":"Which sentence is written correctly? (My dad and Ava sang a song. / My dad and ava sang a song.)","answer":"My dad and Ava sang a song."},
        {"id":12,"type":"capital","prompt":"Write it with a capital letter: tank","answer":"Tank"},
        {"id":13,"type":"capital","prompt":"Write it with a capital letter: torn","answer":"Torn"},
        {"id":14,"type":"capital","prompt":"Which sentence is written correctly? (My friend and Sue ran fast. / my friend and Sue ran fast.)","answer":"My friend and Sue ran fast."},
        {"id":15,"type":"capital","prompt":"Which word needs a capital letter? the cat and ben ate lunch.","answer":"ben"},
        {"id":16,"type":"capital","prompt":"Which sentence is written correctly? (The girl and Ava played outside. / The girl and ava played outside.)","answer":"The girl and Ava played outside."},
        {"id":17,"type":"capital","prompt":"Write it with a capital letter: pound","answer":"Pound"},
        {"id":18,"type":"capital","prompt":"Which word needs a capital letter? the boy and sam found a coin.","answer":"sam"},
        {"id":19,"type":"capital","prompt":"Which sentence is written correctly? (My mom and Max made a mess. / my mom and Max made a mess.)","answer":"My mom and Max made a mess."},
        {"id":20,"type":"capital","prompt":"Which sentence is written correctly? (The dog and Mia read a book. / the dog and Mia read a book.)","answer":"The dog and Mia read a book."},
        {"id":21,"type":"capital","prompt":"Which sentence is written correctly? (The baby and Leo went home. / the baby and Leo went home.)","answer":"The baby and Leo went home."},
        {"id":22,"type":"capital","prompt":"Write it with a capital letter: old","answer":"Old"},
        {"id":23,"type":"capital","prompt":"Write it with a capital letter: keep","answer":"Keep"},
        {"id":24,"type":"capital","prompt":"Which sentence is written correctly? (The boy and Eli made a mess. / The boy and eli made a mess.)","answer":"The boy and Eli made a mess."}
]);
        checkCapitalisation(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(capitalSpec, g1, seedFrom([1, 'capital', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"capital","prompt":"Write it with a capital letter: road","answer":"Road"},
        {"id":26,"type":"capital","prompt":"Which word needs a capital letter? my dad and sue ran fast.","answer":"sue"},
        {"id":27,"type":"capital","prompt":"Which sentence is written correctly? (The girl and Ivy sang a song. / The girl and ivy sang a song.)","answer":"The girl and Ivy sang a song."}
]);
    });
});

describe('capital — Year 2 (tier-3 extended set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"capital","prompt":"Which word needs a capital letter? the dog and max went home.","answer":"max"},
        {"id":2,"type":"capital","prompt":"Which sentence is written correctly? (The cat and Sue sang a song. / the cat and Sue sang a song.)","answer":"The cat and Sue sang a song."},
        {"id":3,"type":"capital","prompt":"Which sentence is written correctly? (The girl and Ava ate lunch. / the girl and Ava ate lunch.)","answer":"The girl and Ava ate lunch."},
        {"id":4,"type":"capital","prompt":"Which word needs a capital letter? my friend and zoe found a coin.","answer":"zoe"},
        {"id":5,"type":"capital","prompt":"Which word needs a capital letter? the baby and ivy read a book.","answer":"ivy"},
        {"id":6,"type":"capital","prompt":"Which word needs a capital letter? my dad and eli made a mess.","answer":"eli"},
        {"id":7,"type":"capital","prompt":"Which sentence is written correctly? (My mom and Ben ran fast. / my mom and Ben ran fast.)","answer":"My mom and Ben ran fast."},
        {"id":8,"type":"capital","prompt":"Which word needs a capital letter? the boy and leo played outside.","answer":"leo"},
        {"id":9,"type":"capital","prompt":"Write it with a capital letter: watch","answer":"Watch"},
        {"id":10,"type":"capital","prompt":"Which sentence is written correctly? (The baby and Sam made a mess. / The baby and sam made a mess.)","answer":"The baby and Sam made a mess."},
        {"id":11,"type":"capital","prompt":"Which sentence is written correctly? (My mom and Mia played outside. / my mom and Mia played outside.)","answer":"My mom and Mia played outside."},
        {"id":12,"type":"capital","prompt":"Write it with a capital letter: seat","answer":"Seat"},
        {"id":13,"type":"capital","prompt":"Write it with a capital letter: jazz","answer":"Jazz"},
        {"id":14,"type":"capital","prompt":"Which sentence is written correctly? (My friend and Ava read a book. / My friend and ava read a book.)","answer":"My friend and Ava read a book."},
        {"id":15,"type":"capital","prompt":"Write it with a capital letter: enjoy","answer":"Enjoy"},
        {"id":16,"type":"capital","prompt":"Which sentence is written correctly? (My dad and Ben ate lunch. / my dad and Ben ate lunch.)","answer":"My dad and Ben ate lunch."},
        {"id":17,"type":"capital","prompt":"Which sentence is written correctly? (The dog and Eli found a coin. / The dog and eli found a coin.)","answer":"The dog and Eli found a coin."},
        {"id":18,"type":"capital","prompt":"Write it with a capital letter: nine","answer":"Nine"},
        {"id":19,"type":"capital","prompt":"Which sentence is written correctly? (The girl and Zoe sang a song. / The girl and zoe sang a song.)","answer":"The girl and Zoe sang a song."},
        {"id":20,"type":"capital","prompt":"Which sentence is written correctly? (The cat and Leo ran fast. / the cat and Leo ran fast.)","answer":"The cat and Leo ran fast."},
        {"id":21,"type":"capital","prompt":"Which sentence is written correctly? (The boy and Sue went home. / the boy and Sue went home.)","answer":"The boy and Sue went home."},
        {"id":22,"type":"capital","prompt":"Write it with a capital letter: pole","answer":"Pole"},
        {"id":23,"type":"capital","prompt":"Write it with a capital letter: fruit","answer":"Fruit"},
        {"id":24,"type":"capital","prompt":"Which sentence is written correctly? (The baby and Ivy played outside. / The baby and ivy played outside.)","answer":"The baby and Ivy played outside."}
]);
        checkCapitalisation(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(capitalSpec, g2, seedFrom([2, 'capital', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"capital","prompt":"Which sentence is written correctly? (The dog and Sam made a mess. / The dog and sam made a mess.)","answer":"The dog and Sam made a mess."},
        {"id":26,"type":"capital","prompt":"Which sentence is written correctly? (The cat and Max ate lunch. / the cat and Max ate lunch.)","answer":"The cat and Max ate lunch."},
        {"id":27,"type":"capital","prompt":"Which word needs a capital letter? my friend and mia found a coin.","answer":"mia"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(capitalSpec, getGradeConfig(3), seedFrom([3, 'capital', 0]))).toEqual([]);
    });
});
