const pug = require('pug');
const pdf = require('html-pdf');
const { google } = require("googleapis");
const keys = require("../credenciales.json");
const fs = require('fs');
const catchAsync = require('../utils/catchAsync')
class Constancias{
    constructor(constancia,curso){
        //user.curp = this.descomponerPalabra(user.curp);
        //user.shcp = this.descomponerPalabra(user.shcp);
        //this.id = user.id;
        this.constancia = constancia;
        this.curso = curso;
        //this.capacitadores = curso.capacitadores[0];
        //this.capacitadorPrincipal = curso.capacitadorPrincipal;
        
    }

    descomponerPalabra(dato){
        let datos=[];
        for (var i = 0; i < dato.length; i++) {
            datos[i] = dato.charAt(i)
          }
        return datos;
    }


    async createPDF(template,orientation,carpeta,format){
        const Constancia = require('../models/Constancia');
        const datosConstancia = this.constancia;
        //1)Renderizar el html para le correo basado en una plantilla pug
        const html = pug.renderFile(`${__dirname}/../views/constancias/${template}.pug`,{
            constancia: this.constancia,
            curso: this.curso,
        });
        //2)Opciones de pdf
        const opciones={
            format, // A3, A4, A5, Legal, Letter
            orientation, // horizontal // portrait or landscape
            "border": {
                "top": ".3cm", //   default is 0, units: mm, cm, in, px
                "right": ".3cm",
                "bottom": ".3cm",
                "left": ".3cm",
              },
        }
        //3)Crear el pdf
        //let fileName = `${carpeta}-${this.id}-${Date.now()}`
        let fileName = `${this.constancia.nombreCandidato} ${this.constancia.apellidoPaterno} ${this.constancia.apellidoMaterno} ${this.curso.nombreCurso}`
        let directorio = `public/cliente/constancias/${carpeta}/${fileName}.pdf`;
       
        const  EliminarConstanciaIktan=(file)=>{
            const logo = `public/cliente/constancias/Iktan/${file}`
            fs.access(logo, error => {
                if (!error) {
                  fs.unlink(logo,function(error){
                   if(error) console.error('Error Occured:', error);
                    console.log('File deleted Constancia!');
                   });
                  } else {
                    console.error('Error Occured:', error);
                  }
            });
          }
          const  EliminarLogo=(file)=>{
            const logo = `public/servidor/constancias IKTAN/logos/${file}`
            fs.access(logo, error => {
                if (!error) {
                  fs.unlink(logo,function(error){
                   if(error) console.error('Error Occured:', error);
                    console.log('File deleted Logo!');
                   });
                  } else {
                    console.error('Error Occured:', error);
                  }
            });
          }
          const  EliminarBackground=(file)=>{
            const logo = `public/servidor/constancias IKTAN/background/${file}`
            fs.access(logo, error => {
                if (!error) {
                  fs.unlink(logo,function(error){
                   if(error) console.error('Error Occured:', error);
                    console.log('File deleted Background!');
                   });
                  } else {
                    console.error('Error Occured:', error);
                  }
            });
          }
        const createAndUploadFile=catchAsync(async(client, fileName)=>{
            const driveService = google.drive( {version:'v3',auth:client} );
            let fileMetaData = {
              name: fileName,
              parents : ['1mq9A8sc6kZOtPSftXsUdPnlxBfTGvupk']
            }
            let media = {
              mimeType: 'image/png',
              body: fs.createReadStream(`${__dirname}/../public/cliente/constancias/Iktan/${fileName}`) 
            }
              //console.log(await driveService.files.get({fileId:'1HI4YWSqJQiGWWheETj8lHsPKFTqSdrR7',alt:"media"}))
              const x =await driveService.files.create({
              resource: fileMetaData,
              media: media,
              fields: 'id',
              includePermissionsForView: 'published',
              ignoreDefaultVisibility: true
            })
            const id = datosConstancia.id;
                const respuesta =await Constancia.findByIdAndUpdate(id,{file:`https://drive.google.com/file/d/${x.data.id}/view`, idDrive:x.data.id},
                   {new : true, runValidators: true})
         /*   let getlist = (client) => {
                const drive = google.drive({ version: "v3", auth:client });
                const response =  drive.files.list({
                        pageSize: 10,
                        fields: 'nextPageToken, files(id, name)',
                }, (err, res) => {
                        if (err) return console.log('The API returned an error: ' + err);
                        const files = res.data.files;
                        if (files.length) {
                          console.log('Files:');
                          files.map((file) => {
                          console.log(`${file.name} (${file.id})`);
                          });
                        } else {
                          console.log('No files found.');
                        }
                });
             }
             getlist(client) */
          }); 
         pdf.create(html,opciones).toFile(directorio,async function(err,res){
            if(err){
                console.log(err);
            }else{ 
                fileName= fileName + '.pdf'
                const scopes = ['https://www.googleapis.com/auth/drive'];
                const client = new google.auth.JWT(keys.client_email, null, keys.private_key,scopes);
                await createAndUploadFile(client,fileName);
                EliminarConstanciaIktan(fileName);
                EliminarLogo(datosConstancia.logo);
                EliminarBackground(datosConstancia.background)

            }})
            return fileName; 
        }
    async createIktan(){
        return  await this.createPDF('iktan','landscape','Iktan','Letter')      
     }
     async createDC3(){
        await this.createPDF('dc-3','portrait','DC-3','A4')
     }
}


module.exports = Constancias;