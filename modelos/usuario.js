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
        if (!body || !body.Usuarios) {
            return this;
        }
        for (let atrib in this.datos) {
            this.datos[atrib] = body.Usuarios[atrib] || null;
        }
        return this;
    };
    /**
     *
     * @type {{apellidos: null, clave: null, tipo: null, creado: null, id_usuario: null, eliminad: null, correo: null, modificado: null, nombres: null}}
     */
    this.datos = {
        id_usuario: null,
        nombres: null,
        apellidos: null,
        correo: null,
        clave: null,
        tipo: null,
        creado: null,
        modificado: null,
        eliminad: null
    };
    /**
     *
     * @type {string}
     */
    this.tabla = "usuarios";
    /**
     * Constructor
     */
    if (cuerpo) {
        this.cargar(cuerpo);
    }
};
