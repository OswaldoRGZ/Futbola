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
 *
 * login -> setup -> dashboard
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
     * Primero checar que el usuario ste logeado
     */
    onAuthStateChanged(fireAut, usuario => {
        if (usuario === null) {
            escribeMensaje('User not logged in');
            setTimeout(() => {
                //location.replace('/login');
                console.log('location.replace(\'/login\')');
            }, 1);
        } else {
            escribeMensaje('Starting setup');
            escribeMensaje('Setup finished');
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
        }).catch((error) => {
            escribeMensaje('Team creation failed...');
        });

        //window.location.replace('/dashboard');
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
        if (!fireAut || !fireAut.currentUser) {
            setTimeout(hacerSetup, 100);
            return;
        }
        escribeMensaje('Validating Database');
        const database = getDatabase(fireApp);
        const userId = fireAut.currentUser.uid;
        /*
        valida la info almacenada en database
         */
        get(ref(database, constantes.RUTA_EQUIPOS + userId)).then((snapshot) => {
            if (snapshot.val() === null) {
                // Parece que no existe el arbol, vamos a crearlo.
                escribeMensaje('No team found, creating...');
            } else {
                const esValido = validarEquipo(snapshot.val());
                if (!esValido) {
                    escribeMensaje('Team was no valid, recreating...');
                }
            }
        }).catch(() => {
            escribeMensaje('Something went wrong, try again later');
            /*
            PENDIENTE reportar error al backend
             */
        });

        fireAut.currentUser.getIdToken(true).then(function(idToken) {
            let cuerpo = { firebaseToken: idToken };
            // Avisando al back que hicimos login ya
            fetch('login/validaToken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cuerpo)
            }).then(r => r.json())
                .then((objson) => {
                    console.log(objson);
                    escribeMensaje('Json parseado bien');
                }).catch((yuca) => {
                escribeMensaje('Error parceando json');
            });
        }).catch(function(error) {
            escribeMensaje('Pues parece que no se pudo sacar el token');
        });

    }

    /**
     *
     * @param texto
     */
    function escribeMensaje(texto) {
        document.getElementById('setup-info').append(texto + '\n');
    }

    hacerSetup();

}

/**
 *
 * @type {Setup}
 */
window.onload = Setup;
