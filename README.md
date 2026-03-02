# 🚀 scss-dev-toolchain

A lightweight, Node.js-based development environment designed to bridge the gap between local SCSS development and a remote/networked web server. 

### The Problem
Developing themes directly on a networked server or a specific CMS path (like WordPress) is often slow. Browser refreshing is tedious, and file-locking issues on network drives can crash standard compilers.

### The Solution
I built this toolchain to automate the "write-compile-sync-refresh" loop. It features:
*   **Multi-stream SCSS Compilation:** Compiles multiple SCSS entry points simultaneously using `sass`.
*   **WebSocket Live Injection:** Injects updated CSS directly into the browser without a page reload (via `live-injector.js`).
*   **Debounced Network Sync:** A custom sync script that waits for the compiler to finish and handles "file-in-use" errors on network drives by using a delete-then-copy strategy.

---

## 🛠️ Key Components

### 1. Centralized Configuration (`dev.config.js`)
One single file manages all source/destination paths. This makes it easy to add new CSS components to the project without touching the core logic.

### 2. The Live Injector (`live-injector.js`)
Using **WebSockets (ws)** and **Chokidar**, this script watches for changes in the compiled CSS. When a change is detected, it broadcasts the new CSS content to the browser. 
> *Note: This requires a small snippet of client-side JS (not included) or a browser extension to receive the socket message.*

### 3. Smart File Sync (`sync-to-server.js`)
This is the "secret sauce" for network-based development:
*   **Debouncing:** It waits 5 seconds after the last change before syncing. This prevents the sync from triggering while the SASS compiler is still mid-write.
*   **Lock-Bypass:** It unlinks (deletes) the target file on the server before copying the new one to ensure network file-locks are released.

---

## 📦 Installation & Usage

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure paths:**
   Update `dev.config.js` with your specific local and server paths.
3. **Run the environment:**
   ```bash
   npm start
   ```
   *This runs the compiler, the injector, and the syncer concurrently.*

---

## 💻 Tech Stack
*   **Node.js**: Runtime environment.
*   **SASS**: CSS Preprocessing.
*   **Chokidar**: High-performance file watching.
*   **WebSockets (WS)**: Real-time browser communication.
*   **Concurrently**: Managing multiple parallel processes.

---