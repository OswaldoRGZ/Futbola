module.exports = {
    /**
     *
     * @param modelo
     * @returns {*}
     */
    unsetNulos: (modelo) => {
        let ret = {};
        for (let i in modelo.datos) {
            if (modelo.datos[i] !== null) {
                ret[i] = modelo.datos[i];
            }
        }
        modelo.datos = ret;
        return modelo;
    },
    /**
     *
     * @param email
     * @returns {boolean}
     */
    esCorreoValido: (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

};
