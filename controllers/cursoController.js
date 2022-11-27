const  { deleteOne, updateOne, createOne, getOne, getAll } = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');
const Curso = require('../models/Curso');
const AppError = require('../utils/AppError')
//Modulo para la carga de archivos desde el cliente al servidor
const multer = require('multer');
//Modulo para modificar el tamaño del logo y background
const sharp = require('sharp');
//Es mejor manejar la imagen en la memoria
const multerStorage = multer.memoryStorage();
//Comprobar si el archivo subido es una imagen
const multerFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }else{
        //Le pasamos un error
        cb(new AppError("No es una imagen. Porfavor cargue solo imagenes",400),false)
    }
}

const upload = multer({
    storage : multerStorage,
    fileFilter : multerFilter
})
//User
const cargarFirmasCapacitadores = upload.fields([
    {name: "firmaCapacitadorPrincipal", maxCount: 1},
    {name:"firmaCapacitador", maxCount:1}
])

//Procesamiento de imagenes
const tamañoImagenesFirmas = catchAsync(async(req,res,next)=>{
    if(req.files.firmaCapacitador){
        let fileName;
        if(req.user.id){
            fileName= `firma-Capacitador-${req.params.id}-${Date.now()}.jpeg`;
        }
        if(req.params.id){
            fileName= `firma-capacitador-${req.user.id}-${Date.now()}.jpeg`;
        }
        await sharp(req.files.firmaCapacitador[0].buffer).flatten({ background: '#ffffff' , alpha: 0 })
        .resize({ width: 310, height: 93, fit: 'inside' }).toFormat('jpeg').jpeg({quality: 90})
        .toFile(`public/servidor/constancias IKTAN/firmasElectronicas/${fileName}`)
        req.body.firmaCapacitador = fileName;
    }

    if(req.files.firmaCapacitadorPrincipal){
        let fileName;
        if(req.user.id){
            fileName= `firma-capacitador-principal-${req.params.id}-${Date.now()}.jpeg`;
        }
        if(req.params.id){
            fileName= `firma-capacitador-principal-${req.user.id}-${Date.now()}.jpeg`;
        }
        await sharp(req.files.firmaCapacitadorPrincipal[0].buffer).flatten({ background: '#ffffff' , alpha: 0 }).
        resize({ width: 310, height: 93, fit: 'inside'}).
        toFormat('jpeg').jpeg({quality: 90})
        .toFile(`public/servidor/constancias IKTAN/firmasElectronicas/${fileName}`)
        req.body.firmaCapacitadorPrincipal = fileName;
    }
    next();
});


const crearCurso = createOne(Curso);
const actualizarCurso = updateOne(Curso);
const eliminarCurso = deleteOne(Curso);
const obtenerCurso = getOne(Curso);
const obtenerCursos =getAll(Curso);

const actualizarDatosCapacitador = catchAsync(async(req,res,next)=>{
    const nombreCapacitador = req.body.nombreCapacitador;
    const apellidoPaternoCapacitador = req.body.apellidoPaternoCapacitador;
    const apellidoMaternoCapacitador = req.body.apellidoMaternoCapacitador;
    const empresaCapacitador = req.body.empresaCapacitador;
    const puestoCapacitador = req.body.puestoCapacitador;
    const curso = Curso.findByIdAndUpdate(req.params.id,{nombreCapacitador, apellidoPaternoCapacitador,
    apellidoMaternoCapacitador, empresaCapacitador, puestoCapacitador}, {new : true, runValidators: true})
    res.status(200).json({
        status: "successful",
        data:{
            curso
        }
    })
})

module.exports = { crearCurso, actualizarCurso, eliminarCurso, obtenerCurso, obtenerCursos, eliminarCurso,
                    cargarFirmasCapacitadores, tamañoImagenesFirmas };