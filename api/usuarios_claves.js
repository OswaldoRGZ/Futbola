/**
 *
 const db = require('../db');
 const bcrypt = require('bcryptjs');
 const Busboy = require('busboy');

 module.exports = {
    crearCuenta: (peticion, respuesta) => {
        let busboy = new Busboy({headers: req.headers});
        let campos = [];
        let tableName = '';

        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            file.on('data', function (data) {
                console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
            });
            file.on('end', function () {
                console.log('File [' + fieldname + '] Finished');
            });
            if (filename) {
                console.log('El Encoding es ' + encoding + ' ');
                console.log('El Mimetype es ' + mimetype + ' ');
                let saveTo = ruta.join(__dirname, 'subidas', Math.floor(Math.random() * 9999999999) + '_' + ruta.basename(filename));
                let outStream = fs.createWriteStream(saveTo);
                file.pipe(outStream);
            }
        });

        busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
            if (fieldname === 'tableName') {
                tableName = val;
            } else {
                campos.push({'campo': fieldname, 'valor': val});
            }
            console.log(fieldnameTruncated, valTruncated, tableName);
        });

        busboy.on('finish', function () {
            //let textoQuery = insertarObjetoEnBd(campos);
            //let losValores = ["angelica","maria","loaiza_loaiza",null];

            function insertarObjetoEnBd(campos, tableName) {

                let field = '';
                let values = '';
                let cons = 1;

                campos.forEach(function (value) {
                    values += '\'' + value.valor + (cons === campos.length ? '\'' : '\',');
                    field += value.campo + (cons === campos.length ? '' : ',');
                    cons++;
                });
                let laConsulta = 'INSERT INTO ' + tableName + ' (' + field + ')  VALUES (' + values + ' )';
                console.log(laConsulta, campos);
            }

            insertarObjetoEnBd(campos, tableName);
            res.writeHead(HttpStatus.OK, {'Connection': 'close'});
            res.end('Mostrar la vista de inquilino registrado');
        });

        return req.pipe(busboy);
    },
}

 appExpress.get("/clientes/:id_clientes", (peticion, respuestaGET) => {
    let id = parseInt(peticion.params.id_clientes);
    if (isNaN(id)) {
        respuestaGET.json(["ID debe existir y ser número"]);
    } else {
        console.log("etc db");
    }
});

 appExpress.get("/usuario/:id", (req, respuesta) => {
    let id = parseInt(req.params.id);
    if (isNaN(id)) {
        respuesta.json(["ID debe ser numero"]);
    } else {
        console.log("Movido");
    }
});
 */
