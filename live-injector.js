// live-injector.js VERSION 2.0

// remember to turn brave shields off for target site when using live injector. this will block connection.

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const WebSocket = require('ws');
const config = require('./dev.config.js'); // Import the central configuration

// --- Configuration ---
// Dynamically create the list of files to watch from the config file
const WATCHED_FILES = config.cssFiles.map(file => file.destination);
const WEBSOCKET_PORT = 8080;
// ---------------------

const wss = new WebSocket.Server({ port: WEBSOCKET_PORT });
console.log(`[Live Injector] Starting WebSocket server on port ${WEBSOCKET_PORT}...`);

wss.on('connection', ws => {
  console.log('[Live Injector] Browser connected.');
  ws.on('close', () => {
    console.log('[Live Injector] Browser disconnected.');
  });
});

function getStyleId(filePath) {
  return `live-injected-${path.normalize(filePath).replace(/[\/\\]/g, '-')}`;
}

console.log(`[Live Injector] Watching for changes in:`, WATCHED_FILES);

const watcher = chokidar.watch(WATCHED_FILES, {
  persistent: true,
  ignoreInitial: true
});

watcher.on('change', (filePath) => {
  console.log(`[Live Injector] File changed: ${filePath}. Sending update...`);

  try {
    const cssContent = fs.readFileSync(filePath, 'utf-8');
    const message = JSON.stringify({
      type: 'css-update',
      path: filePath,
      id: getStyleId(filePath),
      content: cssContent
    });

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  } catch (err) {
    console.error(`[Live Injector] Error reading file ${filePath}: ${err.message}`);
  }
});

console.log('[Live Injector] Ready.');