export const fireConf = {
    apiKey: 'AIzaSyBEbhe1vS6dhELvmKXnRzTRU7zcwlpd-lc',
    authDomain: 'omf-firebase-servicios.firebaseapp.com',
    projectId: 'omf-firebase-servicios',
    storageBucket: 'omf-firebase-servicios.appspot.com',
    messagingSenderId: '101179066732',
    appId: '1:101179066732:web:5031d22cf2cafdf223cb49',
    databaseURL: 'https://omf-firebase-servicios-default-rtdb.firebaseio.com/'
};
export const constantes = {
    ESTADO_PREPARANDO: 0,
    ESTADO_ORDENANDO: 1,
    ESTADO_JUGANDO: 2,
    ESTADO_ENTRENANDO: 3,
    POSESION_IZQ: -1,
    POSESION_DER: 1,
    POSESION_NADIE: 0,
    TIEMPO_TOTAL: 300,
    INTERVALO_PENSAR: 250,
    RUTA_EQUIPOS: '/equipos/',
    TEMPLATE_EQUIPOS: {
        nombre: '',
        pais: '',
        jugadores: '[]',
        presupuesto: ''
    },
    TEMPLATE_JUGADORES: {
        nombre: '',
        edad: '',
        pais: '',
        habilidades: {},
        salario: ''
    }
};

