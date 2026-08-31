// TEMP dump script — regenerates pinned sheet values for the reworked
// generators. Deleted after the test files are re-pinned.
import { seedFrom, getGradeConfig, generateSheet, generateDocument, createRng, type WorksheetSpec, type GradeConfig } from './src/framework';
import { sightSpec } from './src/plugins/SightWordsWorksheet';
import { blendSpec } from './src/plugins/BlendingWorksheet';
import { soundsSpec } from './src/plugins/BeginningSoundsWorksheet';
import { vowelSpec } from './src/plugins/VowelsWorksheet';
import { oppositeSpec } from './src/plugins/OppositeWordsWorksheet';
import { rhymeSpec } from './src/plugins/RhymingWordsWorksheet';
import { sentenceSpec } from './src/plugins/SentenceBuildingWorksheet';
import { lettersSpec } from './src/plugins/AlphabetOrderWorksheet';
import { capitalSpec } from './src/plugins/CapitalLettersWorksheet';
import { punctSpec } from './src/plugins/PunctuationWorksheet';
import { homophoneSpec } from './src/plugins/TwinWordsWorksheet';
import { pluralSpec } from './src/plugins/PluralsWorksheet';
import { similarSpec } from './src/plugins/SimilarWordsWorksheet';
import { wordgapSpec } from './src/plugins/WordGapsWorksheet';
import { spellingSpec } from './src/plugins/SpellingWorksheet';
import { syllableSpec } from './src/plugins/SyllablesWorksheet';
import { grammarSpec } from './src/plugins/NounsVerbsWorksheet';
import { tenseSpec } from './src/plugins/PastTenseWorksheet';

const SPECS: WorksheetSpec[] = [
    sightSpec, blendSpec, soundsSpec, vowelSpec, oppositeSpec, rhymeSpec, sentenceSpec,
    lettersSpec, capitalSpec, punctSpec, homophoneSpec, pluralSpec, similarSpec,
    wordgapSpec, spellingSpec, syllableSpec, grammarSpec, tenseSpec
];

const out: any = {};
for (const spec of SPECS) {
    const entry: any = {};
    for (const gradeId of [0, 1, 2]) {
        const grade = getGradeConfig(gradeId);
        if (!grade.implemented || !spec.offered(grade)) continue;
        const seed = seedFrom([grade.id, spec.id, 0]);
        const page1 = generateSheet(spec, grade, seed);
        const page2 = generateDocument(spec, grade, seed, 2).pages[1].slice(0, 3);
        const big = spec.generate(createRng(seed), grade.caps, 1000);
        const prompts = big.map((p) => p.prompt);
        const unique = new Set(prompts);
        entry[gradeId] = {
            page1,
            page2,
            capacity: unique.size,
            uniquePrefix: (() => {
                let n = 0;
                const seen = new Set<string>();
                for (const p of prompts) {
                    if (seen.has(p)) break;
                    seen.add(p);
                    n++;
                }
                return n;
            })()
        };
    }
    out[spec.id] = entry;
}
console.log(JSON.stringify(out, null, 2));
