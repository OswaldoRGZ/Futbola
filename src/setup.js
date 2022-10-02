import {
    getAuth,
    onAuthStateChanged
} from 'firebase/auth';
import {
    initializeApp
} from 'firebase/app';
import {
    constantes,
    fireConf
} from './config';

import {
    get,
    getDatabase,
    ref,
    set
} from 'firebase/database';
import {
    initializeAppCheck,
    ReCaptchaV3Provider
} from 'firebase/app-check';

/**
 * Verificar si el usuario posee equipo y cargar en local storage toda esa info
 * si no tiene equipo crear uno de manera predeterminada usando su nombre
 */
function Setup() {
    escribeMensaje('Validating User');
    const fireApp = initializeApp(fireConf);
    const fireAut = getAuth(fireApp);

    //self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    initializeAppCheck(fireApp, {
        provider: new ReCaptchaV3Provider('6LeXpEkiAAAAAOWEA2ON3zuMW5hvUKDV6zuL-k2X'),
        isTokenAutoRefreshEnabled: true
    });

    /**
     * Primero checkear que el usuario ste logeado
     */
    onAuthStateChanged(fireAut, usuario => {
        if (usuario === null) {
            escribeMensaje('User not logged in');
            setTimeout(() => {
                location.replace('/login');
            }, 1);
        } else {
            hacerSetup();
            escribeMensaje('Setup Terminado');
        }
    });

    /**
     *
     * @param database
     * @param userId
     */
    function setNuevoEquipo(database, userId) {
        escribeMensaje('Creating initial configuration...');
        const equipo = constantes.TEMPLATE_EQUIPOS;
        equipo.pais = 'Colombia';
        equipo.nombre = 'Team ' + userId;
        equipo.presupuesto = 0;
        set(ref(database, constantes.RUTA_EQUIPOS + userId), equipo).then(() => {
            escribeMensaje('Team created successfully!');
            window.location.replace('/dashboard');
        }).catch((error) => {
            escribeMensaje('Team creation failed...');
        });
    }

    /**
     * Valida que la estructura de datos de equipos se acuerdo al template
     *
     * @param snap
     */
    function validarEquipo(snap) {
        escribeMensaje('Validating team...');
        for (let i in snap) {
            if (!constantes.TEMPLATE_EQUIPOS[i]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Se conecta a la base de datos y obtiene el arbol con toda la info, si hace falta algo toca reconstruir el arbol
     */
    function hacerSetup() {
        escribeMensaje('Validating Database');
        const database = getDatabase(fireApp);
        const userId = fireAut.currentUser.uid;
        /*
        PENDIENTE obtener de local storage
         */
        get(ref(database, constantes.RUTA_EQUIPOS + userId)).then((snapshot) => {
            if (snapshot.val() === null) {
                // Pare que no existe el arbol, vamos a crearlo.
                setNuevoEquipo(database, userId);
            } else {
                const esValido = validarEquipo(snapshot.val());
                if (!esValido) {
                    escribeMensaje('Team was no valid, recreating...');
                    setNuevoEquipo(database, userId);
                }
            }
        }).catch(() => {
            escribeMensaje('Something went wrong, try again later');
            /*
            PENDIENTE reportar error al backend
             */
        });
    }

    /**
     *
     * @param texto
     */
    function escribeMensaje(texto) {
        document.getElementById('setup-info').append(texto + '\n');
    }


}

/**
 *
 * @type {Setup}
 */
window.onload = Setup;
