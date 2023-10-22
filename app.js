const http = require("http");
const fs = require('fs').promises;
const { spawn } = require('node:child_process');
const { WebSocketServer } = require('ws')


const host = 'localhost';
const port = 80;

let mcLocation = String.raw`C:\Users\Kasper Holmgrün\Documents\Minecraft Server`
let mcServer = null;


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



const requestListener = function (req, res) {
    
    if(req.url == "/favicon.ico"){
        fs.readFile(__dirname + "/media/favicon/favicon.ico")
        .then(contents => {
            res.setHeader("Content-Type", "image/x-icon");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            res.writeHead(500);
            res.end(err);
            return;
        });
    }
    else if(req.url == "/favicon-32x32.png"){
        fs.readFile(__dirname + "/media/favicon/favicon-32x32.png")
        .then(contents => {
            res.setHeader("Content-Type", "image/png");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            res.writeHead(500);
            res.end(err);
            return;
        });
    }
    else if(req.url == "/"){
        console.log(req.url)
        fs.readFile(__dirname + "/index.html")
        .then(contents => {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            res.writeHead(500);
            res.end(err);
            return;
        });
    }
    else if(req.url == "/request-action")
    {
        if(req.method == "POST"){
            req.on('data', function (chunk) {
                let data = chunk.toString();

                if(data == "shutdown=Shutdown")
                {
                    console.log("Shutdown");

                    shutdown_cmd = spawn('powershell', ['shutdown', String.raw`/s`]);


                    fs.readFile(__dirname + "/index.html")
                    .then(contents => {
                        res.setHeader("Content-Type", "text/html");
                        res.writeHead(200);
                        res.end(contents);
                    })
                    .catch(err => {
                        res.writeHead(500);
                        res.end(err);
                        return;
                    });
                }
                else if (data == "start-mc=Start-mc")
                {
                    console.log("Start MC");

                    mcServer = spawn('powershell', ['java', String.raw`-jar .\paper-1.20.2-217.jar -nogui`], {cwd: mcLocation});

                    mcServer.stdout.on('data', (data) => {
                        console.log(`stdout: ${data}`);
                        sockserver.clients.forEach(client => client.send(data.toString('utf8')))
                    });

                    mcServer.stderr.on('data', (data) => {
                        console.error(`stderr: ${data}`);
                        sockserver.clients.forEach(client => client.send(data.toString('utf8')))
                    });

                    mcServer.on('close', (code) => {
                        console.log(`child process exited with code ${code}`);
                        sockserver.clients.forEach(client => client.send(data.toString('utf8')))
                    }); 

                    fs.readFile(__dirname + "/index.html")
                    .then(contents => {
                        res.setHeader("Content-Type", "text/html");
                        res.writeHead(200);
                        res.end(contents);
                    })
                    .catch(err => {
                        res.writeHead(500);
                        res.end(err);
                        return;
                    });
                }
                else if (data == "stop-mc=Stop-mc")
                {
                    console.log("Stop MC");
                    
                    if(mcServer != null)
                    {
                        sockserver.clients.forEach(client => client.send("Server recieved stopped signal"))
                        mcServer.kill();
                        mcServer = null;
                    }
                    else
                    {
                        sockserver.clients.forEach(client => client.send("Server is not running"))
                    }


                    fs.readFile(__dirname + "/index.html")
                    .then(contents => {
                        res.setHeader("Content-Type", "text/html");
                        res.writeHead(200);
                        res.end(contents);
                    })
                    .catch(err => {
                        res.writeHead(500);
                        res.end(err);
                        return;
                    });
                }
                else
                {
                    fs.readFile(__dirname + "/index.html")
                    .then(contents => {
                        res.setHeader("Content-Type", "text/html");
                        res.writeHead(200);
                        res.end(contents);
                    })
                    .catch(err => {
                        res.writeHead(500);
                        res.end(err);
                        return;
                    });
                }


            });
        }
    }
    else {
        console.log(req.url)

        res.writeHead(500);
        res.end(err);
        return;
    }

};



const server = http.createServer(requestListener);
server.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://${host}:${port}`);
});

