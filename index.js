const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');
const app = require('./app');


app.use(cors());
app.use(express.json());
require('./database');

const impuestosPath = path.join(__dirname, './data/impuestos.json');

async function readImpuestos() {
    const raw = await fs.readFile(impuestosPath, 'utf8');
    return raw ? JSON.parse(raw) : [];
}



app.listen(app.get('puerto'), () => {
  console.log('Nombre de la App', app.get('nombreApp'));
  console.log('Puerto del servidor', app.get('puerto'));
});

app.get('/', (req, res) => {
    res.send('Hola Mundo desde el servidor Express');
});
// METODOS PARA GASTOS E IMPUESTOS
app.use('/gastos', require('./routes/gastos.routes'));

app.get('/impuestos', async (req, res) => {
    try {
        const impuestos = await readImpuestos();
        res.json(impuestos);
    } catch (err) {
        console.error('Error leyendo impuestos:', err);
        res.status(500).json({ message: 'Error leyendo impuestos' });
    }
});

app.post('/impuestos', async (req, res) => {
    try {
        const impuesto = req.body;
        if (!impuesto) {
            res.status(400).json({ message: 'Impuesto requerido' });
            return;
        }

        const impuestos = await readImpuestos();
        impuestos.push(impuesto);
        await fs.writeFile(impuestosPath, JSON.stringify(impuestos, null, 2));
        res.status(201).json(impuesto);
    } catch (err) {
        console.error('Error guardando impuesto:', err);
        res.status(500).json({ message: 'Error guardando impuesto' });
    }
});