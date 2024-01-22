const { WebSocketServer, WebSocket } = require('ws')
const { runAnyCommand, msgClientsGen } = require('../functions/ws_util.js')


let ws_homepc

//let msgToClients_As_raspberrypi = msgClientsGen('ws_raspberry', sockserver)



function startServer () {
    ws_homepc = new WebSocket('ws://192.168.1.12:443');
    ws_homepc.on('error', console.error);

    ws_homepc.on('open', function open() {
      ws_homepc.send('something');
    });
    
    ws_homepc.on('message', function message(data) {
      console.log('received: %s', data);

      
    });
    
}

function isServerRunning (ws) {
  if (ws_homepc.readyState === ws_homepc.OPEN) {
    let msg = JSON.stringify({isHomePCServerRunning: true})
    ws.send(msg)
  }
}

module.exports = {homepc_connection: {startServer, isServerRunning}}