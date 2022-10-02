/**
 *
 */
export class Juego {
    estaMoviRaton = false;
    estado = this.ESTADO_PREPARANDO;
    ctx = null;

    /**
     *
     * @param elctx
     */
    constructor(elctx) {
        this.ctx = elctx;

        this.golesIzq = 0;
        this.golesDer = 0;
        this.tiempRes = 0;
        this.posesIzq = 1;
        this.posesDer = 1;
        this.posesion = this.POSESION_NADIE;

        this.equipoA = new Equipo(true);
        this.equipoB = new Equipo(false);
        this.balon = new Balon();
        this.cancha = new Cancha(elctx);
        //Pasa de estado previo a estado ordenando
        this.estado = this.ESTADO_ORDENANDO;
    }

    /**
     *
     * @param offsetX
     * @param offsetY
     */
    ratonClic(offsetX, offsetY) {
        if (!this.equipoA.selecJugador(offsetX, offsetY)) {
            this.equipoB.selecJugador(offsetX, offsetY);
        }
    };

    /**
     *
     * @param offsetX
     * @param offsetY
     */
    ratonMueve(offsetX, offsetY) {
        if (!this.equipoA.moverJugador(offsetX, offsetY)) {
            this.equipoB.moverJugador(offsetX, offsetY);
        }
    };

    /**
     *
     */
    ratonSuelta() {
        if (!this.equipoA.sueltaJugador()) {
            this.equipoB.sueltaJugador();
        }
    };

    /**
     *
     */
    dibujar() {
        //Limpiar
        this.cancha.dibujar(this.ctx);
        //equipos
        this.equipoA.dibujar(this.ctx);
        this.equipoB.dibujar(this.ctx);
        this.balon.dibujar(this.ctx);
    }

    /**
     *
     */
    actualizar() {
        if (this.estado === constantes.ESTADO_JUGANDO) {
            this.balon.actualizar(this.cancha);
            let estadoPartido = {
                golesIzq: this.golesIzq,
                golesDer: this.golesDer,
                tiempRes: this.tiempRes
            };
            this.equipoA.actualizar(this.equipoB, this.balon, this.posesion === this.POSESION_IZQ, estadoPartido, this.cancha);
            this.equipoB.actualizar(this.equipoA, this.balon, this.posesion === this.POSESION_DER, estadoPartido, this.cancha);
        }
        this.tiempRes++;
    }

    /**
     * tiempo es un param opcional
     */
    ciclo() {
        this.actualizar();
        this.dibujar();
        requestAnimationFrame(this.ciclo.bind(this));
    }

    /**
     *
     */
    iniciaPreparacion() {
        this.ciclo();
    }
}

export default Juego;
