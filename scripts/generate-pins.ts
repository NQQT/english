// One-off pin generator: regenerates the exact deterministic sheets the
// per-plugin test files pin. Run with:
//   npx vite-node scripts/generate-pins.ts > pins.json
// (Output is JSON keyed by "<specId>:<gradeId>" -> { page1: Problem[],
//   page2head: Problem[3] }.)
//
// NOTE: this script is a development tool, NOT part of the test suite. It
// exists so a future agent can regenerate pins after changing a generator or
// word bank without hand-copying values.

import { seedFrom, getGradeConfig, generateSheet, generateDocument } from '../src/framework';
import {
    sightSpec, blendSpec, soundsSpec, vowelSpec, oppositeSpec, rhymeSpec,
    sentenceSpec, lettersSpec, capitalSpec, punctSpec, homophoneSpec,
    pluralSpec, similarSpec, wordgapSpec, spellingSpec, syllableSpec,
    grammarSpec, tenseSpec, conjunctionSpec, apostropheSpec, commaSpec,
    affixSpec, compoundSpec, speechSpec, homographSpec, pronounSpec,
    comprehensionSpec, craftSpec, writingSpec, editingSpec,
    figurativeSpec, idiomSpec, advpunctSpec, agreementSpec, wordTraceSpec
} from '../src/plugins/pins';

const SPECS = [
    sightSpec, blendSpec, soundsSpec, vowelSpec, oppositeSpec, rhymeSpec,
    sentenceSpec, lettersSpec, capitalSpec, punctSpec, homophoneSpec,
    pluralSpec, similarSpec, wordgapSpec, spellingSpec, syllableSpec,
    grammarSpec, tenseSpec, conjunctionSpec, apostropheSpec, commaSpec,
    affixSpec, compoundSpec, speechSpec, homographSpec, pronounSpec,
    comprehensionSpec, craftSpec, writingSpec, editingSpec,
    figurativeSpec, idiomSpec, advpunctSpec, agreementSpec, wordTraceSpec
];

// Grades that list each spec id (its offered grades).
const out: Record<string, unknown> = {};
for (const spec of SPECS) {
    for (const gradeId of [0, 1, 2, 3, 4, 5, 6]) {
        const grade = getGradeConfig(gradeId);
        if (!spec.offered(grade)) continue;
        const seed = seedFrom([grade.id, spec.id, 0]);
        const page1 = generateSheet(spec, grade, seed);
        const page2head = generateDocument(spec, grade, seed, 2).pages[1].slice(0, 3);
        out[`${spec.id}:${gradeId}`] = { page1, page2head };
    }
}
console.log(JSON.stringify(out, null, 1));
