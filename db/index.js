const { Pool } = require("pg");
const pool = new Pool();
/*
Query puede venir asi tambien
const query = {
    text: 'SELECT * FROM usuarios WHERE id > $1',
    values: [0]
}
 */
module.exports = {
    query: (archivoSQL, params, callback) => {
        let textoSQL = "";
        try {
            const consulta = require("./consultas/" + archivoSQL + ".js");
            textoSQL = consulta.consulta;
        } catch (yuca) {
            callback(yuca);
            return;
        }
        return pool.query(textoSQL, params, (err, res) => {
            if (res) {
                callback(err, res);
            } else {
                console.log(err);
                callback(err, []);
            }
        });
    },
    getClient: (callback) => {
        pool.connect((err, client, done) => {
            const query = client.query;
            // monkey patch the query method to keep track of the last query executed
            client.query = (...args) => {
                client.lastQuery = args;
                return query.apply(client, args);
            };
            // set a timeout of 5 seconds, after which we will log this client's last query
            const timeout = setTimeout(() => {
                console.error("A client has been checked out for more than 5 seconds!");
                console.error(`The last executed query on this client was: ${client.lastQuery}`);
            }, 5000);
            const release = (err) => {
                // call the actual 'done' method, returning this client to the pool
                done(err);
                // clear our timeout
                clearTimeout(timeout);
                // set the query method back to its old un-monkey-patched version
                client.query = query;
            };
            callback(err, client, release);
        });
    },
    /**
     * Metodo para insertar tipo ORM
     * @param modelo
     * @param callback
     */
    insert: (modelo, callback) => {
        let nombreTabla = modelo.tabla;
        let cont = 1;
        let columnas = "";
        let valores = "";

        let params = [];

        for (let unaCol in modelo.datos) {
            columnas += ` ${unaCol} ,`;
            valores += ` $${cont} ,`;
            params.push(modelo.datos[unaCol]);
            cont++;
        }
        columnas = columnas.substring(0, columnas.length - 1);
        valores = valores.substring(0, valores.length - 1);

        let consulta = `INSERT INTO ${nombreTabla} (${columnas}) VALUES (${valores}) RETURNING *`;

        pool.query(consulta, params, (err, res) => {
            if (res) {
                callback(err, res);
            } else {
                callback(err, []);
            }
        });
    },
    /**
     *
     * @param modelo
     * @param callback
     */
    select: (modelo, callback) => {
        let nombreTabla = modelo.tabla;
        let cont = 1;
        let condiciones = "";
        let params = [];

        for (let unaCol in modelo.datos) {
            condiciones += ` ${unaCol} = $${cont} AND`;
            params.push(modelo.datos[unaCol]);
            cont++;
        }
        condiciones = condiciones.substring(0, condiciones.length - 3);

        let consulta = `SELECT * FROM ${nombreTabla} WHERE ${condiciones} `;
        console.log(consulta);

        pool.query(consulta, params, (err, res) => {
            if (res) {
                callback(err, res);
            } else {
                callback(err, []);
            }
        });
    },
    /**
     *
     */
    constErrDuplicado: "23505"
};
