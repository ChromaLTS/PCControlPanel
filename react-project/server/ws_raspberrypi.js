const { WebSocketServer, WebSocket } = require('ws')
const { runAnyCommand, msgClientsGen } = require('./functions/ws_util.js')
const { homepc_connection } = require('./services/homepc.js')


const sockserver = new WebSocketServer({ port: 8443 })


sockserver.on('connection', ws => {
    console.log('New client connected!')
    ws.send('connection established')
    ws.on('close', () => console.log('Client has disconnected!'))
    ws.on('message', dataString => {
      data = JSON.parse(dataString)
      runAnyCommand(data, homepc_connection.commands)
    })
    ws.onerror = function () {
      console.log('websocket error')
    }
})

sockserver.on('error', function (e) {
  console.log('websocket error')
})

sockserver.on('listening', function (e) {
  console.log('websocket listening')
})

