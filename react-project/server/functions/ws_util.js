function msgClientsGen(fromWhatService, wsServer) {
    return function msgClients(msg) {
        let objectToClients = {
          [fromWhatService]: msg
        }
  
        wsServer.clients.forEach(client => client.send(JSON.stringify(objectToClients)))
    }
}

function runAnyCommand(incomming, servicesCommands, ws)
{
  servicesCommands.forEach(service => {
    if (service.commands.some(command => command.command === incomming.command)) {
      let command = service.commands.find(command => command.command === incomming.command)
      if (command.msgType === "sender")
      {
        command.function(ws)
      }
      else if (command.msgType === "all")
      {
        command.function(service.service)
      }
    }
  })


  console.log('received: %s', incomming)
}

module.exports = {runAnyCommand, msgClientsGen}