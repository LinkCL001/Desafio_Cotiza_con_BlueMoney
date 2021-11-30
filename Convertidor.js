// La casa de cambios BlueMoney Spa está interesada en ofrecer una plataforma web por lo
// que solicitó contratar a un desarrollador para la creación de una aplicación que calcule los
// montos de las cotizaciones y registre las consultas en un archivo de texto usando el
// siguiente template:
// A la fecha: Thu Sep 03 2020 18:41:00 GMT-0400 (GMT-04:00)
// Fue realizada cotización con los siguientes datos:
// Cantidad de pesos a convertir: 250000 pesos
// Convertido a "dólar" da un total de:
// $324,06
// Deberás construir una aplicación en Node que reciba los datos para la cotización por la línea
// de comandos, como argumentos y consulte la API mindicador para los cálculos
// correspondientes.
// 1. Recibir por la línea de comando los siguientes argumentos: (2 Puntos)
// a. Nombre del archivo que se creará.
// b. Extensión del archivo.
// c. Indicador económico que se desea convertir.
// d. Cantidad de pesos que se quiere cambiar.
// 2. Consultar la API con el módulo https y almacenar la respuesta en una variable.
// (2 Puntos)
// 3. Crear un archivo con el módulo fs cuyos datos están formados por los argumentos
// recibidos por línea de comando y su contenido basado en el template de la
// descripción. (3 Puntos)
// 4. Enviar por consola el contenido del archivo luego de que haya sido creado.
// (2 Puntos)
// 5. Ejecutar la aplicación desde un archivo externo con el módulo child_process
// enviando los argumentos correspondientes y devolviendo por consola el contenido
// del archivo luego de que haya sido creado. (1 Punto)

const https = require("https");
const fs = require("fs");

const argumento = process.argv.slice(2);

let nombreArchivo = argumento[0];
let extArchivo = argumento[1];
let indicador = argumento[2];
let montoPesos = Number(argumento[3]);
let fecha = new Date();
let montoConvertido;



https.get("https://mindicador.cl/api", (resp) => {
    resp.on("data", (data) => {
        let jsonResp = JSON.parse(data);
        // valor convertido segun indicador
        let montoIndicador = valorConvertidoSegunIndicador(jsonResp, indicador, "valor");
        //convertir moneda
        montoConvertido = convertidorMoneda(montoPesos, montoIndicador);
        // template texto
        cotizacionFinal = templateDeTexto(fecha, montoPesos, indicador, montoConvertido)
        // guardar en archivo el texto
        fs.writeFile(`${nombreArchivo}.${extArchivo}`, cotizacionFinal, 'utf8', () => {
            callbackWriteFile(nombreArchivo, extArchivo)})
    })
})

//call writeFile
function callbackWriteFile(nombreArchivo, extArchivo){
    console.log(`Cotizacion guardada`);
    fs.readFile(`${nombreArchivo}.${extArchivo}`,'utf8', callbackReadFile)
}
//callback readFile
function callbackReadFile(_error, dataGuardada){
    console.log(dataGuardada);
}
//obtener propiedad segun indicador
function valorConvertidoSegunIndicador(jsonResp, indicador, propiedad){
    return jsonResp[indicador][propiedad];
}
//Convertidor de moneda
function convertidorMoneda(montoPesos, montoIndicador){
    return montoPesos / montoIndicador;
}
// template texto
function templateDeTexto(fecha, montoPesos, indicador, montoConvertido){
    return `A la fecha: ${fecha}\nFue realizada la cotizzacion con los siguientes datos:\nCantidad de pesos a convertir ${montoPesos} pesos\nConvertido a "${indicador}" da un total de:\n$${montoConvertido}`;
}
