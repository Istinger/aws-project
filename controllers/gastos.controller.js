const fs = require('fs/promises');
const path = require('path');

const dataPath = path.join(__dirname, '../../frontend/src/assets/gastos.json');

async function readGastos() {
  const raw = await fs.readFile(dataPath, 'utf8');
  return raw ? JSON.parse(raw) : [];
}

async function writeGastos(gastos) {
  await fs.writeFile(dataPath, JSON.stringify(gastos, null, 2));
}

const gastosCtrl = {};

gastosCtrl.getGastos = async (req, res) => {
  try {
    const gastos = await readGastos();
    res.json(gastos);
  } catch (err) {
    console.error('Error leyendo gastos:', err);
    res.status(500).json({ message: 'Error leyendo gastos' });
  }
};

gastosCtrl.createGasto = async (req, res) => {
  try {
    const gasto = req.body;
    if (!gasto) {
      res.status(400).json({ message: 'Gasto requerido' });
      return;
    }

    const gastos = await readGastos();
    gastos.push(gasto);
    await writeGastos(gastos);
    res.status(201).json(gasto);
  } catch (err) {
    console.error('Error guardando gasto:', err);
    res.status(500).json({ message: 'Error guardando gasto' });
  }
};

gastosCtrl.updateGasto = async (req, res) => {
  try {
    const { id } = req.params;
    const gastoActualizado = req.body;
    if (!gastoActualizado) {
      res.status(400).json({ message: 'Gasto requerido' });
      return;
    }

    const gastos = await readGastos();
    const index = gastos.findIndex((g) => String(g.id) === String(id));
    if (index === -1) {
      res.status(404).json({ message: 'Gasto no encontrado' });
      return;
    }

    gastos[index] = { ...gastoActualizado, id: gastos[index].id };
    await writeGastos(gastos);
    res.json(gastos[index]);
  } catch (err) {
    console.error('Error actualizando gasto:', err);
    res.status(500).json({ message: 'Error actualizando gasto' });
  }
};

gastosCtrl.deleteGasto = async (req, res) => {
  try {
    const { id } = req.params;
    const gastos = await readGastos();
    const index = gastos.findIndex((g) => String(g.id) === String(id));
    if (index === -1) {
      res.status(404).json({ message: 'Gasto no encontrado' });
      return;
    }

    const [eliminado] = gastos.splice(index, 1);
    await writeGastos(gastos);
    res.json(eliminado);
  } catch (err) {
    console.error('Error eliminando gasto:', err);
    res.status(500).json({ message: 'Error eliminando gasto' });
  }
};

module.exports = gastosCtrl;
