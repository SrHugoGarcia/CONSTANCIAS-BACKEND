const  { updateOne, createOne, getOne, getAll } = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');
const Constancia = require('../models/Constancia');
//Modulos para poder eliminar documentos del drive
const { google } = require("googleapis");
const keys = require("../credenciales.json");
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
const cargarImagenesConstancia = upload.fields([
    {name: "logo", maxCount: 1},
    {name:"background", maxCount:1}
])

//Procesamiento de imagenes
const tamañoImagenesConstancia = catchAsync(async(req,res,next)=>{
    if(req.files.logo){
        let fileName;
        if(!req.user.id){
            fileName= `logo-${req.params.id}-${Date.now()}.png`;
        }
        if(!req.params.id){
            fileName= `logo-${req.user.id}-${Date.now()}.png`;
        }
        await sharp(req.files.logo[0].buffer).toFile(`public/servidor/constancias IKTAN/logos/${fileName}`)
        req.body.logo = fileName;
    }

    if(req.files.background){
        let fileName;
        if(!req.user.id){
            fileName= `background-${req.params.id}-${Date.now()}.jpeg`;
        }
        if(!req.params.id){
            fileName= `background-${req.user.id}-${Date.now()}.jpeg`;
        }
        await sharp(req.files.background[0].buffer).flatten({ background: '#ffffff' , alpha: 0 }).
        resize({ width: 500, height: 500, fit: 'inside'}).
        toFormat('jpeg').jpeg({quality: 90})
        .toFile(`public/servidor/constancias IKTAN/background/${fileName}`)
        req.body.background = fileName;
    }
    next();
});

const eliminarConstancia = catchAsync(async(req,res,next)=>{
    const doc = await Constancia.findByIdAndDelete(req.params.id);
    if(!doc) return next(new AppError("No se encontro el documento con esa identificacion",404));
    const scopes = ['https://www.googleapis.com/auth/drive'];
    const client = new google.auth.JWT(keys.client_email, null, keys.private_key,scopes);
    const driveService = google.drive( {version:'v3',auth:client} );
    await driveService.files.delete({fileId: doc.idDrive})

    res.status(204).json({
        status: "Successful",
        data: doc,
        message: "Documento eliminado"
        });
});

const crearConstancia = createOne(Constancia);
const actualizarConstancia = updateOne(Constancia);
const obtenerConstancia = getOne(Constancia);
const obtenerConstancias =getAll(Constancia);

module.exports = { crearConstancia, actualizarConstancia, eliminarConstancia, obtenerConstancia, obtenerConstancias, eliminarConstancia, 
                    cargarImagenesConstancia, tamañoImagenesConstancia, cargarImagenesConstancia};