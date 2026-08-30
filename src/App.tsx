// App root — mounts the English worksheet dashboard.
//
// The dashboard is a thin framework HOST (grade selector top-right, plugin
// rail on the left, worksheet toolbar + preview + print on the right); every
// worksheet is a self-contained plugin under src/plugins/. See
// src/components/EnglishDashboard.tsx for the shell and src/framework/ for
// the plugin contract.

import { EnglishDashboard } from './components/EnglishDashboard';

export function App() {
    return <EnglishDashboard />;
}