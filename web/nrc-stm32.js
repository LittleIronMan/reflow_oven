const child_process = require('child_process');
const pb = require('./reflow_oven.pb.js');
const protobuf = require('protobufjs/minimal');
const base64 = protobuf.util.base64;
const ovenDataStore = require('./reflow_oven_store.js');

const isLinux = process.platform === 'linux';
const ProgramReceiver = isLinux ?  '../raspberry/uart-Rx.exe' :
    '../raspberry_uart-Rx_simulator/Release/uart-Rx_simulator.exe';
const ProgramTransmitter = isLinux ?   '../raspberry/uart-Tx.exe' :
    'C:/reflow_oven/raspberry_uart-Tx_simulator/Release/uart-Tx_simulator.exe';

var io;

function PB_decode(pbMsgStruct, binaryData, binLength) {
    try {
        let obj = pb[pbMsgStruct].decode(binaryData, binLength);
        return pb[pbMsgStruct].toObject(obj, { enums: String, defaults: true/*enums as string names*/});
    }
    catch (e) {
        if (e instanceof protobuf.util.ProtocolError) { }
        else { }
    }
    return null;
}

// массив, связывает прототип сообщения с соответствующим числовым типом
const msgPrototypeBinder = {
    PB_Response : pb.PB_MsgType.RESPONSE,
    PB_TempMeasure : pb.PB_MsgType.TEMP_MEASURE,
    PB_ResponseGetTempProfile : pb.PB_MsgType.RESPONSE_GET_TEMP_PROFILE
};

function getMsgPrototype(num) {
    let type = null;
    for (let key in msgPrototypeBinder) {
        if (msgPrototypeBinder[key] === num) { type = key; break; }
    }
    return type;
}

// функция приема сообщений от микроконтроллера
var binaryDataBuf = new Uint8Array(150);
function receiveMsgFromStm32 (data) {
    let str = data.toString();
    let msgType = parseInt(str.substring(0, 2));
    //console.log("Received msg with type ", type);
    if (msgType === pb.PB_MsgType.UNDEFINED) {
        console.log('Error: message type number == 0(Undefined)');
        return;
    }
    // декодируем base64 строку в массив байт
    let b64data = str.substring(2);
    let pbLength = base64.decode(b64data, binaryDataBuf, 0);

    let msgProto = getMsgPrototype(msgType);
    if (msgProto == null) {
        console.log('Error: Cannot find prototype for msgType ', msgType); return;
    }

    // декодируем сообщение
    let dataObj = PB_decode(msgProto, binaryDataBuf, pbLength);
    if (dataObj == null) {
        console.log('Error: Cannot decode message with prototype ', msgProto); return;
    }

    // применяем обновление для глобальной структуры данных
    let updateItem = {
        syncId: ovenDataStore.globalStore.data.syncId + 1,
        type: msgProto,
        data: dataObj
    };
    let result = ovenDataStore.sync(updateItem);
    if (!result) {
        console.log('Error: cannot sync data from message with prototype ', msgProto);
        return;
    }
    else {
        // при успешном обновлении данных - принуждаем всех подключенных клиентов тоже обновиться
        //console.log('Successful update server store');
        io.sockets.emit('server sync update', updateItem);

        // если было получено хоть какое-то сообщение от мк(например холостой замер температуры)
        // и при этом сервер не знает термопрофиля мк, то отправляем запрос на получение термопрофиля
        if (ovenDataStore.globalStore.data.tempProfile.length === 0) {
            sendMsgToMCU(pb.PB_MsgType.CMD, {cmdType: pb.PB_CmdType.GET_TEMP_PROFILE}, 2);
        }
    }
}

// функция отправки сообщений микроконтроллеру
var globalCmdId = 0;
function sendMsgToMCU (msgType, data, priority) {
    let payload = null;
    switch(msgType) {
        case pb.PB_MsgType.CMD:
            let cmd = pb.PB_Command.create({
                cmdType: data.cmdType,
                priority: priority,
                id: globalCmdId
            });
            globalCmdId++;
            // кодируем javascript-объект в массив байт
            payload = pb.PB_Command.encode(cmd).finish();
            break;
        case pb.PB_MsgType.RESPONSE:
            // todo
            break;
        default: break;
    }

    if (payload == null) {
        console.log('Error: cannot encode message with type ', msgType);
        return;
    }

    // кодируем массив байт в base64-строку
    let b64payload = base64.encode(payload, 0, payload.length);
    // отправка base64-строки низкоуровневой программе,
    // которая непосредственно шлет данные по UART
    const uartTx = child_process.exec(ProgramTransmitter + ' -s ' + b64payload + ' -t ' + msgType + ' -b');
    // uartTx.stderr.on('data', function (data) {
    //     console.log('Transmitter stderr: ' + data);
    // });
    uartTx.on('exit', function (code) {
        if (code !== 0) {
            console.log("Error: stm32 Transmitter exit with code ", code);
        }
    });
}

// функция приема сообщений от микроконтроллера
function startReceiveMsgFromMCU(socket_io) {
    io = socket_io;
    const uartRx = child_process.spawn(ProgramReceiver);
    //uartListener = child_process.spawn('python', ['-u', '../rpi-uart/uart-listener-win32-emulate.py']);
    uartRx.stdout.on('data', receiveMsgFromStm32);
    uartRx.stderr.on('data', function (data) {
        console.log('stm32 Receiver stderr: ' + data);
    });
    uartRx.on('close', function (code) {
        console.log('stm32 Receiver exited with code ' + code);
    });
}

function sendCmdFromClientToMCU(data) {
    const cmdType = pb.PB_CmdType[data.cmdTypeStr];
    let priority = 1;
    switch(cmdType) {
        case pb.PB_CmdType.START: priority = 5; break;
        case pb.PB_CmdType.STOP: priority = 10; break;
        default: break; // priority = 1;
    }
    sendMsgToMCU(pb.PB_MsgType.CMD, {cmdType}, priority);
}

module.exports = {sendCmdFromClientToMCU, startReceiveMsgFromMCU};
