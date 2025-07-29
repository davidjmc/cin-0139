import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const server = http.createServer(app);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const wss = new WebSocketServer({ noServer: true });

let contador = 0;

wss.on('connection', ws => {
  console.log('Conectado via WS');

  ws.send(JSON.stringify({ contador }));

  ws.on('message', message => {
    const msg = message.toString();
    console.log('Recebido:', msg);

    if (msg === 'incremento') {
      contador++;
      broadcast({ contador });
    } else if (msg === 'contador') {
      ws.send(JSON.stringify({ contador }));
    }
  });

  ws.on('close', () => console.log('WS desconectado'));
});

function broadcast(data) {
  const json = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(json);
    }
  });
}

server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, ws => {
    wss.emit('connection', ws, req);
  });
});

server.listen(4000, '0.0.0.0', () => {
  console.log(`Servidor WebSocket rodando em http://localhost:4000`);
});
