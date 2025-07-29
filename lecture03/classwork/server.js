import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import mqtt from 'mqtt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

let contador = 0;

const client = mqtt.connect('mqtt://broker.hivemq.com');

client.on('connect', () => {
  console.log('Conectado ao broker MQTT.');
  client.subscribe('sisteminha/contador/incrementar');
});

client.on('message', (topic, message) => {
  if (topic === 'sisteminha/contador/incrementar') {
    console.log('Comando de incremento recebido.');
    contador++;
    
    client.publish('sisteminha/contador/valor', JSON.stringify({ valor: contador }));
    console.log('Novo valor publicado:', contador);
  }
});

server.listen(4000, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:4000`);
});