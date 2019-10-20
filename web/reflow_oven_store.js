const pb = require('./reflow_oven.pb.js');

// массив, связывает прототип сообщения с соответствующим числовым типом
const msgPrototypeBinder = {
    PB_Response : pb.PB_MsgType.RESPONSE,
    PB_TempMeasure : pb.PB_MsgType.TEMP_MEASURE
};

function getMsgPrototype(num) {
    let type = null;
    for (let key in msgPrototypeBinder) {
        if (msgPrototypeBinder[key] === num) { type = key; break; }
    }
    return type;
}

// база данных по-умолчанию:
let globalStore = {
    data: {
        syncId: 0, // идентификатор БД, для её синхронизации между сервером и клиентом
        tempProfile: [], // термопрофиль программы нагревания
        realPoints: [], // некоторое количество последних измерений температуры
        lastRealTimeMeasure: 0,
        ovenState: 0
    }
};

// функция обновления БД
function sync(updateItem) {
    if (updateItem.syncId !== globalStore.data.syncId + 1) {
        return false;
    }
    switch (updateItem.type) {
        case 'PB_TempMeasure':
            let arr = globalStore.data.realPoints;
            let newMeasure = updateItem.data;
            arr.push(newMeasure);
            if (arr.length > 600) {
                arr.shift(); // если массива стала слишком большой - удаляем самые старые данные
            }
            if (newMeasure.time > globalStore.data.lastRealTimeMeasure) {
                globalStore.data.lastRealTimeMeasure = newMeasure.time;
            }
            break;
        case 'State':
            globalStore.data.ovenState = updateItem.data;
            break;
        default:
            return false;
    }
    return true;
}

module.exports = {globalStore, sync, getMsgPrototype};

// if (type === pb.PB_MsgType.RESPONSE) {
//     let response = PB_decode('PB_Response', binaryData, pbLength); if (response == null) { return; }
//     if (response.cmdType === pb.PB_CmdType.START) {
//         io.emit('start', {time: (response.time * 1000 + response.mills)});
//     }
//     else if (response.cmdType === pb.PB_CmdType.STOP) {
//         io.emit('stop', {time: (response.time * 1000 + response.mills)});
//     }
//     else if (response.cmdType === pb.PB_CmdType.GET_STATE) {
//
//     }
// }
// else if (type === pb.PB_MsgType.TEMP_MEASURE) {
//     let tempMeasure = PB_decode('PB_TempMeasure', binaryData, pbLength); if (tempMeasure == null) { return; }
//     let obj = { temp: tempMeasure.temp, time: tempMeasure.time / 1000 }; // контроллер передает время в миллисекундах, а клиенту нужны данные в секундах
//     io.emit('temp measure', obj);
// }
