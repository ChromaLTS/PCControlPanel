const { WebSocketServer } = require('ws')
const { Minecraft_Server } = require('./services/minecraft_server.js')

function msgClientsGen(fromWhatService, wsServer) {
  return function msgClients(msg) {
      let objectToClients = {
        [fromWhatService]: msg
      }

      wsServer.clients.forEach(client => client.send(JSON.stringify(objectToClients)))
  }
}

function runAnyCommand(data)
{
  let msgFromHomepc = msgClientsGen('ws_homepc', sockserver)
  let msgFromMinecraftServer = msgClientsGen('Minecraft_Server', sockserver)

  let servicesCommands = [{
    serviceName: 'Minecraft_Server',
    service: Minecraft_Server,
    commands: [{
      command: 'startServer',
      function: Minecraft_Server => Minecraft_Server.startServer(msgFromMinecraftServer)
    },
    {
      command: 'stopServer',
      function: Minecraft_Server => Minecraft_Server.stopServer(msgFromHomepc)
    },
    {
      command: 'forceStopServer',
      function: Minecraft_Server => Minecraft_Server.forceStopServer(msgFromHomepc)
    
    }]
  }]

  servicesCommands.forEach(service => {
    if (service.commands.some(command => command.command === data.command)) {
      let command = service.commands.find(command => command.command === data.command)
      command.function(service.service)
    }
  })


  console.log('received: %s', data)
}

const sockserver = new WebSocketServer({ port: 443 })
sockserver.on('connection', ws => {
    console.log('New client connected!')
    ws.send('connection established')
    ws.on('close', () => console.log('Client has disconnected!'))
    ws.on('message', dataString => {
        let data = JSON.parse(dataString)

        runAnyCommand(data)

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