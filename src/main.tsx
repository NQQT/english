// React entry point — mounts the App component into the #root DOM element.
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
// Global stylesheet: continuous document flow (window-level vertical
// scrollbar scrolls the A4 preview, like native print) + print rules
// (window.print() prints the hidden .print-doc tree, one A4 block per page).
// See app.css for the two jobs + the teal theme note.
import './app.css';

// R4 document title: "English Worksheets v{version}" — the version is the
// compile-time __APP_VERSION__ global injected from package.json by
// vite.config.ts (never hardcoded). The worksheet Print flow temporarily
// retitles the tab to the sheet title and restores whatever is set here.
document.title = `English Worksheets v${__APP_VERSION__}`;

// Locate the root DOM node and create a React 18 root
const root = ReactDOM.createRoot(document.getElementById('root')!);

// Render the App wrapped in StrictMode for development warnings
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);