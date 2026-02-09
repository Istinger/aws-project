const { Router } = require('express');
const router = Router();

const gastos = require('../controllers/gastos.controller');

router.get('/', gastos.getGastos);
router.post('/', gastos.createGasto);
router.put('/:id', gastos.updateGasto);
router.delete('/:id', gastos.deleteGasto);

module.exports = router;
