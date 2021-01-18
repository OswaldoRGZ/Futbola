/**
 *
 */
const rutaLocal = require('path');
const fs = require("fs"); // Or `import fs from "fs";` with ESM

/**
 *
 * @type {{traerVista: module.exports.traerVista}}
 */
module.exports = {
    traerVista: (respuesta, url) => {
        let vista = url.split("/").join("");
        vista = vista.split("-")[0];
        let ruta = __dirname + "/" + vista + ".html";
        if (fs.existsSync(ruta)) {
            respuesta.sendFile(rutaLocal.join(ruta));
        } else {
            console.log("La vista " + ruta + " no existe");
            respuesta.sendFile(rutaLocal.join(__dirname + "/404.html"));
        }
    }
}
