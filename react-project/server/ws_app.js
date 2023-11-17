const express = require('express');
const app = express();

const { spawn } = require('node:child_process');
const { WebSocketServer } = require('ws')

const sockserver = new WebSocketServer({ port: 8443, host: "0.0.0.0" })
sockserver.on('connection', ws => {
    console.log('New client connected!')
    ws.send('connection established')
    ws.on('close', () => console.log('Client has disconnected!'))
    ws.on('message', data => {

        console.log('received: %s', data);
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

app.listen(8000, () => {
  console.log('api server started');
});