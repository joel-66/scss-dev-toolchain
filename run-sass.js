// run-sass.js VERSION 1.0
// This script builds and executes the SASS command in a cross-platform way.
const { exec } = require('child_process');
const config = require('./dev.config.js');

// --- Main Logic ---

// 1. Check if the '--watch' flag was passed to this script
const isWatchMode = process.argv.includes('--watch');
const watchFlag = isWatchMode ? '--watch' : '';

// 2. Generate the file list string from our central config file
const sassFileArgs = config.cssFiles
  .map(file => `${file.source}:${file.destination}`)
  .join(' ');

// 3. Construct the full SASS command
const command = `sass ${watchFlag} ${sassFileArgs} --style=compressed --no-source-map`;

console.log(' SASS RUNNER '.padStart(20, '=').padEnd(30, '='));
console.log(`[SASS Runner] Assembled command:`);
console.log(`> ${command}\n`);

// 4. Execute the command
const sassProcess = exec(command);

// 5. Pipe the output (logs, errors, etc.) from the SASS process
// directly to our main terminal so we can see what's happening.
sassProcess.stdout.pipe(process.stdout);
sassProcess.stderr.pipe(process.stderr);

sassProcess.on('exit', (code) => {
  console.log(`[SASS Runner] Process exited with code ${code}`);
});