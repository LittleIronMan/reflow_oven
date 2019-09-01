'use strict';

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io').listen(http);
const child_process = require('child_process');

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
var uartListener = child_process.spawn('../rpi-uart-listener-cpp/uart-listener',
    [],
   // {cwd: "../rpi-uart-listener-cpp"} // дополнительная опция(если в дочернем процессе придется отрывать какие-нибудь файлы)
    );

uartListener.stdout.on('data', function (data) {
    let str = data.toString();
    if (str.startsWith("Temp")) {
        let temp = parseFloat(str.substring(5, str.indexOf('\n')));
        console.log("Emit Temp with value: ", temp);
        io.emit('Temp', temp);
    }
});

uartListener.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});

uartListener.on('close', function (code) {
    console.log('child process exited with code ' + code);
});
