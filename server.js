const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/menu', (req, res) => {
    res.json({
        opciones: [
            { nombre: 'Framework Web', ruta: '/web' },
            { nombre: 'Framework Mobile', ruta: '/mobile' },
            { nombre: 'Framework Servicios', ruta: '/servicios' }
        ]
    });
});

app.get('/web', (req, res) => res.send('Framework Web conectado'));
app.get('/mobile', (req, res) => res.send('Framework Mobile conectado'));
app.get('/servicios', (req, res) => res.send('Framework Servicios conectado'));

app.listen(PORT, () => console.log(`MCP corriendo en http://localhost:${PORT}`));
