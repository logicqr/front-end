import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Variable fonts, self-hosted. Loading them this way avoids a render-blocking
// request to a third-party font host and keeps the face stable offline.
import '@fontsource-variable/inter';
import '@fontsource-variable/roboto-serif';
import '@fontsource-variable/roboto-serif/opsz-italic.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';

import './styles/tokens.css';
import './index.css';
import './styles/marketing.css';
import './styles/demo.css';
import './styles/review.css';

import App from './App.jsx';

/**
 * There used to be a `contextmenu` listener here blocking right-click across
 * the whole site. It offered no protection — the source is already in the
 * browser — and it broke copy, paste, open-in-new-tab, spell-check and several
 * assistive technologies, including on the public review page the customers of
 * our customers use. Removed.
 */

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
