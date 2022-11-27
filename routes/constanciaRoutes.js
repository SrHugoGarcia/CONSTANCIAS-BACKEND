const express = require('express');
const { crearConstancia, actualizarConstancia, obtenerConstancia, obtenerConstancias,eliminarConstancia,
        cargarImagenesConstancia, tamañoImagenesConstancia } = require('../controllers/constanciaController');
const { protect,restrictTo} = require('../controllers/authController');

const router = express.Router();

router.use(protect,restrictTo('administrador','capacitador'));
router.route('/').post(cargarImagenesConstancia,tamañoImagenesConstancia,crearConstancia).get(obtenerConstancias)
router.route('/:id').patch(cargarImagenesConstancia,tamañoImagenesConstancia,actualizarConstancia)
.get(obtenerConstancia).delete(eliminarConstancia);
module.exports = router;