'use strict';
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config');
let compiler = webpack(webpackConfig);

const express = require('express');
const app = express();
const http = require('http').createServer(app);

app.use(middleware(compiler, {
    //noInfo: true,
    logLevel: 'warn',
    publicPath: webpackConfig.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler, {
    path: '/__webpack_hmr',
}));
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
    uartListener = child_process.spawn('../rpi-uart/uart-listener');
}
else if (process.platform === 'win32') {
    uartListener = child_process.spawn('python', ['-u', '../rpi-uart/uart-listener-win32-emulate.py']);
}

uartListener.stdout.on('data', function (data) {
    let str = data.toString();
    if (str.startsWith('temp measure')) {
        let words = str.match(/\S+/g) || [];
        let data = {time: parseFloat(words[2]), temp: parseFloat(words[3])};
        io.emit('temp measure', data);
    }
    else if(str.startswith('ping')) {
        // let obj = JSON.parse(str);
        // console.log("Ping success: ", obj);
        console.log("Ping success! I wan'a repeat it :))");
        setTimeout(sendPing, 500); // повторная отправка
    }
    else {
        console.log("Unhandled uart message: ", str);
    }
});

uartListener.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});

uartListener.on('close', function (code) {
    console.log('child process exited with code ' + code);
});

var pingProcess;
function sendPing() {
    if (pingProcess === undefined) {
        pingProcess = child_process.exec('../rpi-uart/uart-speaker --send "ping"');
        pingProcess.on('exit', function (code) {
            console.log('pingProcess exited with exit code ' + code);
            pingProcess = undefined;
        });
    }
    else {
        console.log("pingProcess busy");
    }
}

sendPing();
