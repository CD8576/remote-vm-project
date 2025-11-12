const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();
const port = 3000;

// Since everything is on the same Docker network,
// refer to the guacamole container by its service name.
const guacamoleServer = 'http://guacamole:8080';

// Proxy the Guacamole WebSocket tunnel
app.use('/guacamole/websocket-tunnel', createProxyMiddleware({
  target: guacamoleServer,
  ws: true,
  logLevel: 'debug',
}));

// Proxy other Guacamole requests
app.use('/guacamole', createProxyMiddleware({
  target: guacamoleServer,
  logLevel: 'debug',
}));

// Serve the static client-side files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Web server running at http://localhost:${port}`);
});
