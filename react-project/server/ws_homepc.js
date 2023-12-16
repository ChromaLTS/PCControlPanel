const { WebSocketServer } = require('ws')
const { Minecraft_Server } = require('./homepc_services/minecraft_server.js')
const { runAnyCommand, msgClientsGen } = require('./functions/ws_util.js')

const sockserver = new WebSocketServer({ port: 443 })

let msgToClients_As_Homepc = msgClientsGen('ws_homepc', sockserver)
let msgToClients_As_MinecraftServer = msgClientsGen('Minecraft_Server', sockserver)

let servicesCommands = [{
  serviceName: 'Minecraft_Server',
  service: Minecraft_Server,
  commands: [{
    command: 'startServer',
    function: Minecraft_Server => Minecraft_Server.startServer(msgToClients_As_MinecraftServer)
  },
  {
    command: 'stopServer',
    function: Minecraft_Server => Minecraft_Server.stopServer(msgToClients_As_Homepc)
  },
  {
    command: 'forceStopServer',
    function: Minecraft_Server => Minecraft_Server.forceStopServer(msgToClients_As_Homepc)
  
  }]
}]


sockserver.on('connection', ws => {
    console.log('New client connected!')
    ws.send('connection established')
    ws.on('close', () => console.log('Client has disconnected!'))
    ws.on('message', dataString => {
        let data = JSON.parse(dataString)

        runAnyCommand(data, servicesCommands, ws)

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