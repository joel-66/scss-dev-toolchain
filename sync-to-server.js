// sync-to-server.js VERSION 2.1
const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const config = require('./dev.config.js');

// --- Configuration ---
const sourceDir = __dirname;
const destDir = config.serverPath;
const debounceDelay = 5000;

const filesToWatch = config.cssFiles.map(file => file.destination);
const debounceTimers = new Map();

// --- Main Logic ---
console.log('🔄 [SYNC] Initializing file watcher...');
console.log(`📡 [SYNC] Target server path: ${destDir}`);

const watcher = chokidar.watch(filesToWatch, {
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100
    }
});

watcher.on('change', (filePath) => {
    console.log(`\n[${new Date().toLocaleTimeString()}]`);
    console.log(`---\n🔎 [SYNC] Change detected: ${filePath}`);

    if (debounceTimers.has(filePath)) {
        clearTimeout(debounceTimers.get(filePath));
        console.log(`⏳ [SYNC] Timer reset for ${filePath}. Waiting for more changes...`);
    } else {
        console.log(`⏳ [SYNC] Starting 5-second countdown for ${filePath}...`);
    }

    const newTimer = setTimeout(() => {
        const sourcePath = path.join(sourceDir, filePath);
        const destPath = path.join(destDir, filePath);

        console.log(`✅ [SYNC] Debounce time elapsed. Preparing to copy...`);
        console.log(`   [FROM]: ${sourcePath}`);
        console.log(`   [TO]:   ${destPath}`);

        const destFileDir = path.dirname(destPath);
        if (!fs.existsSync(destFileDir)) {
            console.log(`   [INFO] Creating directory: ${destFileDir}`);
            fs.mkdirSync(destFileDir, { recursive: true });
        }

        // --- MODIFIED LOGIC: Delete then copy ---
        // 1. First, try to delete the file at the destination to release any file locks.
        fs.unlink(destPath, (unlinkErr) => {
            // We ignore "ENOENT" error, which means the file didn't exist. That's fine.
            if (unlinkErr && unlinkErr.code !== 'ENOENT') {
                console.error(`❌ [SYNC] ERROR deleting existing file on server:`, unlinkErr);
                debounceTimers.delete(filePath);
                return; // Stop if we can't delete the old file
            }

            // 2. Now, copy the new file. This should succeed since the lock is gone.
            fs.copyFile(sourcePath, destPath, (copyErr) => {
                if (copyErr) {
                    console.error(`❌ [SYNC] ERROR copying ${filePath} to server:`, copyErr);
                } else {
                    console.log(`👍 [SYNC] Successfully copied ${filePath} to server.`);
                    console.log(`---`);
                }
                debounceTimers.delete(filePath);
            });
        });

    }, debounceDelay);

    debounceTimers.set(filePath, newTimer);
});

console.log('✅ [SYNC] Watcher is now active. Monitoring for file changes...');