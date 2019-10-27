const Map = require("immutable").Map;
const a = require('./actions.js');

// база данных по-умолчанию:
const initState = {
    //syncId: 0, // идентификатор БД, для её синхронизации между сервером и клиентом
    tempProfile: [], // термопрофиль программы нагревания
    realPoints: [], // некоторое количество последних измерений температуры
    lastRealTimeMeasure: 0,
    ovenState: 0, // состояние печки(включена/выключена)
    programState: 'STOPPED', // состояние программы нагревания STOPPED / LAUNCHED
    startTime: 0 // время начала программы нагревания
};

var reducer = function(state = Map(initState), action) {
    switch (action.type) {
        case a.SERVER_SYNC_ALL:
            //return Map(action.data);
            return state.merge(action.data);

        case a.PB_TempMeasure: {
            let newMeasure = action.data;
            if (newMeasure.mills != null) {
                newMeasure.time = newMeasure.time + newMeasure.mills / 1000;
                delete newMeasure['mills'];
            }
            let result = state;
            if (newMeasure.time > state.lastRealTimeMeasure) {
                result = state.update('lastRealTimeMeasure', newMeasure.time);
            }
            result.update('realPoints', (arr) => {
                arr.push(newMeasure);
                if (arr.length > 600) {
                    arr.shift(); // если размер массива стал слишком большой - удаляем самые старые данные
                }
                return arr;
            });
            return result;
        }
        case a.PB_Response: {
            let response = action.data;
            let result = state.update('programState', response.state);
            switch (response.cmdType) {
                case 'START':
                    result = result.update('startTime', response.time + ((response.mills == null) ? 0 : response.mills / 1000));
                    break;
                case 'STOP':
                    break;
                case 'HARD_RESET':
                case 'CLIENT_REQUIRES_RESET':
                    result = result.update('lastRealTimeMeasure', 0);
                    result = result.update('tempProfile', []);
                    result = result.update('realPoints', []);
                    break;
                default:
                    break;
            }
            return result;
        }
        case a.PB_ResponseGetTempProfile: {
            let result = state.update('tempProfile', action.data.profile.data);
            result = result.update('tempProfile', (arr) => {
                for (let measure in arr) {
                    if (measure.mills != null) {
                        measure.time += measure.mills;
                        delete measure['mills'];
                    }
                }
                return arr;
            });
            return result;
        }
    }
    return state;
};

module.exports = reducer;