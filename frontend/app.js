/**
 * Yjs + y-codemirror integration for collaborative code editing
 * This replaces the basic WebSocket implementation with a CRDT-based system
 */

import * as Y from 'yjs';
import { CodemirrorBinding } from 'y-codemirror';
import { WebsocketProvider } from 'y-websocket';

// Import CodeMirror and required modes/addons so esbuild bundles them into static/app.js.
// This avoids loading a separate CDN copy and ensures addons like defineSimpleMode are present.
import CodeMirrorLib from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/go/go.js';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/rust/rust.js';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/mode/simple.js';

// Ensure a single CodeMirror instance is available on window and use it.
if (typeof window !== 'undefined' && !window.CodeMirror) {
  window.CodeMirror = CodeMirrorLib;
}
const CodeMirror = (typeof window !== 'undefined' && window.CodeMirror) ? window.CodeMirror : CodeMirrorLib;

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
  // Debug: log local document updates so we can see when local edits produce Yjs updates
  ydoc.on('update', update => {
    try {
      const len = update && update.byteLength !== undefined ? update.byteLength : (update && update.length) || 0;
      console.debug('[Yjs] local ydoc update, bytes:', len);
    } catch (e) {
      console.debug('[Yjs] local ydoc update (could not compute length)');
    }
  });
  
  // Create shared text type
  const ytext = ydoc.getText('shared-text');
  
  // Create WebSocket provider for sync between clients and server
  // Connect to the server's /ws endpoint and pass session/username as query params
  // WebsocketProvider builds the final URL as serverUrl + "/" + roomname + "?" + params
  // We use roomname = "ws" so the final URL becomes "/ws?session=...&username=..." which the Go handler expects.
  // const provider = new WebsocketProvider(
  //   `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname + ":" + "1234"}`,
  //   'ws',
  //   ydoc,
  //   {
  //     connect: true,
  //     //params: { session: sessionId, username: username },
  //     // Provide a WebSocket wrapper to capture and log incoming messages that might be malformed
  //     WebSocketPolyfill: function(url, protocols) {
  //       const inner = new window.WebSocket(url, protocols);
  //       inner.binaryType = 'arraybuffer';
  //       const wrapper = {};
  //       // proxy readyState
  //       Object.defineProperty(wrapper, 'readyState', { get: () => inner.readyState });
  //       // proxy send/close/addEventListener/removeEventListener
  //       wrapper.send = function(data) {
  //         try {
  //           if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
  //             const len = data.byteLength !== undefined ? data.byteLength : data.length;
  //             console.debug('[Yjs WS] outgoing binary length:', len);
  //           } else {
  //             console.debug('[Yjs WS] outgoing non-binary send, type:', typeof data, data);
  //           }
  //         } catch (e) {
  //           console.warn('[Yjs WS] error inspecting outgoing data', e);
  //         }
  //         return inner.send(data);
  //       };
  //       wrapper.close = function(code, reason) { return inner.close(code, reason); };
  //       wrapper.addEventListener = function() { return inner.addEventListener.apply(inner, arguments); };
  //       wrapper.removeEventListener = function() { return inner.removeEventListener.apply(inner, arguments); };
  //       // forward onopen/onclose/onerror directly
  //       Object.defineProperty(wrapper, 'onopen', { set(fn) { inner.onopen = fn; }, get() { return inner.onopen; } });
  //       Object.defineProperty(wrapper, 'onclose', { set(fn) { inner.onclose = fn; }, get() { return inner.onclose; } });
  //       Object.defineProperty(wrapper, 'onerror', { set(fn) { inner.onerror = fn; }, get() { return inner.onerror; } });
  //       // intercept onmessage assignment so we can wrap the handler with try/catch and logging
  //       Object.defineProperty(wrapper, 'onmessage', {
  //         set(fn) {
  //           inner.onmessage = function(event) {
  //             try {
  //               // Log message type/length for debugging malformed frames
  //               try {
  //                 if (event && event.data) {
  //                   if (event.data instanceof ArrayBuffer || ArrayBuffer.isView(event.data)) {
  //                     const len = event.data.byteLength !== undefined ? event.data.byteLength : event.data.length;
  //                     console.debug('[Yjs WS] incoming binary length:', len);
  //                   } else {
  //                     console.debug('[Yjs WS] incoming non-binary message, type:', typeof event.data, event.data);
  //                   }
  //                 }
  //               } catch (e) {
  //                 console.warn('[Yjs WS] error inspecting event.data', e);
  //               }
  //               fn && fn(event);
  //             } catch (err) {
  //               console.error('[Yjs WS] handler error (caught):', err, event && event.data);
  //               // swallow to avoid uncaught errors crashing message handling
  //             }
  //           };
  //         },
  //         get() { return inner.onmessage; }
  //       });
  //       return wrapper;
  //     },
  //     //awareness: false,  // Disable awareness to avoid compatibility issues
  //     resyncInterval: 5000
  //   }
  // );
  const provider = new WebsocketProvider('ws://localhost:1234', 'my-roomname', ydoc)
  // Set initial content if this is first user
  if (ytext.length === 0 && initialContent) {
    ytext.insert(0, initialContent);
  }

  // Initialize CodeMirror
  const mode = MODE_MAP[language] || 'javascript';
  if (!CodeMirror || typeof CodeMirror.fromTextArea !== 'function') {
    console.error('[Yjs] CodeMirror not available. window.CodeMirror =', typeof window !== 'undefined' ? window.CodeMirror : undefined);
    throw new Error('CodeMirror not available — ensure the CodeMirror script is included before the app bundle');
  }

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
  // y-codemirror binding: (Y.Text, CodeMirror editor, Awareness or null, Provider or null)
  // We pass awareness and provider so it can track cursor positions and sync
  console.log('[Yjs] Before binding: ytext type=', ytext.constructor.name, ', editor=', editor ? 'ready' : 'null');
  const binding = new CodemirrorBinding(ytext, editor, provider.awareness, provider);
  console.log('[Yjs] After binding created');

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
