// T15 throwaway: emit corrected-model worst pages per family/grade (key ON/
// OFF) so the print-capacity.test.ts pins can be hardcoded exactly.
import { createRng, seedFrom, getGradeConfig, type WorksheetSpec } from '../src/framework';
import { comprehensionSpec, craftSpec, writingSpec, editingSpec } from '../src/plugins/pins';

const CHARS_PER_LINE = 45, PROMPT_LINE_PX = 30, ANSWER_LINE_PX = 18.2, ANSWER_MARGIN_PX = 4, ROW_GAP_PX = 16;
const SEEDS = [0, 11, 23, 41];
const printedLines = (s: string) =>
    s.split('\n').reduce((n, line) => n + Math.max(1, Math.ceil(line.replace(/__/g, '').trimEnd().length / CHARS_PER_LINE)), 0);
const pageHeight = (rows: { prompt: string; answer: string }[], keyOn: boolean) =>
    rows.reduce((h, r) => h + printedLines(r.prompt) * PROMPT_LINE_PX + (keyOn ? printedLines(r.answer) * ANSWER_LINE_PX + ANSWER_MARGIN_PX : 0), 0) +
    Math.max(0, rows.length - 1) * ROW_GAP_PX;
function worst(spec: WorksheetSpec, gid: number, keyOn: boolean): number {
    const grade = getGradeConfig(gid);
    let w = 0;
    for (const seed of SEEDS) {
        const rows = spec.generate(createRng(seedFrom([gid, spec.id, seed])), grade.caps, spec.perPage * 100);
        for (let p = 0; p * spec.perPage < rows.length; p++) {
            const page = rows.slice(p * spec.perPage, (p + 1) * spec.perPage);
            if (!page.length) break;
            w = Math.max(w, pageHeight(page, keyOn));
        }
    }
    return Number(w.toFixed(1));
}
for (const spec of [comprehensionSpec, craftSpec, writingSpec, editingSpec]) {
    for (const gid of [3, 4, 5, 6]) {
        console.log(`${spec.id} ${gid} ${worst(spec, gid, true)} ${worst(spec, gid, false)}`);
    }
}
