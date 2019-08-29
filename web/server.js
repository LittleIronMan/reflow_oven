'use strict';

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io').listen(http);

app.use(express.static(__dirname));

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
});

// const PORT = process.env.PORT || 8080
const PORT = 3000;
http.listen(PORT, () => {
    console.log(__dirname);
    console.log(`App listening to ${PORT}....`);
    console.log('Press Ctrl+C to quit.');
});

// настраиваем uart-listener
// взято отсюда: https://stackoverflow.com/a/32172145
var net = require('net');
var PIPE_PATH = 'not/exists/path';
if (process.platform === 'linux') { PIPE_PATH = '/tmp/uart-server.fifo'; }
if (process.platform === 'win32') { PIPE_PATH = '\\\\.\\pipe\\win32_unused.fifo'; }

var server = net.createServer(function(stream) {
    console.log('connect to uart-server.fifo');
    stream.on('data', function(c) {
        console.log('data:', c.toString());
    });
    stream.on('end', function() {
        server.close();
    });
});

server.listen(PIPE_PATH);

