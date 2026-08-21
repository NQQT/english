// Left-hand sidebar: the English-type picker. Shows only the sheet types
// offered for the currently selected grade; for grades without content it
// shows a "coming soon" placeholder instead.
//
// Design: a white rail of icon+label list buttons; the active type gets a
// teal-tinted fill (the English theme colour, vs maths' indigo). From sm up
// the rail is position:sticky (pins under the sticky header while the window
// scrolls the continuous page stack — app.css job 1); on narrow screens (xs)
// it collapses to a horizontal chip strip above the canvas.
import React from 'react';
import { styledComponent } from '@presource/react';
import { ENGLISH_TYPES, type EnglishTypeId } from '../lib/problems';
import type { GradeConfig } from '../lib/grades';

export type TypeSidebarProps = {
    // The selected grade; its `available` list drives which types are shown.
    grade: GradeConfig;
    // Currently selected English type (must be in grade.available).
    value: EnglishTypeId;
    onChange: (id: EnglishTypeId) => void;
};

// One compact glyph per sheet type, shown in the button's icon chip.
// Exported so the dashboard test can pin the rail's EXACT text
// (icon glyph + label per button, no count badges).
export const TYPE_ICONS: Record<EnglishTypeId, string> = {
    sight: 'A',
    blend: 'ab',
    sounds: '♪',
    vowel: 'e',
    opposite: '⇄',
    rhyme: '≈',
    sentence: '¶',
    letters: 'Az',
    capital: 'A!',
    punct: '?',
    homophone: '2',
    plural: 's',
    similar: '≡',
    wordgap: '§',
    spelling: '✎',
    syllable: '∿',
    grammar: '&',
    tense: '→',
    // Tracing glyphs: ⌗ (viewdata square) reads as a "dotted grid to trace
    // over"; 'a' echoes lowercase word shapes; '12' stands in for digits.
    letterTrace: '⌗',
    wordTrace: 'a',
    numberTrace: '12'
};

// Left rail: content-height box (align-self: flex-start — it does NOT stretch
// to the full page height). From sm up it is position:sticky so it pins under
// the sticky header while the WINDOW scrolls the continuous page stack
// (app.css job 1); a viewport-capped maxHeight makes long type lists scroll
// inside the rail instead of stretching it past the window. xs: the rail
// collapses to a static horizontal chip strip above the canvas.
const Sidebar = styledComponent('div', {
    display: 'flex',
    gap: '6px',
    padding: '16px',
    boxSizing: 'border-box',
    background: '#ffffff',
    overflowY: 'auto',
    // Responsive shape:
    //   xs — full-width static strip above the canvas: row direction, wraps,
    //        scrolls horizontally instead of overflowing.
    //   sm+ — sticky 264px rail that hugs its content and pins under the
    //         64px sticky header while the window scrolls.
    flexDirection: () => ({ xs: 'row', sm: 'column' }),
    flexWrap: () => ({ xs: 'wrap', sm: 'nowrap' }),
    width: () => ({ xs: '100%', sm: '264px' }),
    alignSelf: 'flex-start',
    position: () => ({ xs: 'static', sm: 'sticky' }),
    top: () => ({ xs: '0px', sm: '64px' }),
    maxHeight: () => ({ xs: 'none', sm: 'calc(100vh - 80px)' }),
    zIndex: 10,
    flexShrink: 0,
    overflowX: () => ({ xs: 'auto', sm: 'hidden' }),
    borderRight: () => ({ xs: 'none', sm: '1px solid #d9e6e2' }),
    borderBottom: () => ({ xs: '1px solid #d9e6e2', sm: 'none' })
});

const SidebarHeading = styledComponent('h2', {
    // On xs the heading rides inline above the chip row (width 100% forces the
    // wrap); on sm+ it is the first column item.
    width: () => ({ xs: '100%', sm: 'auto' }),
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#94a3b8',
    margin: '0 0 6px 0',
    flexShrink: 0
});

// Active row: teal-100 fill / teal-200 ring / teal-900 text (mirrors the
// maths indigo-tinted active button, recoloured for the English theme).
const TypeButton = styledComponent<{ active: boolean }>('button', {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '9px 10px',
    flexShrink: 0,
    // xs: auto-width chip that can share a wrapped row; sm+ full-width row.
    width: () => ({ xs: 'auto', sm: '100%' }),
    border: ({ active }) => (active ? '1px solid #99f6e4' : '1px solid transparent'),
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: ({ active }) => (active ? 600 : 500),
    textAlign: 'left',
    whiteSpace: 'nowrap',
    background: ({ active }) => (active ? '#ccfbf1' : '#f6fbf9'),
    color: ({ active }) => (active ? '#134e4a' : '#334155'),
    transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease'
});

const TypeIcon = styledComponent<{ active: boolean }>('span', {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px',
    flexShrink: 0,
    borderRadius: '9px',
    fontSize: '15px',
    userSelect: 'none',
    background: ({ active }) => (active ? '#0d9488' : '#ccfbf1'),
    color: ({ active }) => (active ? '#ffffff' : '#0d9488')
});

const TypeLabel = styledComponent('span', {
    flex: '1',
    minWidth: '32px',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
});

// NOTE: the rail used to show a per-type "questions per page" count badge in
// the maths distribution (SHEET_COUNTS, still used internally by
// generateDocument in problems.ts). It is NOT shown here: with the unbounded
// Pages stepper and the "Randomize" action, a selection can regenerate any
// number of pages, so a fixed per-type number next to each rail item
// communicated nothing a teacher could act on.

// Shown when a grade has no content implemented yet.
const Notice = styledComponent('div', {
    padding: '14px',
    background: '#f6fbf9',
    border: '1px solid #d9e6e2',
    borderRadius: '12px',
    color: '#475569',
    fontSize: '14px',
    lineHeight: 1.5,
    width: () => ({ xs: '100%', sm: 'auto' })
});

export function TypeSidebar({ grade, value, onChange }: TypeSidebarProps) {
    // No content for this grade yet (Year 3 and above) — show a placeholder.
    if (!grade.implemented || grade.available.length === 0) {
        return (
            <Sidebar className="scrollbar-hidden">
                <SidebarHeading>English Type</SidebarHeading>
                <Notice>
                    <strong>{grade.label}</strong> worksheets are coming soon.
                    <br />
                    Pick Prep, Year 1 or Year 2 to start.
                </Notice>
            </Sidebar>
        );
    }

    // Only list the types this grade actually offers, in catalogue order.
    const types = ENGLISH_TYPES.filter((t) => grade.available.includes(t.id));
    return (
        <Sidebar className="scrollbar-hidden">
            <SidebarHeading>English Type</SidebarHeading>
            {types.map((t) => (
                // aria-label pins the accessible name to the type label so the
                // icon glyph doesn't pollute it.
                <TypeButton
                    key={t.id}
                    active={t.id === value}
                    aria-label={t.label}
                    onClick={() => onChange(t.id)}
                >
                    <TypeIcon active={t.id === value} aria-hidden="true">
                        {TYPE_ICONS[t.id]}
                    </TypeIcon>
                    <TypeLabel>{t.label}</TypeLabel>
                </TypeButton>
            ))}
        </Sidebar>
    );
}