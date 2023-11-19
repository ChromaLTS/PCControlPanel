const { WebSocketServer, WebSocket } = require('ws')


const ws_homepc = new WebSocket('ws://192.168.1.12:443');

ws_homepc.on('error', console.error);

ws_homepc.on('open', function open() {
  ws_homepc.send('something');
});

ws_homepc.on('message', function message(data) {
  console.log('received: %s', data);
});



const sockserver = new WebSocketServer({ port: 8443 })
sockserver.on('connection', ws => {
    console.log('New client connected!')
    ws.send('connection established')
    ws.on('close', () => console.log('Client has disconnected!'))
    ws.on('message', dataString => {
      data = JSON.parse(dataString)
      if (data.hasOwnProperty('command')) {
        console.log({command: data.command})
        if (data.command === 'isHomePCServerRunning')
        {
          if (ws_homepc.readyState === ws_homepc.OPEN) {
            ws.send(JSON.stringify({isHomePCServerRunning: true}))
          }
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
})

sockserver.on('listening', function (e) {
  console.log('websocket listening')
})

