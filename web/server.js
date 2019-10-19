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

var NRC_Receiver;
var NRC_Transmitter;
if (process.platform === 'linux') {
    NRC_Receiver = '../raspberry/uart-Rx.exe';
    NRC_Transmitter = '../raspberry/uart-Tx.exe';
}
else if (process.platform === 'win32') {
    NRC_Receiver = '../raspberry_uart-Rx_simulator/Release/uart-Rx_simulator.exe';
    NRC_Transmitter = 'C:/reflow_oven/raspberry_uart-Tx_simulator/Release/uart-Tx_simulator.exe';
}

// функция отправки команд микроконтроллеру
var globalCmdId = 0;
function sendCmdToStm32 (commandType, priority) {
    let cmd = pb.PB_Command.create({cmdType: commandType, priority: priority, id: globalCmdId});
    globalCmdId++;
    let payload = pb.PB_Command.encode(cmd).finish();
    payload = base64.encode(payload, 0, payload.length);
    // console.log('base64 payload: ' + payload);

    let uartTx = child_process.exec(NRC_Transmitter + ' -s ' + payload + ' -t ' + pb.PB_MsgType.CMD + ' -b');
    // uartTx.stderr.on('data', function (data) {
    //     console.log('Transmitter stderr: ' + data);
    // });
    uartTx.on('exit', function (code) {
        if (code !== 0) {
            console.log("Transmitter exit with code ", code);
        }
    });
}

const io = require('socket.io').listen(http);
io.on('connection', function(socket){
    console.log('a user connected');

    // клиент нажал на кнопку start
    socket.on ('start', function () {
        sendCmdToStm32(pb.PB_CmdType.START, 5);
    });

    // клиент нажал на кнопку stop
    socket.on ('finish', function () {
        sendCmdToStm32(pb.PB_CmdType.STOP, 10);
    });
});

// const PORT = process.env.PORT || 8080
const PORT = 3000;
http.listen(PORT, () => {
    console.log(__dirname);
    console.log(`App listening to ${PORT}....`);
    console.log('Press Ctrl+C to quit.');
});

// запукскаем Receiver
const child_process = require('child_process');
var uartRx = child_process.spawn(NRC_Receiver);
//uartListener = child_process.spawn('python', ['-u', '../rpi-uart/uart-listener-win32-emulate.py']);

var binaryData = new Uint8Array(150);

// функция приема сообщений от Receiver'а
uartRx.stdout.on('data', function (data) {
    let str = data.toString();
    let type = parseInt(str.substring(0, 2));
    //console.log("Received msg with type ", type);
    if (type === pb.PB_MsgType.UNDEFINED) {
        return;
    }
    let b64data = str.substring(2);
    let pbLength = base64.decode(b64data, binaryData, 0);
    if (type === pb.PB_MsgType.TEMP_MEASURE) {
        let tempMeasure;
        try {// tempMeasure = pb.PB_TempMeasure.decode(pbEncodedData).toObject();
            tempMeasure = pb.PB_TempMeasure.decode(binaryData, pbLength);
            let obj = { temp: tempMeasure.temp, time: tempMeasure.time / 1000 }; // контроллер передает время в миллисекундах, а клиенту нужны данные в секундах
            // console.log("emit obj " + tempMeasure);
            io.emit('temp measure', obj);
        }
        catch (e) {
            if (e instanceof protobuf.util.ProtocolError) { }
            else { }
        }
    }
});

uartRx.stderr.on('data', function (data) {
    console.log('Receiver stderr: ' + data);
});

uartRx.on('close', function (code) {
    console.log('Receiver exited with code ' + code);
});

