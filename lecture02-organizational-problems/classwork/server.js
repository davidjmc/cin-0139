import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Cria o app HTTP
const app = express();
const server = http.createServer(app);

// Serve o HTML diretamente por rota
app.get('/', (req, res) => {
  res.sendFile(path.join(dirname, 'index.html'));
});

// Configura WebSocket
const wss = new WebSocketServer({ noServer: true });

let contador = 0;

wss.on('connection', ws => {
  console.log('Conectado via WS');

  // Envia o estado atual ao conectar ou reconectar
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

// Broadcast para todos os clientes
function broadcast(data) {
  const json = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(json);
    }
  });
}

// Traz o protocolo WebSocket pra dentro do mesmo servidor HTTP
server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, ws => {
    wss.emit('connection', ws, req);
  });
});

// Pode usar ws para WebSocket sem rota, o upgrade é manual
server.listen(4000, '0.0.0.0', () => {
  console.log(`Servidor WebSocket rodando em http://localhost:4000`);
});
