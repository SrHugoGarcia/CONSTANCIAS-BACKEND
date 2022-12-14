const express = require('express');
const { crearConstancia, actualizarConstancia, obtenerConstancia, obtenerConstancias,eliminarConstancia,
        cargarImagenesConstancia, tama├▒oImagenesConstancia } = require('../controllers/constanciaController');
const { protect,restrictTo} = require('../controllers/authController');

const router = express.Router();

router.use(protect,restrictTo('administrador','capacitador'));
router.route('/').post(cargarImagenesConstancia,tama├▒oImagenesConstancia,crearConstancia).get(obtenerConstancias)
router.route('/:id').patch(cargarImagenesConstancia,tama├▒oImagenesConstancia,actualizarConstancia)
.get(obtenerConstancia).delete(eliminarConstancia);
module.exports = router;