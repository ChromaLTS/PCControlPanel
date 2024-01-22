const Hapi = require('@hapi/hapi');
require('dotenv').config();

const {readPEMKey, performECDH} = require('./functions/api_util.js')


const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: process.env.HOST || 'localhost'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return ` 
            <h1 style="text-align:center">Api</h1>
            <h2 style="text-align:center">For intune hardware id collection</h2>
            `;
        }
    });

    

    server.route({
        method: 'GET',
        path: '/public-key',
        handler: (request, h) => {
            const server_publicKey = readPEMKey("public");
            return server_publicKey;
        }
    });

    server.route({
        method: 'POST',
        path: '/sendObjectEncrypted',
        handler: (request, h) => {
            const { remotePublicKey, iv, dataEncrypted } = request.payload;

            if (remotePublicKey === undefined || iv === undefined || dataEncrypted === undefined) {
                return "ERROR"
            }
            
            const server_privateKey = readPEMKey("private");

            console.log(request.payload, remotePublicKey, iv, dataEncrypted)




            /*
            const sharedSecret = performECDH(server_privateKey, remotePublicKey);
            const message = decryptMessage(dataEncrypted, iv, sharedSecret)
            
            const {login, data} = message

            // login should be hashed and salted and peppered
            // could be saved manually as a file
            if (login === "admin" && data === "secret") {
                return "OK"
            }
            else {
                return "ERROR"
            }
            */

            return "OK"
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};










process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

module.exports = {init}

