/**
 * Yjs + y-codemirror integration for collaborative code editing
 * This replaces the basic WebSocket implementation with a CRDT-based system
 */

import * as Y from 'yjs';
import { CodemirrorBinding } from 'y-codemirror';
import { WebsocketProvider } from 'y-websocket';

// Use global CodeMirror loaded from CDN (not npm package)
const CodeMirror = window.CodeMirror;

// Language mode configuration
const MODE_MAP = {
  'JavaScript': 'javascript',
  'Golang': 'go',
  'Python': 'python',
  'Java': 'text/x-java',
  'HTML': 'htmlmixed',
  'CSS': 'css',
  'C++': 'text/x-c++src',
  'Rust': 'text/x-rustsrc'
};

/**
 * Initialize Yjs document and WebSocket provider
 * @param {string} sessionId - The session ID
 * @param {string} username - Current username
 * @param {string} language - Programming language for syntax highlighting
 * @param {string} initialContent - Initial code content
 */
export function initializeYjsEditor(sessionId, username, language, initialContent) {
  // Create Yjs document
  const ydoc = new Y.Doc();
  
  // Create shared text type
  const ytext = ydoc.getText('shared-text');
  
  // Create WebSocket provider for sync between clients and server
  const provider = new WebsocketProvider(
    `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`,
    `session-${sessionId}`,
    ydoc,
    {
      connect: true,
      awareness: false,  // Disable awareness to avoid compatibility issues
      resyncInterval: 5000
    }
  );

  // Set initial content if this is first user
  if (ytext.length === 0 && initialContent) {
    ytext.insert(0, initialContent);
  }

  // Initialize CodeMirror
  const mode = MODE_MAP[language] || 'javascript';
  const editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
    lineNumbers: true,
    mode: mode,
    theme: 'eclipse',
    indentUnit: 2,
    smartIndent: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    lineWrapping: true,
    viewportMargin: Infinity,
    extraKeys: {
      'Tab': function(cm) {
        if (cm.somethingSelected()) {
          cm.indentSelection('add');
        } else {
          cm.replaceSelection('  ', 'end');
        }
      },
      'Shift-Tab': function(cm) {
        cm.indentSelection('subtract');
      }
    }
  });

  // Bind CodeMirror to Yjs
  // Note: awareness is disabled, so pass empty Set
  const binding = new CodemirrorBinding(ytext, editor, new Set(), provider);

  // Monitor connection status
  provider.on('status', event => {
    const statusEl = document.getElementById('connection-status');
    if (statusEl) {
      if (event.status === 'connected') {
        statusEl.textContent = '✓ Connected';
        statusEl.style.color = '#4CAF50';
        console.log('[Yjs] Connected for session:', sessionId);
      } else {
        statusEl.textContent = '⟳ Connecting...';
        statusEl.style.color = '#FF9800';
      }
    }
  });

  // Log Yjs state
  console.log('[Yjs] Editor initialized for session:', sessionId);
  console.log('[Yjs] User:', username);
  console.log('[Yjs] Language:', language);

  return { ydoc, provider, binding, editor };
}

/**
 * Handle page unload - close WebSocket connection
 */
export function cleanupYjs(provider) {
  if (provider) {
    provider.disconnect();
    provider.destroy();
  }
}

// Export to window for non-module scripts
if (typeof window !== 'undefined') {
  window.initializeYjsEditor = initializeYjsEditor;
  window.cleanupYjs = cleanupYjs;
}
