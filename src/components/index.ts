// Barrel export for the dashboard UI components. The A4 layout components
// (PrintableSheet / PageStack / ZoomControl / page-scale) and the grade
// selector now live in the framework (src/framework) — this directory only
// hosts the dashboard HOST shell.
// (No in-app print review screen exists: the preview canvas IS the print
// preview, and the toolbar Print button opens the browser-native print
// dialog directly.)
export * from './EnglishDashboard';
