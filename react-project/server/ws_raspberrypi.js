const { WebSocketServer, WebSocket } = require('ws')
const { runAnyCommand, msgClientsGen } = require('./functions/ws_util.js')
const { homepc_connection } = require('./raspberrypi_services/homepc.js')
const api = require('./api_raspberyypi.js')

api.init()

const sockserver = new WebSocketServer({ port: 8443 })

let commands = [{
  serviceName: 'homepc',
  service: homepc_connection,
  commands: [{
    command: 'isHomePCServerRunning',
    msgType: "sender",
    function: ws => homepc_connection.isServerRunning(ws)
  }]
}]


sockserver.on('connection', ws => {
    console.log('New client connected!')
    ws.send('connection established')
    ws.on('close', () => console.log('Client has disconnected!'))
    ws.on('message', dataString => {
      data = JSON.parse(dataString)
      runAnyCommand(data, commands, ws)
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

