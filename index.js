/*
 * Servidor principal para peticiones WEB
 * npm run devWin
 */
/**
 * LIBRERIAS
 */
const express = require('express');
const session = require('express-session');
const ruta = require('path');
const vista = require('./vista');
const { config } = require('./configuracion/index');
const bodyParser = require('body-parser');
const HttpStatus = require('http-status-codes').StatusCodes;
const morgan = require('morgan');
const laSesion = require('./sesion');
/**
 * INSTANCIAS
 */
const appExpress = express();
const sess = {
    secret: 'onix y gatos',
    cookie: {},
    resave: false,
    saveUninitialized: true
};
/**
 * CONFIGURACION
 */
if (!config.dev) {
    appExpress.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true;// serve secure cookies
}
/**
 * APLICACION
 */
appExpress.use(session(sess));
appExpress.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
appExpress.use('/cdn', express.static(ruta.join(__dirname, '/cdn')));
appExpress.use('/dist', express.static(ruta.join(__dirname, '/dist')));
appExpress.use(morgan('combined'));

/**
 * Servir el root o raiz, solo lo vamos a necesitar como html
 */
appExpress.get('/', function(req, respuestas) {
    if (laSesion.estaLogeado(req)) {
        respuestas.redirect(HttpStatus.MOVED_TEMPORARILY, '/admins-tablero');
    } else {
        /*
        No hay sesion iniciada ni juego corriendo ni nada, enviar al inicio
         */
        vista.traerVista(respuestas, 'login');
    }
});

/**
 * Funcion para responder tanto POST como GET
 */
appExpress.use((peticion, respuesta) => {
    peticion.header('Access-Control-Allow-Origin', '*');
    if (peticion.method === 'POST') {
        /*
        La peticion debe verse asi
        POST /servicio/objeto HTTP/1.1
        Content-Type: application/json
        Accept: application/json
        Format: application/x-www-form-urlencoded
         */
        let partes = peticion.url.split('/'); //esperamos que quede ['', <el post>]
        if (partes.length === 3) {
            //Limpiar las partes, solo permitimos texto en minuscula y guion al piso
            for (let i in partes) {
                partes[i] = partes[i].replace(/[^a-zA-Z_]/g, '');
            }
            //buscamos si el controlador existe
            let api;
            try {
                api = require('./api/' + partes[1]);
            } catch (yuca) {
                console.log('La peticion POST [' + partes[1] + '] no existe');
                respuesta.writeHead(HttpStatus.NOT_FOUND, { 'Connection': 'close' });
                respuesta.end(HttpStatus.NOT_FOUND + '');
                return;
            }
            if (api[partes[2]]) {
                try {
                    api[partes[2]](peticion, respuesta);
                } catch (yuca) {
                    console.error(yuca);
                    respuesta.writeHead(HttpStatus.INTERNAL_SERVER_ERROR, { 'Connection': 'close' }).end(HttpStatus.INTERNAL_SERVER_ERROR + '');
                }
            } else {
                console.log('El metodo [' + partes[2] + '] de la peticion POST [' + partes[1] + '] no existe');
                respuesta.writeHead(HttpStatus.BAD_REQUEST, { 'Connection': 'close' }).end(HttpStatus.BAD_REQUEST + '');
            }
        } else {
            //tiene formato incorrecto
            console.log('La peticion POST [' + peticion.url + '] es incorrecta');
            respuesta.writeHead(HttpStatus.BAD_REQUEST, { 'Connection': 'close' }).end(HttpStatus.BAD_REQUEST + '');
        }
    } else {
        vista.traerVista(respuesta, peticion.url);
    }
});
/**
 * INICIAR EL SERVIDOR
 */
appExpress.listen(config.puerto, function() {
    console.log('Escuchando servidor %s', config.puerto);
});
/*
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const fireConf = {
    apiKey: 'AIzaSyBEbhe1vS6dhELvmKXnRzTRU7zcwlpd-lc',
    authDomain: 'omf-firebase-servicios.firebaseapp.com',
    projectId: 'omf-firebase-servicios',
    storageBucket: 'omf-firebase-servicios.appspot.com',
    messagingSenderId: '101179066732',
    appId: '1:101179066732:web:5031d22cf2cafdf223cb49'
};
const fireApp = initializeApp(fireConf);
const fireAut = getAuth(fireApp);
const fireDB = getFirestore(fireApp);

onAuthStateChanged(fireAut, usuario => {
    if (usuario != null) {
        console.log('Ya ta logeado');
    } else {
        console.log('Le falta logearse');
    }
});

 */
