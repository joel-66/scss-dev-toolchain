// dev.config.js VERSION 1.0
// This is the single source of truth for your project's configuration.

let localConfig = {};

try {
  // Try to load the local file
  localConfig = require('./local.config.js');
} catch (e) {
  // If the file doesn't exist, we just use an empty object
  console.log('--- [INFO] No local.config.js found. Using default settings. ---');
}

const config = {
  // Use the local path if it exists
  serverPath: localConfig.serverPath || 'YOUR_SERVER_PATH_HERE',

  cssFiles: [
    {
      source: 'assets/scss/style.scss',
      destination: './style.css'
    },
    {
      source: 'assets/scss/shop.scss',
      destination: './inc/css/shop.css'
    },
    {
      source: 'assets/scss/uncategorized.scss',
      destination: './inc/css/uncategorized.css'
    },
     {
       source: 'assets/scss/homepage.scss',
       destination: './inc/css/homepage.css'
     }
     // To add a new file, just add a new object here.
  ]
};

// Make this configuration available to other Node.js scripts.
module.exports = config;