const { WebSocketServer } = require('ws');
const uuid = require('uuid');

let connections = [];

function leaderSocket(httpServer) {
    const wss = new WebSocketServer({ noServer: true });

    // Handle the protocol upgrade from HTTP to WebSocket
    httpServer.on('upgrade', (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
      });
    });

    wss.on('connection', (ws) => {
      const connection = { id: uuid.v4(), alive: true, ws: ws };
      connections.push(connection);

      // Forward messages to everyone
      ws.on('message', function message(data) {
        connections.forEach((c) => {
          c.ws.send(data);
        });
      });
  
      // Remove the closed connection so we don't try to forward anymore
      ws.on('close', () => {
        connections = connections.filter((c) => c.id !== connection.id);
      });
  
      // Respond to pong messages by marking the connection alive
      ws.on('pong', () => {
        connection.alive = true;
      });
    });

    // Keep active connections alive
    setInterval(() => {
    connections.forEach((c) => {
      // Kill any connection that didn't respond to the ping last time
      if (!c.alive) {
        c.ws.terminate();
      } else {
        c.alive = false;
        c.ws.ping();
      }
    });
  }, 10000);

}

function broadcast(message) {
    connections.forEach((c) => {
      c.ws.send(message);
    });
  }

module.exports = { leaderSocket, broadcast };