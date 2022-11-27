const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
    nombreCurso:{
        type: String,
        minLength: [10, "El nombre del curso debe de tener como minimo 50 caracteres"],
        maxLength: [300, "El nombre del curso debe de tener como maximo 300 caracteres"],
        trim: true,
        uppercase: true,
        required: true,
    },
    fechaInicio:{
        type: Date,
        required: true,
    },
    fechaFinalizacion:{
        type: Date,
        required: true,
    },
    descripcionCurso:{
        type: String,
        minLength: [50, "La descripcion del curso debe de tener como minimo 50 caracteres"],
        maxLength: [1000, "La descripcion del curso debe de tener como maximo 1000 caracteres"],
        trim: true,
        required: true,
    },
    nombreCapacitadorPrincipal:{
        type: String,
        minLength: [3, "El nombre del capacitador principal debe de tener como minimo 3 caracteres"],
        maxLength: [50, "El nombre del capacitador principal debe de tener como maximo 5 caracteres"],
        trim: true
    },
    apellidoPaternoCapacitadorPrincipal:{
        type: String,
        minLength: [3, "El apellido Paterno del capacitador principal debe de tener como minimo 3 caracteres"],
        maxLength: [50, "El apellido Paterno del capacitador principal debe de tener como maximo 50 caracteres"],
        trim:true
    },
    apellidoMaternoCapacitadorPrincipal:{
        type: String,
        minLength: [3, "El apellido materno del capacitador principal debe de tener como minimo 3 caracteres"],
        maxLength: [50,"El apellido materno del capacitador principal debe de tener como maximo 50 caracteres"],
        trim: true,
    },
    puestoCapacitadorPrincipal:{
        type: String,
        minLength: [3, "El puesto del capacitador principal debe de tener como minimo 3 caracteres"],
        maxLength: [50, "El puesto del capacitador principal debe de tener como maximo 50 caracteres"],
        trim: true,
    },
    empresaCapacitadorPrincipal:{
        type: String,
        minLength: [3, "la empresa del capacitador principal debe de tener como minimo 3 caracteres"],
        maxLength: [50, "la empresa del capacitador principal debe de tener como maximo 50 caracteres"],
        trim: true,
    },
    firmaCapacitadorPrincipal:{
        type: String,
    },
    nombreCapacitador:{
        type: String,
        minLength: [3, "El nombre del capacitador debe de tener como minimo 3 caracteres"],
        maxLength: [50, "El nombre del capacitador debe de tener como maximo 5 caracteres"],
        trim: true
    },
    apellidoPaternoCapacitador:{
        type: String,
        minLength: [3, "El apellido Paterno del capacitador debe de tener como minimo 3 caracteres"],
        maxLength: [50, "El apellido Paterno del capacitador debe de tener como maximo 50 caracteres"],
        trim:true
    },
    apellidoMaternoCapacitador:{
        type: String,
        minLength: [3, "El apellido materno del capacitador debe de tener como minimo 3 caracteres"],
        maxLength: [50,"El apellido materno del capacitador debe de tener como maximo 50 caracteres"],
    },
    puestoCapacitador:{
        type: String,
        minLength: [3, "El puesto del capacitador debe de tener como minimo 3 caracteres"],
        maxLength: [50, "El puesto del capacitador debe de tener como maximo 50 caracteres"],
        trim: true,
    },
    empresaCapacitador:{
        type: String,
        minLength: [3, "la empresa del capacitador debe de tener como minimo 3 caracteres"],
        maxLength: [50, "la empresa del capacitador debe de tener como maximo 50 caracteres"],
        trim: true,
    },
    firmaCapacitador:{
        type: String,
    },
    createAt:{
        type: Date,
        default: Date.now(),
        select: false
    },
})

const Curso = mongoose.model("curso", cursoSchema);
module.exports = Curso;
