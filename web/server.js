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

var client = net.connect(PIPE_PATH, function() {
    console.log('Start uart-server.fifo connection');
});

client.on('data', function(data) {
    console.log('Receive uart data:', data.toString());
    // client.end('Thanks!');
});

client.on('end', function() {
    console.log('End uart-server.fifo connection');
});

