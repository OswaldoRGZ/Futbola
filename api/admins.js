/**
 *
 */
const HttpStatus = require("http-status-codes").StatusCodes;
const laSesion = require("../sesion");
/**
 *
 * @type {{movido: module.exports.movido, entrar: module.exports.entrar, usuarios: module.exports.usuarios}}
 */
module.exports = {
    verificarSesion: (peticion, respuesta) => {
        if (laSesion.estaLogeado(peticion)) {
            respuesta.json(HttpStatus.OK);
        } else {
            respuesta.json(HttpStatus.NOT_FOUND);
        }
    }
};
