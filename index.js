const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, '../frontend/src/assets/gastos.json');
const impuestosPath = path.join(__dirname, './data/impuestos.json');

async function readGastos() {
    const raw = await fs.readFile(dataPath, 'utf8');
    return raw ? JSON.parse(raw) : [];
}

async function readImpuestos() {
    const raw = await fs.readFile(impuestosPath, 'utf8');
    return raw ? JSON.parse(raw) : [];
}

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});

app.get('/', (req, res) => {
    res.send('Hola Mundo desde el servidor Express');
});

app.get('/gastos', async (req, res) => {
    try {
        const gastos = await readGastos();
        res.json(gastos);
    } catch (err) {
        console.error('Error leyendo gastos:', err);
        res.status(500).json({ message: 'Error leyendo gastos' });
    }
});

app.post('/gastos', async (req, res) => {
    try {
        const gasto = req.body;
        if (!gasto) {
            res.status(400).json({ message: 'Gasto requerido' });
            return;
        }

        const gastos = await readGastos();
        gastos.push(gasto);
        await fs.writeFile(dataPath, JSON.stringify(gastos, null, 2));
        res.status(201).json(gasto);
    } catch (err) {
        console.error('Error guardando gasto:', err);
        res.status(500).json({ message: 'Error guardando gasto' });
    }
});

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