/**
 *
 */
const db = require('../db');
const bcrypt = require('bcryptjs');
const HttpStatus = require('http-status-codes').StatusCodes;
const laSesion = require('../sesion');
const modelo = require('../modelos/modelo');
const { getAuth } = require('firebase-admin/auth');

/**
 *
 * @type {{movido: module.exports.movido, entrar: module.exports.entrar, usuarios: module.exports.usuarios}}
 */
module.exports = {
    /**
     * Creacion de un nuevo usuario
     * @param peticion
     * @param respuesta
     */
    nuevo: (peticion, respuesta) => {
        const Usuario = require('../modelos/usuario');
        /*
        Carga y valida el usuario, hay campos que son requeridos, la clave es asignada temporalmente hasta que se active la cuenta
         */
        let elusuario = new Usuario(peticion.body);
        if (!elusuario.datos.nombres || !elusuario.datos.apellidos || !elusuario.datos.correo) {
            respuesta.writeHead(HttpStatus.BAD_REQUEST, { 'Connection': 'close' }).end();
            return;
        }
        /*
        Correo invalido
         */
        if (!modelo.esCorreoValido(elusuario.datos.correo)) {
            respuesta.writeHead(HttpStatus.NOT_ACCEPTABLE, { 'Connection': 'close' }).end();
            return;
        }
        //La clave temporalmente es el correo hasta que se active la cuenta
        elusuario.datos.clave = elusuario.datos.correo;
        elusuario = modelo.unsetNulos(elusuario);
        /*
        insertar en base de datos
         */
        db.insert(elusuario, (yuca) => {
            if (yuca) {
                if (yuca.code === db.constErrDuplicado) {
                    respuesta.writeHead(HttpStatus.FORBIDDEN, { 'Connection': 'close' }).end();
                } else {
                    respuesta.writeHead(HttpStatus.INTERNAL_SERVER_ERROR, { 'Connection': 'close' }).end();
                }
            } else {
                /*
                 Si ok BD, enviar correo con activacion de cuenta y avisar que ok
                 */
                const sgMail = require('@sendgrid/mail');
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);

                const msg = {
                    to: elusuario.datos.correo,
                    from: 'no-reply@softerra.co', // Change to your verified sender
                    subject: 'Activar cuenta en AR2',
                    text: `Hola `,
                    html: '<strong>and easy to do anywhere, even with Node.js</strong>'
                };

                respuesta.writeHead(HttpStatus.CREATED, { 'Connection': 'close' }).end();

                if (Math.random() > 0) {
                    return;
                }
                sgMail
                    .send(msg)
                    .then(() => {
                        console.log('Email sent');
                        respuesta.writeHead(HttpStatus.OK, { 'Connection': 'close' }).end();
                    })
                    .catch((yucaSendgrid) => {
                        console.error(yucaSendgrid);
                        respuesta.writeHead(HttpStatus.INTERNAL_SERVER_ERROR, { 'Connection': 'close' }).end();
                    });

            }

        });

    },
    /**
     *
     * @param peticion
     * @param respuesta
     */
    entrar: (peticion, respuesta) => {
        const Usuario = require('../modelos/usuario');
        let usrForm = new Usuario(peticion.body);

        if (!usrForm.datos.correo || !usrForm.datos.clave) {
            respuesta.writeHead(HttpStatus.BAD_REQUEST, { 'Connection': 'close' }).end();
            return;
        }

        let selUsuario = new Usuario();
        selUsuario.datos.correo = usrForm.datos.correo;
        selUsuario = modelo.unsetNulos(selUsuario);

        db.select(selUsuario, (yuca, datos) => {
            if (yuca) {
                respuesta.writeHead(HttpStatus.INTERNAL_SERVER_ERROR, { 'Connection': 'close' }).end();
            } else {
                //Hacer hash a la clave con salt de 10
                if (datos && datos.rowCount) {
                    //bcrypt.hashSync(xx, 10)
                    let verified = false;
                    try {
                        verified = bcrypt.compareSync(usrForm.datos.clave, datos.rows[0].clave);
                    } catch (yuca) {
                        console.log(yuca);
                    }
                    if (verified) {
                        //Clave correcta
                        laSesion.hacerLogin(peticion);
                        respuesta.writeHead(HttpStatus.ACCEPTED, { 'Connection': 'close' }).end();
                    } else {
                        //Clave incorrecta
                        respuesta.writeHead(HttpStatus.UNAUTHORIZED, { 'Connection': 'close' }).end();
                    }
                } else {
                    //No existe el usuario
                    respuesta.writeHead(HttpStatus.NOT_FOUND, { 'Connection': 'close' }).end();
                }
            }
        });
    },
    /**
     *
     * @param peticion
     * @param respuesta
     */
    movido: (peticion, respuesta) => {
        db.query('SELECT * FROM usuarios_claves WHERE id_usuarios_claves = $1', [parseInt(peticion.params.id)], (err, res) => {
            if (res) {
                respuesta.json(res.rows);
            } else {
                respuesta.json(err);
            }
        });
    },
    /**
     *
     * @param peticion
     * @param respuesta
     */
    usuarios: (peticion, respuesta) => {
        let usuario = peticion.body.usuario || null;
        db.query('SELECT * FROM usuarios_claves WHERE usuario = $1', [usuario], (err, respuestaBD) => {
            if (respuestaBD) {
                respuesta.json(respuestaBD.rows);
            } else {
                respuesta.json(err);
            }
        });
    },
    /**
     *
     * @param peticion
     * @param respuesta
     */
    salir: (peticion, respuesta) => {
        laSesion.cerrarSesionAgente(peticion);
        respuesta.redirect(HttpStatus.MOVED_TEMPORARILY, '/');
    },

    /**
     * Valida el Token Firebase para iniciar sesion de esta forma
     * @param peticion
     * @param respuesta
     */
    validaToken: (peticion, respuesta) => {
        console.log('Validando Token...');
        let idToken = peticion.body.firebaseToken;
        getAuth()
            .verifyIdToken(idToken)
            .then((decodedToken) => {
                console.log('Bien.');
                console.log(decodedToken.uid);
                respuesta.json('ok');
            })
            .catch((error) => {
                console.error('Pailas.');
                console.log(error);
                respuesta.json('ko');
            });
    }
};
