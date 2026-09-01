// One-off test-rewriting tool: patches the per-plugin .test.ts files so their
// pinned sheets match the CURRENT generators (from pins.json), and updates the
// stale grade-gating assertions (Year 3+ now implemented).
//
// Run:  node scripts/rewrite-tests.cjs
// NOT part of the test suite — a dev tool, kept for future generator changes.

const fs = require('fs');
const path = require('path');

// strip BOM if present (PowerShell Out-File writes UTF-8 with BOM)
const rawPins = fs.readFileSync(path.join(__dirname, '..', 'pins.json'), 'utf8');
const pins = JSON.parse(rawPins.charCodeAt(0) === 0xfeff ? rawPins.slice(1) : rawPins);

const pluginsDir = path.join(__dirname, '..', 'src', 'plugins');

// specId -> { specVar, testFile }
const TARGETS = {
    sight: { specVar: 'sightSpec', file: 'SightWordsWorksheet.test.ts' },
    blend: { specVar: 'blendSpec', file: 'BlendingWorksheet.test.ts' },
    sounds: { specVar: 'soundsSpec', file: 'BeginningSoundsWorksheet.test.ts' },
    vowel: { specVar: 'vowelSpec', file: 'VowelsWorksheet.test.ts' },
    opposite: { specVar: 'oppositeSpec', file: 'OppositeWordsWorksheet.test.ts' },
    rhyme: { specVar: 'rhymeSpec', file: 'RhymingWordsWorksheet.test.ts' },
    sentence: { specVar: 'sentenceSpec', file: 'SentenceBuildingWorksheet.test.ts' },
    letters: { specVar: 'lettersSpec', file: 'AlphabetOrderWorksheet.test.ts' },
    capital: { specVar: 'capitalSpec', file: 'CapitalLettersWorksheet.test.ts' },
    punct: { specVar: 'punctSpec', file: 'PunctuationWorksheet.test.ts' },
    homophone: { specVar: 'homophoneSpec', file: 'TwinWordsWorksheet.test.ts' },
    plural: { specVar: 'pluralSpec', file: 'PluralsWorksheet.test.ts' },
    similar: { specVar: 'similarSpec', file: 'SimilarWordsWorksheet.test.ts' },
    wordgap: { specVar: 'wordgapSpec', file: 'WordGapsWorksheet.test.ts' },
    spelling: { specVar: 'spellingSpec', file: 'SpellingWorksheet.test.ts' },
    syllable: { specVar: 'syllableSpec', file: 'SyllablesWorksheet.test.ts' },
    grammar: { specVar: 'grammarSpec', file: 'NounsVerbsWorksheet.test.ts' },
    tense: { specVar: 'tenseSpec', file: 'PastTenseWorksheet.test.ts' },
};

// Render a pinned problem in the same JSON-per-line style the tests use.
const row = (p) => JSON.stringify(p);

for (const [specId, { file }] of Object.entries(TARGETS)) {
    const fp = path.join(pluginsDir, file);
    let text = fs.readFileSync(fp, 'utf8');
    const specPins = Object.entries(pins)
        .filter(([k]) => k.startsWith(`${specId}:`))
        .map(([k, v]) => ({ gradeId: Number(k.split(':')[1]), ...v }));

    // ── 1. Grade-gating assertions: Year 3 is now implemented & offers the type.
    // "is gated by the grade catalogue" blocks that end with a Y3 `toBe(false)`
    // get the Y3 line flipped to true plus Y4..Y6 true and Y7 false.
    text = text.replace(
        /(\n\s*)expect\((\w+)Spec\.offered\(getGradeConfig\(3\)\)\)\.toBe\(false\);/g,
        (m, pad, spec) =>
            `${pad}expect(${spec}Spec.offered(getGradeConfig(3))).toBe(true);` +
            `${pad}expect(${spec}Spec.offered(getGradeConfig(6))).toBe(true);` +
            `${pad}expect(${spec}Spec.offered(getGradeConfig(7))).toBe(false);`
    );
    // Old comment lines naming Year 3 as the unimplemented grade.
    text = text.replace(
        /it\('is gated by the grade catalogue \(all implemented grades offer it\)'/g,
        "it('is gated by the grade catalogue (Years 0..6 offer it, Year 7 does not)'"
    );
    text = text.replace(
        /it\('is gated by the grade catalogue \(Year 1 and Year 2 only\)'/g,
        "it('is gated by the grade catalogue (Year 1..6 offer it, Year 7 does not)'"
    );
    text = text.replace(
        /it\('is gated by the grade catalogue \(Year 2 only\)'/g,
        "it('is gated by the grade catalogue (Year 2..6 offer it, Year 7 does not)'"
    );
    text = text.replace(
        /it\('is gated by the grade catalogue \(Prep, Year 1 and Year 2 offer it\)'/g,
        "it('is gated by the grade catalogue (Prep..Year 6 offer it, Year 7 does not)'"
    );
    // "returns an empty sheet for an unimplemented grade" — switch grade 3 -> 7.
    // Two call shapes exist: bare and inside generateSheet(...) with the spec var.
    text = text.replace(
        /generateSheet\((\w+Spec), getGradeConfig\(3\), seedFrom\(\[3, '(\w+)', 0\]\)\)/g,
        "generateSheet($1, getGradeConfig(7), seedFrom([7, '$2', 0]))"
    );
    text = text.replace(
        /\(getGradeConfig\(3\), seedFrom\(\[3, '(\w+)', 0\]\)\)/g,
        "(getGradeConfig(7), seedFrom([7, '$1', 0]))"
    );

    // ── 2. Regenerate the pinned page-1 sheets and page-2 heads from pins.json.
    for (const { gradeId, page1, page2head } of specPins) {
        // page-1 pin: expect(sheet(gN)).toEqual([ ... ]);
        const page1Regex = new RegExp(
            `(expect\\(sheet\\(g${gradeId}\\)\\)\\.toEqual\\(\\[)[\\s\\S]*?(\\]\\);)`
        );
        const page1Body = `\n        ${page1.map(row).join(',\n        ')},\n        `;
        if (page1Regex.test(text)) {
            text = text.replace(page1Regex, `$1${page1Body}$2`);
        } else if (page1.length) {
            console.warn(`  no page-1 pin slot for ${specId} g${gradeId}`);
        }
        // page-2 head pin: expect(generateDocument(...g${gradeId}...).pages[1].slice(0, 3)).toEqual([ ... ]);
        const page2Regex = new RegExp(
            `(expect\\(generateDocument\\([^)]*g${gradeId}[^)]*\\), 2\\)\\.pages\\[1\\]\\.slice\\(0, 3\\)\\)\\.toEqual\\(\\[)[\\s\\S]*?(\\]\\);)`
        );
        const page2Body = `\n        ${page2head.map(row).join(',\n        ')},\n        `;
        if (page2Regex.test(text)) {
            text = text.replace(page2Regex, `$1${page2Body}$2`);
        } else if (page2head.length) {
            console.warn(`  no page-2 pin slot for ${specId} g${gradeId}`);
        }
    }

    fs.writeFileSync(fp, text);
    console.log(`rewrote ${file} (${specPins.length} grade pins)`);
}
