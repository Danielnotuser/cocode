// yjs-server.js
const WebSocket = require('ws');
const http = require('http');
const { setupWSConnection } = require('y-websocket/bin/utils');

const server = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Yjs WebSocket Server');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
    setupWSConnection(ws, req);
});

const PORT = 1234;
server.listen(PORT, () => {
    console.log(`Yjs WebSocket server running on port ${PORT}`);
});