// @flow

import express from 'express';
import path from 'path';
import reload from 'reload';
import fs from 'fs';
import { Students } from './models.js';

type Request = express$Request;
type Response = express$Response;

const public_path = path.join(__dirname, '/../../client/public');

let app = express();

app.use(express.static(public_path));
app.use(express.json()); // For parsing application/json

app.get('/students', (req: Request, res: Response) => {
  return Students.findAll().then(students => res.send(students));
});

app.get('/students/:id', (req: Request, res: Response) => {
  return Students.findOne({ where: { id: Number(req.params.id) } }).then(
    student => (student ? res.send(student) : res.sendStatus(404))
  );
});

app.put('/students', (req: Request, res: Response) => {
  if (
    !req.body ||
    typeof req.body.id != 'number' ||
    typeof req.body.firstName != 'string' ||
    typeof req.body.lastName != 'string' ||
    typeof req.body.email != 'string'
  )
    return res.sendStatus(400);

  return Students.update(
    { firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email },
    { where: { id: req.body.id } }
  ).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});
 




//See https://github.com/websockets/ws
var WebSocket = require('ws');

var http_server = express();

//This resource makes it possible to download and start the WebSocket client
http_server.use(express.static(__dirname + "/../client"));

var ws_server = new WebSocket.Server({ port: 3001 });

function getName(sentence) {
    var n = sentence.split(" ");
    return n[n.length - 1];

}

ws_server.on('connection', (connection) => {
    console.log('Opened a connection');

    connection.on('message', (message) => {
        console.log("message received from a client: " + message);


        ws_server.clients.forEach((client) => {
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

//Start the web server serving the WebSocket client
//Open http://localhost:3000 in a web browser
var server=http_server.listen(3002, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
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
