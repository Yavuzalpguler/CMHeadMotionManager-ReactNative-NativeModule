const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8080}, () => {
  console.log('Server started...');
});

let ws;
let clients = {};

wss.on('connection', (server, req) => {
  ws = server;
  const client = req.headers['sec-websocket-key'];
  clients[client] = ws;
  ws.on('message', (msg, data) => receive(msg, data, client));
  ws.on('close', (socket, number, reason) =>
    console.log('Closed: ', client, socket, number, reason),
  );
});

const send = (msg, client) => {
  console.log('Sending: ', msg);
  clients[client].send(JSON.stringify(msg), error => {
    if (error) {
      delete clients[client];
    } else {
      console.log(`Sent: ${msg}, to ${client}`);
    }
  });
};

const receive = (msg, data, sender) => {
  console.log(`Received: ${msg}, from ${sender}`);
  broadcast(msg, sender);
};

const broadcast = (msg, sender) => {
  msg = JSON.parse(msg);
  Object.keys(clients).map(client => {
    if (client === sender) {
      return;
    } else {
      send(msg, client);
    }
  });
};
