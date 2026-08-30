// ─────────────────────────────────────────────────────────────────────────────
// THE WORKSHEET PLUGIN LIST — the single registration point of the dashboard.
//
// Every worksheet is a PLUGIN: a factory FUNCTION (SightWordsWorksheet,
// BlendingWorksheet, BeginningSoundsWorksheet, ...) that the dashboard LOADS
// by calling it with the framework's configurations + layouts
// (DASHBOARD_FRAMEWORK). Within each function the plugin describes its
// sidebar label and what happens when its label is clicked (its worksheet
// shows in the content area).
//
// This is the ONLY file that changes when adding or removing a worksheet
// (besides the plugin's own file, which is fully self-contained):
//
//   ADD     a worksheet:  create src/plugins/<Name>Worksheet.ts exporting the
//                         factory function and add one line to PLUGINS below.
//   DELETE  a worksheet:  delete its file and remove its line here. Nothing
//                         else in the app references it — no imports, no
//                         shared state, no framework code changes. The
//                         framework falls back to the remaining plugins
//                         automatically.
//
// The array ORDER is the UI order: plugins appear in the left rail in this
// sequence (grade-gated), and the first plugin's entry is the default
// selection. The order mirrors the curriculum catalogue (Sight & Real Words
// first, the Prep handwriting tracing set last).
// ─────────────────────────────────────────────────────────────────────────────

import { DASHBOARD_FRAMEWORK, type DashboardPlugin } from '../framework';
import { SightWordsWorksheet } from './SightWordsWorksheet';
import { BlendingWorksheet } from './BlendingWorksheet';
import { BeginningSoundsWorksheet } from './BeginningSoundsWorksheet';
import { VowelsWorksheet } from './VowelsWorksheet';
import { OppositeWordsWorksheet } from './OppositeWordsWorksheet';
import { RhymingWordsWorksheet } from './RhymingWordsWorksheet';
import { SentenceBuildingWorksheet } from './SentenceBuildingWorksheet';
import { AlphabetOrderWorksheet } from './AlphabetOrderWorksheet';
import { CapitalLettersWorksheet } from './CapitalLettersWorksheet';
import { PunctuationWorksheet } from './PunctuationWorksheet';
import { TwinWordsWorksheet } from './TwinWordsWorksheet';
import { PluralsWorksheet } from './PluralsWorksheet';
import { SimilarWordsWorksheet } from './SimilarWordsWorksheet';
import { WordGapsWorksheet } from './WordGapsWorksheet';
import { SpellingWorksheet } from './SpellingWorksheet';
import { SyllablesWorksheet } from './SyllablesWorksheet';
import { NounsVerbsWorksheet } from './NounsVerbsWorksheet';
import { PastTenseWorksheet } from './PastTenseWorksheet';
import { LetterTracingWorksheet } from './LetterTracingWorksheet';
import { WordTracingWorksheet } from './WordTracingWorksheet';
import { NumberTracingWorksheet } from './NumberTracingWorksheet';

// All installed worksheet plugins, in display order. The dashboard loads each
// by calling its factory function with its framework bundle — the plugin then
// contributes its sidebar entry, toolbar, page and print surfaces.
export const PLUGINS: DashboardPlugin[] = [
    SightWordsWorksheet(DASHBOARD_FRAMEWORK),
    BlendingWorksheet(DASHBOARD_FRAMEWORK),
    BeginningSoundsWorksheet(DASHBOARD_FRAMEWORK),
    VowelsWorksheet(DASHBOARD_FRAMEWORK),
    OppositeWordsWorksheet(DASHBOARD_FRAMEWORK),
    RhymingWordsWorksheet(DASHBOARD_FRAMEWORK),
    SentenceBuildingWorksheet(DASHBOARD_FRAMEWORK),
    AlphabetOrderWorksheet(DASHBOARD_FRAMEWORK),
    CapitalLettersWorksheet(DASHBOARD_FRAMEWORK),
    PunctuationWorksheet(DASHBOARD_FRAMEWORK),
    TwinWordsWorksheet(DASHBOARD_FRAMEWORK),
    PluralsWorksheet(DASHBOARD_FRAMEWORK),
    SimilarWordsWorksheet(DASHBOARD_FRAMEWORK),
    WordGapsWorksheet(DASHBOARD_FRAMEWORK),
    SpellingWorksheet(DASHBOARD_FRAMEWORK),
    SyllablesWorksheet(DASHBOARD_FRAMEWORK),
    NounsVerbsWorksheet(DASHBOARD_FRAMEWORK),
    PastTenseWorksheet(DASHBOARD_FRAMEWORK),
    LetterTracingWorksheet(DASHBOARD_FRAMEWORK),
    WordTracingWorksheet(DASHBOARD_FRAMEWORK),
    NumberTracingWorksheet(DASHBOARD_FRAMEWORK)
];
