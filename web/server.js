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
if (process.platform === 'linux') {
    const fs = require('fs');
    const net = require('net');
    fs.open('/tmp/uart-server.fifo', fs.constants.O_RDONLY | fs.constants.O_NONBLOCK, (err, fd) => {
        // Handle err
        const pipe = new net.Socket({fd});
        // Now `pipe` is a stream that can be used for reading from the FIFO.
        pipe.on('data', (data) => {
            console.log(data.toString());
            // process data ...
        });
    });
}

