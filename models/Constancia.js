const mongoose = require('mongoose');
const Curso = require('./Curso');
const Constancias = require('../utils/constancia')
const { google } = require("googleapis");
const keys = require("../credenciales.json");
const fs = require('fs');

const constanciaSchema = new mongoose.Schema({
    curso:{
        type: mongoose.Schema.ObjectId,
        ref: 'curso',
        required: true,
    },
    nombreCandidato:{
        type: String,
        minLength: [3,"Un nombre debe de tener como minimo 3 caracteres"],
        maxLength: [50, "Un nombre debe de teenr como maximo 50 caracteres"],
        trim: true,
        required: true,
        uppercase: true,
    },
    apellidoPaterno:{
        type: String,
        minLength: [3, "Un apellido Paterno debe de tener como minimo 3 caracteres"],
        maxLength: [50, "Un apellido Paterno debe de teenr como maximo 50 caracteres"],
        trim: true,
        required: true,
        uppercase: true
    },
    apellidoMaterno:{
        type: String,
        minLength: [3, "Un apellido Materno debe de tener como minimo 3 caracteres"],
        maxLength: [50, "Un apellido Paterno debe de tener como maximo 50 caracteres"],
        trim: true,
        required: true,
        uppercase: true,
    },
    calificacion:{
        type: Number,
        required: true,
        minLength: [1, "La calificacion debe de tener como minimo un caracter"],
        maxLength: [10, "La calificacion debe de tener como maxima 2 caracteres"],
        trim: true,
    },
    folio: {
        type: String,
        minLength: [9,"El folio debe de tener como minimo 9 caracteres"],
        maxLength: [9, "El folio debe de tener como maximo 9 caracteres"],
        unique: true,
    },
    createAt:{
        type: Date,
        default: Date.now(),
        select: false
    },
    logo: String,
    background: String,
    file:String,
    idDrive:String
})

function generarRandom(num) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let resultado = "";
    let ch;
    while (resultado.length < num){
        ch = characters.charAt(Math.floor(Math.random() * charactersLength));
        if (!resultado.includes(ch)){
            resultado += ch;
        }
    }
    return resultado;
}

async function createAndUploadFile(client, fileName){
    const driveService = google.drive( {version:'v3',auth:client} );
    let fileMetaData = {
      name: fileName,
      parents : ['1mq9A8sc6kZOtPSftXsUdPnlxBfTGvupk']
    }
    let media = {
      mimeType: 'image/png',
      body: fs.createReadStream(`${__dirname}/../public/cliente/constancias/Iktan/${fileName}`) 
    }
      respuesta =await driveService.files.create({
      resource: fileMetaData,
      media: media,
      fields: 'id'
    })
    return respuesta.data.id
  }

  async function EliminarConstanciaIktan(file){
    const logo = `public/cliente/constancias/Iktan/${file}`
    fs.access(logo, error => {
        if (!error) {
          fs.unlink(logo,function(error){
           if(error) console.error('Error Occured:', error);
            console.log('File deleted!');
           });
          } else {
            console.error('Error Occured:', error);
          }
    });
  }
 

constanciaSchema.pre('save',function(next){
    this.folio =  generarRandom(9);
    next();
})
/*
const constancia = this;
    const curso =await Curso.findById({_id:this.curso})
    this.file = await new Constancias(constancia,curso).createIktan();
    await Promise.all(this.file);
    this.file = this.file + '.pdf'
*/
constanciaSchema.pre('save',async function(){
    const constancia = this;
    const curso = await Curso.findById({_id:this.curso})
    this.file = await new Constancias(constancia,curso).createIktan();
    this.file = this.file + '.pdf'
})


constanciaSchema.pre(/^find/, function(next){
    this.populate({
        path: 'curso',
        select: '-__v'
    })
    next();
})
  
const Constancia = mongoose.model('iktan', constanciaSchema);
module.exports = Constancia;
