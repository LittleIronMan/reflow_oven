'use strict';

const express = require('express');
const app = express();
const http = require('http').createServer(app);

app.use(express.static(__dirname));

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const io = require('socket.io').listen(http);
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
const child_process = require('child_process');
var uartListener;
if (process.platform === 'linux') {
    uartListener = child_process.spawn('../rpi-uart-listener-cpp/uart-listener');
}
else if (process.platform === 'win32') {
    uartListener = child_process.spawn('python', ['-u', '../rpi-uart-listener-cpp/uart-listener-win32-emulate.py']);
}

uartListener.stdout.on('data', function (data) {
    let str = data.toString();
    if (str.startsWith("Temp")) {
        let args = [5];
        let eolIdx = str.indexOf('\n'); if (eolIdx !== -1) { args.push(eolIdx); }
        let temp = parseFloat(str.substring(...args));
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
