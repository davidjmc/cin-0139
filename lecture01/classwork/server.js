import express from 'express'; // framework servidor http
import path from 'path'; // manipulador de arquivos
import { fileURLToPath } from 'url'; // url do modulo para caminhos de arquivo

const filename = fileURLToPath(import.meta.url); // caminho do arquivo
const dirname = path.dirname(filename); // 

const app = express(); // aplicacao express
const port = 3000; // define porta

let contador = 0; // variavel global do contador

app.use(express.static(dirname)); // arquivos estáticos acessiveis para o navegador

app.get('/', (req, res) => {
    res.sendFile(path.join(dirname, 'index.html'));  // GET para / e envia o arquivo index.html para o navegador
});

app.get('/contador', (req, res) => {
    res.json({contador: contador});  // Rota GET /contador: responde com JSON com o valor atual do contador
});

app.post('/contador/incremento', (req, res) => {
    contador++;
    res.json({contador: contador}); // Rota POST /contador/incremento: incrementa o contador e responde com o novo valor
});

app.listen(port, () => {
    console.log(`Servidor REST rodando em http://localhost:${port}`); // Inicializa o contador na porta
})