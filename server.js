const crypto = require("crypto");
var express = require('express');
var app = express();
var fs = require('fs');
const multer = require('multer');
const path = require('path');

 



var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads');
    },
    filename: function (req, file, callback) {
      callback(null, 'archivo.txt');
    }
  });
  var upload = multer({ storage : storage}).single('txt');

  app.post('/upload',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error subiendo TXT");
        }
        console.log("El archivo ha sido exitosamente subido");
        fs.readFile('uploads/archivo.txt', 'utf8', function(err, data) {
            if (err) throw err;
            const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
                modulusLength: 2048, //2048 bits
            })
            
            console.log(
                publicKey.export({
                    type: "pkcs1",
                    format: "pem",
                }),
            
                privateKey.export({
                    type: "pkcs1",
                    format: "pem",
                })
            )
            
            //Encriptacion
            
            const encryptedData = crypto.publicEncrypt(
                {
                    key: publicKey,
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                    oaepHash: "sha256",
                },
                Buffer.from(data)
            )
            
            // Esta en bytes, entonces la imprimimos en base64
            console.log("encypted data: ", encryptedData.toString("base64"))
            
            const decryptedData = crypto.privateDecrypt(
                {
                    key: privateKey,
                    // Indicamos el tipo de algoritmo
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                    oaepHash: "sha256",
                },
                encryptedData
            )
            
            // Imprimimos la desencriptacion 
            console.log("decrypted data: ", decryptedData.toString())
            
            // data va a ser mi archivo
            const verifiableData = data
            
            // Generacion de firma
            const signature = crypto.sign("sha256", Buffer.from(verifiableData), {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            })
            
            console.log(signature.toString("base64"))
            
            // Verificacion de la firma
            const isVerified = crypto.verify(
                "sha256",
                Buffer.from(verifiableData),
                {
                    key: publicKey,
                    padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                },
                signature
            )
            
            console.log("El documento esta firmado? -> Verificacion ", isVerified)
        
        });
        
    });
});




app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});



app.listen(3000, function () {
    console.log('Servidor iniciado en el puerto 3000');
  });
  