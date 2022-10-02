import {
    initializeApp
} from 'firebase/app';
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword
} from 'firebase/auth';

import {
    initializeAppCheck,
    ReCaptchaV3Provider
} from 'firebase/app-check';

import {
    fireConf
} from './config';

/**
 *
 */
function Login() {

    const fireApp = initializeApp(fireConf);
    const fireAut = getAuth(fireApp);

    initializeAppCheck(fireApp, {
        provider: new ReCaptchaV3Provider('6LeXpEkiAAAAAOWEA2ON3zuMW5hvUKDV6zuL-k2X'),
        isTokenAutoRefreshEnabled: true
    });


    /**
     *
     * @param usuario
     * @param clave
     */
    function hacerLogin(usuario, clave) {
        if (!esEmailValido(usuario)) {
            alert('No usuario correcto');
            return;
        }
        mostrarCargando(true);
        signInWithEmailAndPassword(fireAut, usuario, clave)
            .then((userCredential) => {
                mostrarCargando(false);
            })
            .catch((error) => {
                mostrarCargando(false);
            });
    }

    /**
     *
     * @param email
     * @returns {boolean}
     */
    function esEmailValido(email) {
        let re = /\S+@\S+\.\S+/;
        return re.test(email);
    }


    /**
     * Llamado a FireBase para crear usuario.
     * @param email
     * @param clave
     * @param ok
     * @param yuca
     */
    function crearUsuario(email, clave, ok, yuca) {
        if (!esEmailValido(email)) {
            alert('No usuario correcto');
            return;
        }
        mostrarCargando(true);
        createUserWithEmailAndPassword(fireAut, email, clave)
            .then((userCredential) => {
                // correcto
                const user = userCredential.user;
                if (ok) {
                    ok(user);
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (yuca) {
                    yuca(errorCode, errorMessage);
                }
            });
    }

    /**
     *
     * @param enciende
     */
    function mostrarCargando(enciende) {
        if (enciende) {
            document.getElementById('barraCargando').style.display = 'block';
        } else {
            document.getElementById('barraCargando').style.display = 'none';
        }
    }

    /**
     *
     * @param elem
     */
    function arreglaNombreUsuario(elem) {
        let usrUnico = elem.value;
        usrUnico = usrUnico.replace(/[^a-z0-9]+/gi, '');
        elem.value = usrUnico;
    }

    /**
     * Asociando onkeyup para los campos que contienen al usuario
     */
    (document.querySelectorAll('#login-inputusr,#login-inputnombre')).forEach((elemento) => {
        elemento.onkeyup = (evento) => {
            arreglaNombreUsuario(evento.target);
        };
    });

    /**
     * Submit formulario de crear cuenta
     * @param evento
     * @returns {boolean}
     */
    document.querySelector('#login-formCrear').onsubmit = (evento) => {
        evento.preventDefault();
        let formulario = document.querySelector('#login-formCrear');
        let losDatos = new FormData(formulario);
        const [usuario, email, clave, reclave] = [losDatos.get('Usuario[usuario]'), losDatos.get('Usuario[email]'), losDatos.get('Usuario[clave]'), losDatos.get('Usuario[re-clave]')];
        if (clave !== reclave) {
            alert('Las claves no coinciden');
            return false;
        }
        let usrUnico = usuario + '@gmail.com';//agregamos para tener usuarios unicos y validos para google
        crearUsuario(usrUnico, clave, (usrCreado) => {
            alert('Creado');
            mostrarCargando(false);
        }, (errorCode, errorMessage) => {
            if (errorCode === 'auth/invalid-email') {
                alert('Nombre de usuario no permitido');
            } else {
                alert(errorMessage);
            }
            mostrarCargando(false);
        });
        return false;
    };

    /**
     *
     * @param evento
     */
    document.querySelector('#login-formIniciar').onsubmit = (evento) => {
        evento.preventDefault();
        let formulario = document.querySelector('#login-formIniciar');
        let losDatos = new FormData(formulario);
        let usuario = losDatos.get('Usuario[email]');
        let clave = losDatos.get('Usuario[clave]');
        hacerLogin(usuario + '@gmail.com', clave);
        return false;
    };
    /**
     *
     */
    onAuthStateChanged(fireAut, usuario => {
        if (usuario != null) {
            usuario.providerData.forEach((profile) => {
                if (profile.uid) {
                    location.replace('/setup');
                }
            });
        } else {
            console.log('Le falta logearse');
        }
    });

    /**
     *
     */
    mostrarCargando(false);
}

window.onload = Login;
