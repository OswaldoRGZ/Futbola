/**
 *
 * @type {{estaLogeado: (function(*): *)}}
 */
module.exports = {
    estaLogeado: (peticion) => {
        return peticion.session.estaLogeado === 1;
    },
    cerrarSesionAgente: (peticion) => {
        return peticion.session.destroy();
    },
    hacerLogin: (peticion) => {
        return peticion.session.estaLogeado = 1;
    }
};
