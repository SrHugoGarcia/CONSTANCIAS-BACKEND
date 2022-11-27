const express = require('express');
const { crearCurso, actualizarCurso, obtenerCurso, obtenerCursos,eliminarCurso, tamañoImagenesFirmas, cargarFirmasCapacitadores } = require('../controllers/cursoController');
const { protect,restrictTo} = require('../controllers/authController');

const router = express.Router();
router.use(protect,restrictTo('administrador','capacitador'));
router.route('/').post(crearCurso).get(obtenerCursos)
router.route('/:id').patch(cargarFirmasCapacitadores,tamañoImagenesFirmas,actualizarCurso).get(obtenerCurso).delete(eliminarCurso);
module.exports = router;