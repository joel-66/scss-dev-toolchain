// client-connector.js
// Copy this into your theme's JS or use the PHP snippet provided in the README.

(function() {
  const INJECTOR_SOCKET_URL = 'ws://localhost:8080';

  function connect() {
    console.log('[Live Injector] Connecting to server...');
    const socket = new WebSocket(INJECTOR_SOCKET_URL);

    socket.onopen = function() {
      console.log('[Live Injector] Connected successfully!');
    };

    socket.onmessage = function(event) {
      const data = JSON.parse(event.data);

      if (data.type === 'css-update') {
        console.log(`[Live Injector] Received update for ${data.path}. Applying styles...`);
        
        let styleTag = document.getElementById(data.id);
        
        if (!styleTag) {
          styleTag = document.createElement('style');
          styleTag.id = data.id;
          document.head.appendChild(styleTag);
        }
        
        styleTag.innerHTML = data.content;
      }
    };

    socket.onclose = function() {
      console.log('[Live Injector] Connection closed. Retrying in 3 seconds...');
      setTimeout(connect, 3000);
    };

    socket.onerror = function(err) {
      console.error('[Live Injector] WebSocket error:', err);
      socket.close();
    };
  }

  connect();
})();