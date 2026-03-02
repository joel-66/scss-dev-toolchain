# SCSS Dev Toolchain for WordPress

A lightweight, Node.js-based development environment designed to bridge the gap between local SCSS development and networked web servers (or local setups).

## 🚀 Features

*   **Multi-stream SCSS Compilation:** Compiles specific SASS entry points simultaneously.
*   **Live CSS Injection:** Updates styles in the browser instantly without reloading (via WebSockets).
*   **Network Sync (Optional):** Automatically syncs compiled CSS to a remote server or mapped network drive, handling file-lock issues automatically.

## 🛠️ Setup & Installation

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Create Local Config (Optional)**
    Create a file named `local.config.js` in the root directory.
    *   If you just want to compile locally, you can skip this.
    *   If you want to sync to a server (e.g., a mapped network drive), add your path:
    
    ```javascript
    // local.config.js
    module.exports = {
      // Note: Use double backslashes for Windows paths
      serverPath: '\\\\192.168.1.100\\wp-content\\themes\\my-theme'
    };
    ```

3.  **Connecting the Live Injector**
   To see your CSS changes instantly, the browser needs to connect to the local WebSocket server.

   ### Option A: The WordPress Way (Recommended)
   Add this to your theme's `functions.php` (or development plugin). This ensures the code only runs when debug mode is on.

    ```php
    if (defined('WP_DEBUG') && WP_DEBUG) {
        add_action('wp_footer', function() {
            ?>
            <script>
                // PASTE THE CONTENTS OF client-connector.js HERE
                // (Make sure to include the closure: (function() { ... })(); )
            </script>
            <?php
        });
    }
    ```

   ### Option B: The Manual Way
   Simply copy the contents of `client-connector.js` and paste it into your site's main JavaScript file or footer template.
   

## 🏃‍♂️ Running the Project

Run the main development command:

```bash
npm start
```

This will launch three concurrent processes:
1.  **SASS Watcher:** Compiles `.scss` files on change.
2.  **Live Injector:** Broadcasts changes to the connected browser.
3.  **Sync Watcher:** Copies files to the `serverPath` (if configured).

## 📂 Configuration

**`dev.config.js`** controls which files are compiled. To add a new SCSS file:

```javascript
cssFiles: [
  {
    source: 'assets/scss/new-page.scss', 
    destination: './inc/css/new-page.css' 
  }
]
```

## ⚠️ Troubleshooting

*   **"Sync Disabled":** If you see this message, it means no `local.config.js` was found. The compiler will still work locally.
*   **Live Injector not working:** Ensure `client-connector.js` code is loaded on your webpage and that your browser isn't blocking the WebSocket connection (check Console logs).
```

---
