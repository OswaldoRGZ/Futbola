/**
 *
 */
const db = require('../db');
/**
 *
 * @type {{hacerLogin: module.exports.hacerLogin}}
 */
module.exports = {
    ahora: (peticion, respuesta) => {
        db.query('SELECT now() ', [], (err, respuestaBD) => {
            if (respuestaBD) {
                respuesta.json(respuestaBD.rows[0]);
            } else {
                respuesta.json(err);
            }
        });
    }

}