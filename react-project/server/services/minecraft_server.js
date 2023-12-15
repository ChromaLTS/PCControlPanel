const { spawn } = require('child_process');
let mcServer;
const mcLocation = "C:\\Users\\micha\\Desktop\\Minecraft_Server";


function startServer(msgClients) {
    if (isServerRunning()) {
        return "Server is already running";
    }

    mcServer = spawn('powershell', ['java', String.raw`-jar .\paper-1.20.2-217.jar -nogui`], {cwd: mcLocation});

    mcServer.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);

        msgClients(data.toString('utf8'))
    });

    mcServer.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        
        msgClients(data.toString('utf8'))
    });

    mcServer.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
      
        msgClients(data.toString('utf8'))
    }); 
}

function forceStopServer(msgClients) {
    if (!isServerRunning()) {
        return;
    }
    
    msgClients("Trying to force the server to stop...")
    mcServer.kill();
    msgClients("The server has been force stopped")
}

function stopServer(msgClients) {
    if (!isServerRunning()) {
        return;
    }
   
    msgClients("Trying to stop the server gracefully...")
    mcServer.stdin.write('stop\n');
    msgClients("The server has been stopped gracefully")
}

function isServerRunning() {
    return mcServer !== undefined;
}

const Minecraft_Server = {startServer, stopServer, isServerRunning, forceStopServer}

export default Minecraft_Server;