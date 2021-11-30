const child_process = require('child_process');


function convertirMoneda(){
    return new Promise((resolve, reject) => {
        child_process.exec(`node Convertidor.js moneda txt dolar 25000`, function (error, stdout, stderr) {
                resolve(stdout);
            });
    })
};
convertirMoneda().then(data => console.log(data));