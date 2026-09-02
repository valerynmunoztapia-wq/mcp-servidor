const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Importar el archivo JSON
const menu = require('./menu.json');

// Endpoint /menu que devuelve el JSON externo
app.get('/menu', (req, res) => {
    res.json(menu);
});

app.get('/web', (req, res) => res.send('Framework Web conectado'));
app.get('/mobile', (req, res) => res.send('Framework Mobile conectado'));
app.get('/servicios', (req, res) => res.send('Framework Servicios conectado'));

app.listen(PORT, () => console.log(`MCP corriendo en http://localhost:${PORT}`));
