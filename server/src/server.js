// @flow


import express from 'express';
import path from 'path';
import reload from 'reload';
import fs from 'fs';


type Request = express$Request;
type Response = express$Response;
let WebSocket = require('ws');

const public_path = path.join(__dirname, '/../../client/public'); //to download client

let app = express();

app.use(express.static(public_path));
app.use(express.json()); // For parsing application/json
var http_server = express();

//This resource makes it possible to download and start the WebSocket client
http_server.use(express.static(__dirname + "/../client"));


let websocket = new WebSocket.Server({port: 3001});

function getName(sentence) {
    var n = sentence.split(" ");
    return n[n.length - 1];

}

websocket.on('connection', (connection) => {
    console.log('Opened a connection');

    connection.on('message', (message) => {
        console.log("Yoooo, wazzap: " + message);


        websocket.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('hello ' + getName(message));
            }
        });
    });

    connection.on('close', () => {
        console.log("Closed a connection");
    });

    connection.on('error', (error) => {
        console.error("Error: " + error.message);
    });
});


// Hot reload application when not in production environment
if (process.env.NODE_ENV !== 'production') {
    let reloadServer = reload(app);
    fs.watch(public_path, () => reloadServer.reload());
}

// The listen promise can be used to wait for the web server to start (for instance in your tests)
export let listen = new Promise<void>((resolve, reject) => {
    app.listen(3000, error => {
        if (error) reject(error.message);
        console.log('Server started');
        resolve();
    });
});
