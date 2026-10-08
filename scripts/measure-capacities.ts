// One-off capacity measurement: prints "<specId> <gradeId> <uniqueCount>" for
// every offered spec x grade at the 100-page ask. Run with:
//   & .\node_modules\.bin\vite-node.cmd scripts/measure-capacities.ts
//
// QUESTION IDENTITY: a "question" is what the CHILD SEES — the printed
// prompt, plus the displayed tile order for early-band Sentence Building
// rows (those prompts no longer carry the scrambled bank in the text; the
// bank is the `tileWords` metadata, see SentenceBuildingWorksheet.ts). The
// key below mirrors the generators' sampleUnique keys: for every other
// spec `tileWords` is undefined, so the identity is exactly the prompt.
import { seedFrom, getGradeConfig, createRng } from '../src/framework';
import {
    sightSpec, blendSpec, soundsSpec, vowelSpec, oppositeSpec, rhymeSpec,
    sentenceSpec, lettersSpec, capitalSpec, punctSpec, homophoneSpec,
    pluralSpec, similarSpec, wordgapSpec, spellingSpec, syllableSpec,
    grammarSpec, tenseSpec, conjunctionSpec, apostropheSpec, commaSpec,
    affixSpec, compoundSpec, speechSpec, homographSpec, pronounSpec,
    figurativeSpec, idiomSpec, advpunctSpec, agreementSpec
} from '../src/plugins/pins';

const SPECS = [
    sightSpec, blendSpec, soundsSpec, vowelSpec, oppositeSpec, rhymeSpec,
    sentenceSpec, lettersSpec, capitalSpec, punctSpec, homophoneSpec,
    pluralSpec, similarSpec, wordgapSpec, spellingSpec, syllableSpec,
    grammarSpec, tenseSpec, conjunctionSpec, apostropheSpec, commaSpec,
    affixSpec, compoundSpec, speechSpec, homographSpec, pronounSpec,
    figurativeSpec, idiomSpec, advpunctSpec, agreementSpec
];

for (const spec of SPECS) {
    for (const gradeId of [0, 1, 2, 3, 4, 5, 6]) {
        const grade = getGradeConfig(gradeId);
        if (!spec.offered(grade)) continue;
        const ask = spec.perPage * 100;
        const seed = seedFrom([grade.id, spec.id, 0]);
        const problems = spec.generate(createRng(seed), grade.caps, ask);
        const keyOf = (p: { prompt: string; tileWords?: string[] }) =>
            p.tileWords ? `${p.prompt} | ${p.tileWords.join('|')}` : p.prompt;
        const unique = new Set(problems.map(keyOf)).size;
        console.log(`${spec.id} ${gradeId} ${unique}`);
    }
}
