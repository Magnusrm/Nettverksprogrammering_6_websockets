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



let websocket = new WebSocket.Server({port: 3001});

websocket.on('connction',(connection) => {
  console.log('A connection is now open');

  connection.on('message', (message) => {

    console.log('Client has sent a message: ' + message);
    websocket.clients.map(e => {
      if(e.readyState === WebSocket.OPEN){
        e.send(JSON.stringify('Yo! whazzuuup client. You sent this message ' + message));
      }
    });
  });

  connection.on('close',() => {
    console.log('Closed the connection');
  });

  connection.on('error', (error) => {
    console.log('got error: ' + error.message);
  })

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
