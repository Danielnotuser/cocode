/**
 * Yjs + y-codemirror integration for collaborative code editing
 * This replaces the basic WebSocket implementation with a CRDT-based system
 */

import * as Y from 'yjs';
import { CodemirrorBinding } from 'y-codemirror';
import { WebsocketProvider } from 'y-websocket';
import CodeMirror from 'codemirror';

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
      awareness: true,
      resyncInterval: 5000
    }
  );

  // Set initial content if this is first user
  if (ytext.length === 0 && initialContent) {
    ytext.insert(0, initialContent);
  }

  // Set local user awareness
  provider.awareness.setLocalState({
    user: {
      name: username,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      colorLight: '#' + Math.floor(Math.random() * 16777215).toString(16)
    }
  });

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
  const binding = new CodemirrorBinding(ytext, editor, new Set([provider.awareness]), provider);

  // Monitor connection status
  provider.on('status', event => {
    const statusEl = document.getElementById('connection-status');
    if (statusEl) {
      if (event.status === 'connected') {
        statusEl.textContent = '✓ Connected';
        statusEl.style.color = '#4CAF50';
      } else {
        statusEl.textContent = '⟳ Connecting...';
        statusEl.style.color = '#FF9800';
      }
    }
    console.log('[Yjs] Connection status:', event.status);
  });

  // Monitor awareness changes (other users)
  provider.awareness.on('change', changes => {
    const users = Array.from(provider.awareness.getStates().entries())
      .map(([clientID, state]) => state.user?.name)
      .filter(Boolean);
    console.log('[Yjs] Active users:', users);
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
