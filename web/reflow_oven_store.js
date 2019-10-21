// база данных по-умолчанию:
let globalStore = {
    data: {
        syncId: 0, // идентификатор БД, для её синхронизации между сервером и клиентом
        tempProfile: [], // термопрофиль программы нагревания
        realPoints: [], // некоторое количество последних измерений температуры
        lastRealTimeMeasure: 0,
        ovenState: 0, // состояние печки(включена/выключена)
        programState: 'STOPPED', // состояние программы нагревания STOPPED / LAUNCHED
        startTime: 0 // время начала программы нагревания
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
            if (newMeasure.mills != null) {
                newMeasure.time = newMeasure.time + newMeasure.mills / 1000;
                delete newMeasure['mills'];
            }
            if (newMeasure.time > globalStore.data.lastRealTimeMeasure) {
                globalStore.data.lastRealTimeMeasure = newMeasure.time;
            }
            arr.push(newMeasure);
            if (arr.length > 600) {
                arr.shift(); // если массива стала слишком большой - удаляем самые старые данные
            }
            break;
        case 'PB_Response':
            let response = updateItem.data;
            switch (response.cmdType) {
                case 'START':
                    globalStore.data.programsState = response.state;
                    globalStore.data.startTime = response.time + ((response.mills == null) ? 0 : response.mills / 1000);
                    break;
                case 'STOP':
                    globalStore.data.programsState = response.state;
                    break;
                default:
                    break;
            }
            break;
        case 'PB_ResponseGetTempProfile':
            globalStore.data.tempProfile = updateItem.data.profile.data;
            for (let item in globalStore.data.tempProfile) {
                if (item.mills != null) {
                    item.time += item.mills;
                    delete item['mills'];
                }
            }
            break;
        default:
            return false;
    }
    return true;
}

module.exports = {globalStore, sync};
