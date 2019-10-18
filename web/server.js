'use strict';
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config');
const pb = require('./reflow_oven.pb.js');
const protobuf = require('protobufjs/minimal');
const base64 = protobuf.util.base64;
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
    uartListener = child_process.spawn('../raspberry/uart-Rx.exe');
}
else if (process.platform === 'win32') {
    uartListener = child_process.spawn('../raspberry_uart-Rx_simulator/Release/uart-Rx_simulator.exe');
    //uartListener = child_process.spawn('python', ['-u', '../rpi-uart/uart-listener-win32-emulate.py']);
}

var binaryData = new Uint8Array(150);

uartListener.stdout.on('data', function (data) {
    let str = data.toString();
    let type = parseInt(str.substring(0, 2));
    console.log("Received msg with type ", type);
    if (type === pb.PB_MsgType.UNDEFINED) {
        return;
    }
    let b64data = str.substring(2);
    let pbLength = base64.decode(b64data, binaryData, 0);
    if (type === pb.PB_MsgType.TEMP_MEASURE) {
        let tempMeasure;
        try {// tempMeasure = pb.PB_TempMeasure.decode(pbEncodedData).toObject();
            tempMeasure = pb.PB_TempMeasure.decode(binaryData, pbLength);
            console.log("emit obj " + tempMeasure);
            io.emit('temp measure', tempMeasure);
        }
        catch (e) {
            if (e instanceof protobuf.util.ProtocolError) { }
            else { }
        }
    }

    /*
    let str = data.toString();
    if (str.startsWith('temp measure')) {
        let words = str.match(/\S+/g) || [];
        let data = {time: parseFloat(words[2]), temp: parseFloat(words[3])};
        io.emit('temp measure', data);
    }
    else if(str.startsWith('ping')) {
        // let obj = JSON.parse(str);
        // console.log("Ping success: ", obj);
        console.log("Ping success! I wan'a repeat it :))");
        setTimeout(sendPing, 500); // повторная отправка
    }
    else {
        console.log("Unhandled uart message: ", str);
    }
    */
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
        let cmd = pb.PB_Command.create({type: pb.PB_CmdType.GET_STATE, id: 314, priority: 1});
	    let payload = pb.PB_Command.encode(cmd).finish();
        payload = base64.encode(payload, 0, payload.length);
        console.log('base64 payload: ' + payload);

        pingProcess = child_process.exec('../raspberry_uart-Tx_simulator/Release/uart-Tx_simulator.exe -s ' + payload + ' -t ' + pb.PB_MsgType.CMD + ' -b');
        pingProcess.on('exit', function (code) {
            console.log('pingProcess exited with exit code ' + code);
            pingProcess = undefined;
        });
    }
    else {
        console.log("pingProcess busy");
    }
}

setTimeout(sendPing, 3000);
