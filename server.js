const WebSocket = require("ws");
const readline = require("readline");
const wss = new WebSocket.Server({ port: 8080 });

function getClientIp(req) {
  const ip = req.connection.remoteAddress || req.socket.remoteAddress;
  return ip && ip.startsWith("::ffff:") ? ip.substring(7) : ip;
}

wss.on("connection", (ws, req) => {
  const clientIp = getClientIp(req);

  console.log(`Connected from IP: ${clientIp}`);

  ws.on("message", (message) => {
    const currentTime = new Date().toLocaleTimeString();
    const reply = `<span>[${clientIp}]</span> ${currentTime} - ${message}`;

    ws.send(reply);

    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(reply);
      }
    });
  });

  ws.on("close", () => {
    console.log(`User ${clientIp} disconnected.`);
  });
});
