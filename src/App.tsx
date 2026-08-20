// App root — mounts the English worksheet dashboard.
//
// The dashboard itself is fully self-contained (grade selector top-right,
// English type sidebar on the left, printable sheet preview + print on the
// right). See src/components/EnglishDashboard.tsx for the layout/behaviour.

import { EnglishDashboard } from './components/EnglishDashboard';

export function App() {
    return <EnglishDashboard />;
}