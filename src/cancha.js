/**
 *
 */
class Cancha {
    minX = 0;
    minY = 0;
    maxX = 0;
    maxY = 0;
    alto = 0;
    ancho = 0;
    DOS_PI = Math.PI * 2;


    /**
     *
     * @param ctx
     */
    constructor(ctx) {
        let bordes = 1 / 100;

        this.minX = ctx.canvas.width * bordes;
        this.minY = ctx.canvas.height * bordes;
        this.maxX = ctx.canvas.width - ctx.canvas.width * bordes;
        this.maxY = ctx.canvas.height - ctx.canvas.height * bordes;
        this.alto = this.maxY - this.minY;
        this.ancho = this.maxX - this.minX;

        this.bombaAncho = this.ancho / 7;
        this.bombaAlto = this.alto / 2;
        this.bombaMinY = this.minY + this.alto / 4;
        this.bombaDerMinX = this.maxX - this.bombaAncho;
        this.bombaChicaAncho = this.ancho / 18;
        this.bombaChicaAlto = this.alto / 4;
        this.bombaChicaMinY = this.bombaMinY + this.alto / 8;
        this.bombaChicaDerMinX = this.maxX - this.bombaChicaAncho;
        this.bombaIzqMinXRadio = this.minX + this.bombaAncho;
        this.mitadX = this.ctx.canvas.width / 2;
        this.mitadY = this.ctx.canvas.height / 2;
        this.radioCentro = this.bombaAncho / 3;
        this.radioCompleto = this.DOS_PI;
        this.radioMitad = Math.PI / 2;
        this.porteriaMinY = this.minY + 4 * this.alto / 9;
        this.porteriaMaxY = this.alto / 9;
    }

    /**
     *
     * @param elctx
     */
    dibujar(elctx) {
        elctx.clearRect(0, 0, elctx.canvas.width, elctx.canvas.height);
        elctx.strokeStyle = 'white';
        elctx.lineWidth = 1;
        //dibujamos el fondo verde
        elctx.beginPath();
        elctx.rect(0, 0, elctx.canvas.width, elctx.canvas.height);
        elctx.fillStyle = 'rgba(0, 120, 24, 0.9)';
        elctx.fill();
        elctx.closePath();

        //bordes de la cancha
        elctx.beginPath();
        elctx.rect(this.minX, this.minY, this.ancho, this.alto);
        elctx.stroke();
        elctx.closePath();

        //bomba izquierda y derecha
        elctx.beginPath();
        elctx.rect(minX, this.bombaMinY, this.bombaAncho, this.bombaAlto);
        elctx.stroke();
        elctx.closePath();
        elctx.beginPath();
        elctx.rect(minX, this.bombaChicaMinY, this.bombaChicaAncho, this.bombaChicaAlto);
        elctx.stroke();
        elctx.closePath();
        elctx.beginPath();
        elctx.arc(this.bombaIzqMinXRadio, this.mitadY, this.radioCentro, -this.radioMitad, this.radioMitad);
        elctx.stroke();
        elctx.closePath();
        elctx.beginPath();
        elctx.rect(this.bombaDerMinX, this.bombaMinY, this.bombaAncho, this.bombaAlto);
        elctx.stroke();
        elctx.closePath();
        elctx.beginPath();
        elctx.arc(this.bombaDerMinX, this.mitadY, this.radioCentro, this.radioMitad, -this.radioMitad);
        elctx.stroke();
        elctx.closePath();
        elctx.beginPath();
        elctx.rect(this.bombaChicaDerMinX, this.bombaChicaMinY, this.bombaChicaAncho, this.bombaChicaAlto);
        elctx.stroke();
        elctx.closePath();

        //linea de la mitad y circulo
        elctx.beginPath();
        elctx.rect(this.mitadX, minY, 0, alto);
        elctx.stroke();
        elctx.closePath();
        elctx.beginPath();
        elctx.arc(this.mitadX, this.mitadY, this.radioCentro, 0, this.radioCompleto);
        elctx.stroke();
        elctx.closePath();

        //porterias
        elctx.beginPath();
        elctx.rect(0, this.porteriaMinY, minX, this.porteriaMaxY);
        elctx.stroke();
        elctx.closePath();
        elctx.beginPath();
        elctx.rect(maxX, this.porteriaMinY, minX, this.porteriaMaxY);
        elctx.stroke();
        elctx.closePath();
    }
}
