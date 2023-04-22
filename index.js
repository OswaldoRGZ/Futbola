/*
 * Servidor principal para peticiones WEB
 * npm run devWin
 */
/**
 * LIBRERIAS
 */
const express = require('express');
const compresion = require('compression');
const ruta = require('path');
const vista = require('./vista');
const { config } = require('./configuracion/index');
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
appExpress.use(express.json());
appExpress.use(compresion());
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
    //peticion.header('Access-Control-Allow-Origin', '*');
    if (peticion.method === 'POST') {
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

/**
 * Probando firebase
 * let serviceAccount = require('./configuracion/serviceAccountKey.json');
 */

const laApp = require('firebase-admin/app');
laApp.initializeApp({
    apiKey: 'AIzaSyBEbhe1vS6dhELvmKXnRzTRU7zcwlpd-lc',
    authDomain: 'omf-firebase-servicios.firebaseapp.com',
    projectId: 'omf-firebase-servicios',
    storageBucket: 'omf-firebase-servicios.appspot.com',
    messagingSenderId: '101179066732',
    appId: '1:101179066732:web:5031d22cf2cafdf223cb49',
    databaseURL: 'https://omf-firebase-servicios-default-rtdb.firebaseio.com/',
    type: 'service_account',
    project_id: 'omf-firebase-servicios',
    private_key_id: 'b60c6682f1a428d1b487273cb03dab9db0f7426b',
    private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCtz4vozfYDTpFY\nQhAWDEX9U8xzydUjjowh0Oe247ElWkKOJHnNXOv9yGZWTLIA4RnEibmocVVqbPxx\npTIIm0pjexMqTEAJNUvHaScyvo+Uzpgie9hSEHU1j135JkGkVGRpyzjca61zS5De\nzvYhy+lLOjz76vDYGgvYMCCoRbiVcdElNGmgmFXAAzTGT3NWWPnW5lRKDvA8FB8C\nIxJV+QX1T/51NmorkSYclLQJTPktn5zl5WzTLwjE0PdiUBAIEkuG3yDn+ZxqtTTe\nhD1o9sra/ALpQogu9ImS+WoRpyiUWiWGCII6EDYNiO67cvnnVEHxLyl3YmDyCVvg\nd/NW9BO7AgMBAAECggEAR+ll/oUwcv/PvM9gbm7Xik9geMuZ5qM0sU0Iga/E/CpS\n/RJ0XpZCgXaneK80uo5npdxBt0Jkz6qV68MoZ00wwuYJ8OcpW2X0m2WTNTiImU28\nvg+1WYa7p9RQUiQU5pOQFAFj3jaixeAO6VCBn0wJkvlef/Adg5uLKQAIkvZ9vz5v\n5QuWixOVoTmKkgvDlGN6UZ3wpgDmwwrdZIgYdg8lKWP2raNpIq+jHeRrAIW0T8r4\nTR53Im2rZCBDTDmXbFM6ZN89ltLncngHaAge2fb7tJUC0HyQX+PIr55cWQh/a5K0\nnKo5VXrmE/EUenrCbq/Slbwy1Q2HYV3sf7j80YGwqQKBgQDkxJ3YV4V83bP44mkG\nh3qsAkC0HEa5OgEGYcvspoNqQKxxKyKKNRQEPxJu1qEtM/imrblSw8LX/Yoe2rmm\n3JGPstI02EPfkAciX+XcxUKD0kBUOF3pKjgo46MRSIEQhAsNFNvWmxhbR1Sd4Ugq\nxvGnO+rKBTyr7wp4AMm/CgaBPwKBgQDCgC77V6ZVADCDlOlKDab7H8506PgL6y7b\n3jbBGL4iS5gZWEub2kVfv27x7S+lSiVSpgrikMKqMfAiGdChBnfS5HQStDDn6/jN\nEoew9J4QtpGF/Ce/+UNh47xjbB2ySUHsVDg8Z9aiiyXRy7hHI8NC79B+qnEyA9yE\nB4Iz7+OShQKBgAII+bp99NMKidpR8Us8k0vKbVbs1Xg6Wt36qry9MngUgTQ0hQcj\nt7zd7sULpb1oM/MPopFo6mfPepYRrgsc9TKJDbOopNntRxL4NWxEWPYhPa9CHRvA\n42UBuWai9Xr3Ib4JDHeZQ5s0RD1vTpwKzwWE0+7eIw8IflhY8XKAnVQzAoGAdUve\niX9jdRGHMGNGiX1QPVQCKykwJefwO3J4bN0iFQantGk2N8hbXBHTs5yJxlG/zmcK\nW3ZXn1I8ciRFWEbRTmKtyXXXpJX/VpUdNc9f385qVnYp9rE5PLidrQvPoOxjEEX+\nIBezLhVienI0MNrVb/G2OB1L5JDFlO3+TJoYEQ0CgYA9YyLHB9N8Vg9YyfC90/va\n2Hx8TSarxAYJ+rDI2JQPI3zQWhmX28DbVBV+spJTCM/tOg2AJqAvgbCRyE68YOS8\nsVeGIe8fUSYf/rcrt7N7tLJE1d1vOX1tdqr/QxDQ8RQqEfCdsaKb9HI7HVZTijVE\nUVzR9vC0OIxbe77vDv2bUQ==\n-----END PRIVATE KEY-----\n',
    client_email: 'firebase-adminsdk-g2vo1@omf-firebase-servicios.iam.gserviceaccount.com',
    client_id: '103671169673236128632',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-g2vo1%40omf-firebase-servicios.iam.gserviceaccount.com'
});
