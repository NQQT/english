// Unit tests for the BEGINNING SOUNDS worksheet plugin.
//
// Strategy: the plugin's generator is DETERMINISTIC, so the ENTIRE sheet (all
// prompts + answers) is pinned to exact expected values produced from the real
// generator with the same seed the framework uses
// (seedFrom([grade.id, spec.id, 0])). If the algorithm, word banks, or caps
// change, these exact assertions fail — which is what we want, so a silent
// change to the worksheet can't slip through.

import { describe, it, expect } from 'vitest';
import { seedFrom, getGradeConfig, generateSheet, generateDocument, type GradeConfig } from '../framework';
import { soundsSpec } from './BeginningSoundsWorksheet';

const g0 = getGradeConfig(0);
const g1 = getGradeConfig(1);
const g2 = getGradeConfig(2);

// Helper: regenerate a sheet using the same seed the framework computes.
function sheet(grade: GradeConfig) {
    return generateSheet(soundsSpec, grade, seedFrom([grade.id, soundsSpec.id, 0]));
}

describe('sounds plugin — declarative spec', () => {
    it('declares its sidebar label, glyph and page size', () => {
        expect(soundsSpec.id).toBe('sounds');
        expect(soundsSpec.label).toBe('Beginning Sounds');
        expect(soundsSpec.icon).toBe('♪');
        expect(soundsSpec.perPage).toBe(24);
    });

    it('describes its word-set scope from the grade caps', () => {
        expect(soundsSpec.scope(g0)).toBe('beginnings, word set 1');
        expect(soundsSpec.scope(g1)).toBe('beginnings, word set 2');
        expect(soundsSpec.scope(g2)).toBe('beginnings, word set 3');
    });

    it('is gated by the grade catalogue (all implemented grades offer it)', () => {
        expect(soundsSpec.offered(g0)).toBe(true);
        expect(soundsSpec.offered(g1)).toBe(true);
        expect(soundsSpec.offered(g2)).toBe(true);
        expect(soundsSpec.offered(getGradeConfig(3))).toBe(false);
    });
});

// Semantic invariant: the answer is the actual first letter of the printed
// word (the phonemic task is always answerable from the prompt alone).
function checkFirstLetter(grade: GradeConfig) {
    for (const p of sheet(grade)) {
        const m = p.prompt.match(/^Which letter does "([a-z]+)" start with\?$/);
        expect(m).not.toBeNull();
        expect(p.answer).toBe(m![1][0]);
    }
}

describe('sounds — Prep (tier-1 starter word set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g0)).toEqual([
        {"id":1,"type":"sounds","prompt":"Which letter does \"pot\" start with?","answer":"p"},
        {"id":2,"type":"sounds","prompt":"Which letter does \"log\" start with?","answer":"l"},
        {"id":3,"type":"sounds","prompt":"Which letter does \"cat\" start with?","answer":"c"},
        {"id":4,"type":"sounds","prompt":"Which letter does \"cup\" start with?","answer":"c"},
        {"id":5,"type":"sounds","prompt":"Which letter does \"hat\" start with?","answer":"h"},
        {"id":6,"type":"sounds","prompt":"Which letter does \"jam\" start with?","answer":"j"},
        {"id":7,"type":"sounds","prompt":"Which letter does \"log\" start with?","answer":"l"},
        {"id":8,"type":"sounds","prompt":"Which letter does \"top\" start with?","answer":"t"},
        {"id":9,"type":"sounds","prompt":"Which letter does \"red\" start with?","answer":"r"},
        {"id":10,"type":"sounds","prompt":"Which letter does \"pin\" start with?","answer":"p"},
        {"id":11,"type":"sounds","prompt":"Which letter does \"pig\" start with?","answer":"p"},
        {"id":12,"type":"sounds","prompt":"Which letter does \"cat\" start with?","answer":"c"},
        {"id":13,"type":"sounds","prompt":"Which letter does \"sun\" start with?","answer":"s"},
        {"id":14,"type":"sounds","prompt":"Which letter does \"pen\" start with?","answer":"p"},
        {"id":15,"type":"sounds","prompt":"Which letter does \"hat\" start with?","answer":"h"},
        {"id":16,"type":"sounds","prompt":"Which letter does \"wig\" start with?","answer":"w"},
        {"id":17,"type":"sounds","prompt":"Which letter does \"bus\" start with?","answer":"b"},
        {"id":18,"type":"sounds","prompt":"Which letter does \"net\" start with?","answer":"n"},
        {"id":19,"type":"sounds","prompt":"Which letter does \"bed\" start with?","answer":"b"},
        {"id":20,"type":"sounds","prompt":"Which letter does \"moon\" start with?","answer":"m"},
        {"id":21,"type":"sounds","prompt":"Which letter does \"rat\" start with?","answer":"r"},
        {"id":22,"type":"sounds","prompt":"Which letter does \"dog\" start with?","answer":"d"},
        {"id":23,"type":"sounds","prompt":"Which letter does \"wig\" start with?","answer":"w"},
        {"id":24,"type":"sounds","prompt":"Which letter does \"rat\" start with?","answer":"r"}
]);
        checkFirstLetter(g0);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(soundsSpec, g0, seedFrom([0, 'sounds', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"sounds","prompt":"Which letter does \"net\" start with?","answer":"n"},
        {"id":26,"type":"sounds","prompt":"Which letter does \"moon\" start with?","answer":"m"},
        {"id":27,"type":"sounds","prompt":"Which letter does \"net\" start with?","answer":"n"}
]);
    });
});

describe('sounds — Year 1 (tier-2 common word set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g1)).toEqual([
        {"id":1,"type":"sounds","prompt":"Which letter does \"table\" start with?","answer":"t"},
        {"id":2,"type":"sounds","prompt":"Which letter does \"green\" start with?","answer":"g"},
        {"id":3,"type":"sounds","prompt":"Which letter does \"water\" start with?","answer":"w"},
        {"id":4,"type":"sounds","prompt":"Which letter does \"wig\" start with?","answer":"w"},
        {"id":5,"type":"sounds","prompt":"Which letter does \"house\" start with?","answer":"h"},
        {"id":6,"type":"sounds","prompt":"Which letter does \"dog\" start with?","answer":"d"},
        {"id":7,"type":"sounds","prompt":"Which letter does \"bread\" start with?","answer":"b"},
        {"id":8,"type":"sounds","prompt":"Which letter does \"grass\" start with?","answer":"g"},
        {"id":9,"type":"sounds","prompt":"Which letter does \"night\" start with?","answer":"n"},
        {"id":10,"type":"sounds","prompt":"Which letter does \"red\" start with?","answer":"r"},
        {"id":11,"type":"sounds","prompt":"Which letter does \"fan\" start with?","answer":"f"},
        {"id":12,"type":"sounds","prompt":"Which letter does \"bird\" start with?","answer":"b"},
        {"id":13,"type":"sounds","prompt":"Which letter does \"box\" start with?","answer":"b"},
        {"id":14,"type":"sounds","prompt":"Which letter does \"pin\" start with?","answer":"p"},
        {"id":15,"type":"sounds","prompt":"Which letter does \"shirt\" start with?","answer":"s"},
        {"id":16,"type":"sounds","prompt":"Which letter does \"bird\" start with?","answer":"b"},
        {"id":17,"type":"sounds","prompt":"Which letter does \"cat\" start with?","answer":"c"},
        {"id":18,"type":"sounds","prompt":"Which letter does \"sip\" start with?","answer":"s"},
        {"id":19,"type":"sounds","prompt":"Which letter does \"jam\" start with?","answer":"j"},
        {"id":20,"type":"sounds","prompt":"Which letter does \"purple\" start with?","answer":"p"},
        {"id":21,"type":"sounds","prompt":"Which letter does \"box\" start with?","answer":"b"},
        {"id":22,"type":"sounds","prompt":"Which letter does \"pot\" start with?","answer":"p"},
        {"id":23,"type":"sounds","prompt":"Which letter does \"wig\" start with?","answer":"w"},
        {"id":24,"type":"sounds","prompt":"Which letter does \"pot\" start with?","answer":"p"}
]);
        checkFirstLetter(g1);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(soundsSpec, g1, seedFrom([1, 'sounds', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"sounds","prompt":"Which letter does \"leg\" start with?","answer":"l"},
        {"id":26,"type":"sounds","prompt":"Which letter does \"bag\" start with?","answer":"b"},
        {"id":27,"type":"sounds","prompt":"Which letter does \"plane\" start with?","answer":"p"}
]);
    });
});

describe('sounds — Year 2 (tier-3 extended set)', () => {
    it('matches the exact page-1 sheet', () => {
        expect(sheet(g2)).toEqual([
        {"id":1,"type":"sounds","prompt":"Which letter does \"teacher\" start with?","answer":"t"},
        {"id":2,"type":"sounds","prompt":"Which letter does \"green\" start with?","answer":"g"},
        {"id":3,"type":"sounds","prompt":"Which letter does \"pig\" start with?","answer":"p"},
        {"id":4,"type":"sounds","prompt":"Which letter does \"tree\" start with?","answer":"t"},
        {"id":5,"type":"sounds","prompt":"Which letter does \"table\" start with?","answer":"t"},
        {"id":6,"type":"sounds","prompt":"Which letter does \"cat\" start with?","answer":"c"},
        {"id":7,"type":"sounds","prompt":"Which letter does \"red\" start with?","answer":"r"},
        {"id":8,"type":"sounds","prompt":"Which letter does \"wig\" start with?","answer":"w"},
        {"id":9,"type":"sounds","prompt":"Which letter does \"night\" start with?","answer":"n"},
        {"id":10,"type":"sounds","prompt":"Which letter does \"banana\" start with?","answer":"b"},
        {"id":11,"type":"sounds","prompt":"Which letter does \"map\" start with?","answer":"m"},
        {"id":12,"type":"sounds","prompt":"Which letter does \"fan\" start with?","answer":"f"},
        {"id":13,"type":"sounds","prompt":"Which letter does \"map\" start with?","answer":"m"},
        {"id":14,"type":"sounds","prompt":"Which letter does \"pin\" start with?","answer":"p"},
        {"id":15,"type":"sounds","prompt":"Which letter does \"plane\" start with?","answer":"p"},
        {"id":16,"type":"sounds","prompt":"Which letter does \"map\" start with?","answer":"m"},
        {"id":17,"type":"sounds","prompt":"Which letter does \"lemon\" start with?","answer":"l"},
        {"id":18,"type":"sounds","prompt":"Which letter does \"sun\" start with?","answer":"s"},
        {"id":19,"type":"sounds","prompt":"Which letter does \"sip\" start with?","answer":"s"},
        {"id":20,"type":"sounds","prompt":"Which letter does \"box\" start with?","answer":"b"},
        {"id":21,"type":"sounds","prompt":"Which letter does \"shirt\" start with?","answer":"s"},
        {"id":22,"type":"sounds","prompt":"Which letter does \"sun\" start with?","answer":"s"},
        {"id":23,"type":"sounds","prompt":"Which letter does \"fan\" start with?","answer":"f"},
        {"id":24,"type":"sounds","prompt":"Which letter does \"beautiful\" start with?","answer":"b"}
]);
        checkFirstLetter(g2);
    });

    it('page 2 continues the exact stream', () => {
        expect(generateDocument(soundsSpec, g2, seedFrom([2, 'sounds', 0]), 2).pages[1].slice(0, 3)).toEqual([
        {"id":25,"type":"sounds","prompt":"Which letter does \"grass\" start with?","answer":"g"},
        {"id":26,"type":"sounds","prompt":"Which letter does \"bus\" start with?","answer":"b"},
        {"id":27,"type":"sounds","prompt":"Which letter does \"teacher\" start with?","answer":"t"}
]);
    });

    it('returns an empty sheet for an unimplemented grade', () => {
        expect(generateSheet(soundsSpec, getGradeConfig(3), seedFrom([3, 'sounds', 0]))).toEqual([]);
    });
});
