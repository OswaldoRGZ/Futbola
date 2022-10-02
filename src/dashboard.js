import {
    getAuth,
    onAuthStateChanged,
    signOut
} from 'firebase/auth';
import {
    initializeApp
} from 'firebase/app';
import {
    constantes,
    fireConf
} from './config';
import Juego
    from './juego';

/**
 * Funcion para iniciar el canvas, las clases y dejar listo para funcionar
 * @constructor
 */
function Dashboard() {

    const fireApp = initializeApp(fireConf);
    const fireAut = getAuth(fireApp);
    const ancho = document.getElementById('jugar-espaciototal').offsetWidth;
    const alto = 9 * ancho / 16; // para conservar relacion de 16:9
    const canvas = document.getElementById('jugar-canvas');
    if (!canvas || !canvas.getContext) {
        document.getElementById('jugar-espaciototal').innerHTML = '<h1>Canvas No Supported</h1>';
        return;
    }
    const ctx = canvas.getContext('2d');

    /**
     *
     */
    function todoSalioOk() {
        signOut(fireAut).then(() => {
            location.replace('/login');
        }).catch((error) => {
            console.log(error);
        });
    }

    /**
     *
     */
    function iniciarCanvas() {
        // Ajusta el tamano del canvas
        ctx.canvas.width = ancho * 0.9;//el 90%
        ctx.canvas.height = alto * 0.9;

        let juego = new Juego(ctx);
        juego.iniciaPreparacion();

        let x = 0;
        let y = 0;

        let dibujar = function(x1, y1, x2, y2) {
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.closePath();
        };

        canvas.addEventListener('mousedown', e => {
            if (juego.estado === constantes.ESTADO_JUGANDO) return;
            x = e.offsetX;
            y = e.offsetY;
            estaMoviRaton = true;
            switch (estado) {
                case ESTADO_ENTRENANDO:
                    break;
                case ESTADO_ORDENANDO:
                    juego.ratonClic(e.offsetX, e.offsetY);
                    break;
                default:
                    break;
            }
        });

        canvas.addEventListener('mousemove', e => {
            if (estado === ESTADO_JUGANDO || !estaMoviRaton) return;
            switch (estado) {
                case ESTADO_ENTRENANDO:
                    dibujar(x, y, e.offsetX, e.offsetY);
                    x = e.offsetX;
                    y = e.offsetY;
                    break;
                case ESTADO_ORDENANDO:
                    juego.ratonMueve(e.offsetX, e.offsetY);
                    break;
                default:
                    break;
            }
        });

        window.addEventListener('mouseup', e => {
            estaMoviRaton = false;
            if (estado === ESTADO_JUGANDO) return;
            switch (estado) {
                case ESTADO_ENTRENANDO:
                    dibujar(x, y, e.offsetX, e.offsetY);
                    x = 0;
                    y = 0;
                    break;
                case ESTADO_ORDENANDO:
                    juego.ratonSuelta();
                    break;
                default:
                    break;
            }
        });

    }

    /**
     *
     */
    onAuthStateChanged(fireAut, usuario => {
        if (usuario === null) {
            setTimeout(() => {
                location.replace('/login');
            }, 1000);
        }
    });

    /**
     *
     * @returns {boolean}
     */
    document.querySelector('#jugar-btnsalir').onclick = () => {
        todoSalioOk();
        return false;
    };
    /**
     * INICIALIZACION
     */
    getDatosEquipo();
    iniciarCanvas();
}

/**
 *
 * @type {Dashboard}
 */
window.onload = Dashboard;
