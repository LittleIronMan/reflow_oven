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

if (process.platform !== 'win32') { // это я так проверяю что сервер запущен на raspberry, а не на винде
    // теперь настраиваем общение с контроллером через uart
    const raspi = require('raspi');
    const Serial = require('raspi-serial').Serial;
    raspi.init(() => {
        var serial = new Serial();
        serial.open(() => {
            serial.on('data', (data) => {
                // process.stdout.write(data);
                console.log(data);
            });
            // serial.write('Hello from raspi-serial');
        });
    });
}
