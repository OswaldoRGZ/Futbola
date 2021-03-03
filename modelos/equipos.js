/**
 *
 * @param cuerpo
 */
module.exports = function(cuerpo) {
    /**
     *
     * @param body
     */
    this.cargar = (body) => {
        if (!body || !body.Equipos) {
            return this;
        }
        for (let atrib in this.datos) {
            this.datos[atrib] = body.Equipos[atrib] || null;
        }
        return this;
    };
    /**
     *
     * @type {{apellidos: null, clave: null, tipo: null, creado: null, id_usuario: null, eliminad: null, correo: null, modificado: null, nombres: null}}
     */
    this.datos = {
        id_equipo: null,
        nombres: null,
        clave: null,
        creado: null,
        modificado: null,
        eliminado: null
    };
    /**
     *
     * @type {string}
     */
    this.tabla = 'equipos';
    /**
     * Constructor
     */
    if (cuerpo) {
        this.cargar(cuerpo);
    }
};
