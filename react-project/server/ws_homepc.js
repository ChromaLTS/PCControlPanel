const { spawn } = require('node:child_process');
const { WebSocketServer } = require('ws')

function msgClientsGen(fromWhatService, wsServer) {
  return function msgClients(msg) {
      let objectToClients = {
        [fromWhatService]: msg
      }

      wsServer.clients.forEach(client => client.send(JSON.stringify(objectToClients)))
  }
}

const sockserver = new WebSocketServer({ port: 443 })
sockserver.on('connection', ws => {
    console.log('New client connected!')
    ws.send('connection established')
    ws.on('close', () => console.log('Client has disconnected!'))
    ws.on('message', dataString => {
        data = JSON.parse(dataString)
        if (data.hasOwnProperty('command')) {
          console.log({command: data.command})
          if (data.command === 'startServer') 
          {
            startServer(msgClientsGen('Minecraft_Server', sockserver))
          } 
          else if (data.command === 'stopServer') 
          {
            stopServer(msgClientsGen('ws_homepc', sockserver))
          } 
          else if (data.command === 'forceStopServer') 
          {
            forceStopServer(msgClientsGen('ws_homepc', sockserver))
          }
        }
        else {
          console.log('received: %s', data);
        }
    })
    ws.onerror = function () {
      console.log('websocket error')
    }
})

sockserver.on('error', function (e) {
  console.log('websocket error')
  console.error(e)
})

sockserver.on('listening', function (e) {
  console.log('websocket listening')
})