// Barrel for the worksheet SPECS only — the pin generator (scripts/
// generate-pins.ts) imports every spec in one place. Plugins' runtime list
// stays in index.ts (uninvoked factories); this barrel is a test/tool
// convenience and never imported by the app.
export { sightSpec } from './SightWordsWorksheet';
export { blendSpec } from './BlendingWorksheet';
export { soundsSpec } from './BeginningSoundsWorksheet';
export { vowelSpec } from './VowelsWorksheet';
export { oppositeSpec } from './OppositeWordsWorksheet';
export { rhymeSpec } from './RhymingWordsWorksheet';
export { sentenceSpec } from './SentenceBuildingWorksheet';
export { lettersSpec } from './AlphabetOrderWorksheet';
export { capitalSpec } from './CapitalLettersWorksheet';
export { punctSpec } from './PunctuationWorksheet';
export { homophoneSpec } from './TwinWordsWorksheet';
export { pluralSpec } from './PluralsWorksheet';
export { similarSpec } from './SimilarWordsWorksheet';
export { wordgapSpec } from './WordGapsWorksheet';
export { spellingSpec } from './SpellingWorksheet';
export { syllableSpec } from './SyllablesWorksheet';
export { grammarSpec } from './NounsVerbsWorksheet';
export { tenseSpec } from './PastTenseWorksheet';
export { conjunctionSpec } from './ConjunctionWorksheet';
export { apostropheSpec } from './ApostropheWorksheet';
export { commaSpec } from './CommaListWorksheet';
export { affixSpec } from './AffixWorksheet';
export { compoundSpec } from './CompoundWorksheet';
export { speechSpec } from './SpeechWorksheet';
export { homographSpec } from './HomographWorksheet';
export { pronounSpec } from './PronounWorksheet';
export { figurativeSpec } from './FigurativeWorksheet';
export { idiomSpec } from './IdiomWorksheet';
export { advpunctSpec } from './AdvancedPunctuationWorksheet';
export { agreementSpec } from './AgreementWorksheet';
