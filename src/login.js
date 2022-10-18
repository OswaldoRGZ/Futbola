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
        (document.querySelectorAll('[data-omf-campologin]')).forEach((elem) => {
            elem.classList.remove('is-invalid');
        });
        mostrarCargando(true);
        signInWithEmailAndPassword(fireAut, usuario, clave)
            .then((userCredential) => {
                mostrarCargando(false);
            })
            .catch((error) => {
                (document.querySelectorAll('[data-omf-msjlogin]')).forEach((elem) => {
                    elem.innerHTML = 'Wrong user or password';
                });
                (document.querySelectorAll('[data-omf-campologin]')).forEach((elem) => {
                    elem.classList.add('is-invalid');
                });
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
     *
     * @param msjError
     */
    function mostrarError(msjError) {
        if (msjError === '') {
            (document.querySelectorAll('[data-omf-campoclave]')).forEach((item) => {
                item.classList.remove('is-invalid');
            });
            (document.querySelectorAll('[data-omf-msjclave]')).forEach((item) => {
                item.innerHTML = '';
            });
        } else {
            (document.querySelectorAll('[data-omf-campoclave]')).forEach((item) => {
                item.classList.add('is-invalid');
            });
            (document.querySelectorAll('[data-omf-msjclave]')).forEach((item) => {
                item.innerHTML = msjError.replace('Firebase: ', '');
            });
        }
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
        mostrarError('');
        let formulario = document.querySelector('#login-formCrear');
        let losDatos = new FormData(formulario);
        const [usuario, clave, reclave] = [losDatos.get('Usuario[usuario]'), losDatos.get('Usuario[clave]'), losDatos.get('Usuario[re-clave]')];
        if (clave !== reclave) {
            mostrarError('Password missmatch');
            return false;
        }
        let usrUnico = usuario + '@gmail.com';//agregamos para tener usuarios unicos y validos para google
        if (!esEmailValido(usrUnico)) {
            alert('No usuario correcto');
            return false;
        }
        mostrarCargando(true);
        createUserWithEmailAndPassword(fireAut, usrUnico, clave)
            .then((userCredential) => {
                document.location.replace('setup');
            })
            .catch((error) => {
                if (error.code === 'auth/invalid-email') {
                    mostrarError('Username already in use');
                } else {
                    mostrarError(error.message);
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
        if (usuario == null) {
            console.table('Hace falta loguearse');
        } else {
            usuario.providerData.forEach((profile) => {
                if (profile.uid) {
                    document.getElementById('login-divyalogeado').classList.remove('hidden');
                    document.getElementById('login-spanletra').innerHTML = profile.email.charAt(0).toUpperCase() || 'XD';
                    document.getElementById('login-spanalias').innerHTML = profile.email.split('@')[0];
                }
            });
        }
    });

    /**
     *
     */
    mostrarCargando(false);
}

window.onload = Login;
