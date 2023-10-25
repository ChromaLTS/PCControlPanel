const express = require('express');
const path = require('path');
const app = express();

const { spawn } = require('node:child_process');
const { WebSocketServer } = require('ws')

app.use(express.static(path.join(__dirname, '../build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const sockserver = new WebSocketServer({ port: 443, host: "0.0.0.0" })
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

app.listen(9000);
console.log(`Server listening on port ${process.env.PORT || 9000}`)