// ─────────────────────────────────────────────────────────────────────────────
// The DashboardFramework — the bundle of configurations + layouts the
// dashboard hands to EVERY worksheet plugin factory when it loads it.
//
// A worksheet plugin is a function like SightWordsWorksheet(dashboard):
//
//   export function SightWordsWorksheet(dashboard: DashboardFramework): DashboardPlugin {
//       return dashboard.createWorksheet({ id: 'sight', label: 'Sight & Real Words', ... });
//   }
//
// Within the function the plugin describes its sidebar label and what happens
// when its label is clicked (its worksheet shows in the content area) — using
// the framework's standard worksheet recipe, grade configuration, deterministic
// seeding and A4 layouts provided here.
//
// The framework is created through createDashboardFramework(config): the
// config carries the subject-specific chrome (print footer brand line, empty
// state glyph) so the kit/layout components themselves stay subject-neutral.
// Swapping them (maths: 'Maths Sheets'/'∑') is a one-line change.
// ─────────────────────────────────────────────────────────────────────────────

import { GRADES, getGradeConfig, type GradeConfig } from './grades';
import { createRng, seedFrom } from './rng';
import { PageStack } from './PageStack';
import { PrintableSheet } from './PrintableSheet';
import { ZoomControl } from './ZoomControl';
import { createWorksheet, type DashboardFrameworkConfig } from './worksheet-kit';
import { useDashboardSession } from './store';
import { definePlugin, type DashboardPlugin, type DashboardSession, type WorksheetSpec } from './types';

export type { DashboardFrameworkConfig } from './worksheet-kit';

// A plugin FACTORY — the uninvoked function a plugin module exports. The
// plugin list (plugins/index.ts) stores factories UNINVOKED so the dashboard
// can render first and then load them ONE BY ONE after mount (loader.ts);
// loading = calling the factory with the framework bundle.
export type PluginFactory = (dashboard: DashboardFramework) => DashboardPlugin;

export type DashboardFramework = {
    // This instance's subject-specific chrome configuration.
    config: DashboardFrameworkConfig;
    // The framework's standard worksheet recipe: builds the full plugin
    // (rail entry + toolbar + page + print + grade gating) from a spec.
    createWorksheet: (spec: WorksheetSpec) => DashboardPlugin;
    // The shared dashboard session state (grade, pages, zoom, refresh) —
    // reactive: mutations re-render subscribed components synchronously.
    useSession: () => DashboardSession;
    // Grade catalogue (the dashboard's configuration).
    GRADES: readonly GradeConfig[];
    getGradeConfig: (id: number) => GradeConfig;
    // Deterministic seeding + PRNG for plugin generators.
    seedFrom: typeof seedFrom;
    createRng: typeof createRng;
    // A4 layout components a custom plugin can compose its own surfaces from.
    PageStack: typeof PageStack;
    PrintableSheet: typeof PrintableSheet;
    ZoomControl: typeof ZoomControl;
    // Plugin factory helper (single injection point for future concerns).
    definePlugin: typeof definePlugin;
};

// Build a framework bundle for a dashboard instance.
export function createDashboardFramework(config: DashboardFrameworkConfig): DashboardFramework {
    return {
        config,
        // Bind this instance's config into the standard worksheet recipe.
        createWorksheet: (spec) => createWorksheet(spec, config),
        useSession: useDashboardSession,
        GRADES,
        getGradeConfig,
        seedFrom,
        createRng,
        PageStack,
        PrintableSheet,
        ZoomControl,
        definePlugin
    };
}

// The singleton bundle passed to every worksheet factory in plugins/index.ts.
// English distribution chrome: "English Worksheets" print footer (R4 brand —
// no version on paper, the version belongs to the app title only), "Aa" glyph.
export const DASHBOARD_FRAMEWORK: DashboardFramework = createDashboardFramework({
    printBrand: 'English Worksheets',
    emptyGlyph: 'Aa'
});
