// ─────────────────────────────────────────────────────────────────────────────
// FRAMEWORK THEME — the distribution's colour palette.
//
// The framework chrome (rail buttons, grade pills, toolbar, canvas, zoom
// dock) is generic; this module is the ONLY place that knows the colours, so
// hosting another subject distribution = swapping this palette (maths uses
// indigo on slate: primary #4f46e5, hairlines #e4e9f2, canvas #eef1f7, active
// fills #eef2ff/#c7d2fe — see distribution/maths/src/framework).
//
// English = TEAL on a sea-glass background (original components/ palette):
// background #eef5f3 (host-owned), primary action #0d9488, active tints
// #ccfbf1/#99f6e4, hairlines #d9e6e2, canvas #e6f0ed with #cfe3de dots.
// ─────────────────────────────────────────────────────────────────────────────

export const THEME = {
    // Preview canvas / page field: pale teal with a subtle dot grid.
    canvasBg: '#e6f0ed',
    canvasDot: '#cfe3de',
    // Hairline borders (toolbar card, canvas frame, ghost buttons, pills).
    hairline: '#d9e6e2',
    // Soft fill for stepper/zoom group pills.
    pillBg: '#e6efec',
    // Idle rail button background (slightly tinted white).
    railIdleBg: '#f6fbf9',
    // Rail "coming soon" notice card background.
    noticeBg: '#f6fbf9',
    // Primary accent (Print button, active icon chips).
    primary: '#0d9488',
    // Primary button glow.
    primaryShadow: 'rgba(13,148,136,0.35)',
    // Active grade-pill glow (softer than the button glow).
    primaryPillShadow: 'rgba(13,148,136,0.2)',
    // Active rail entry / grade pill fill + ring.
    activeFill: '#ccfbf1',
    activeRing: '#99f6e4',
    // Active text colours (rail entries are darker than pills).
    activeRailText: '#134e4a',
    activePillText: '#0f766e'
} as const;
