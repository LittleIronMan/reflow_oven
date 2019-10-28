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
    startTime: 0, // время начала программы нагревания
    controlMode: 'DEFAULT_OFF' // режим управления печкой: выключен / следовать термопрофилю / ручной контроль / удерживать заданную температуру
};

function reducer (state = Map(initState), action) {
    switch (action.type) {
        case a.SET_STATE:
            //return Map(action.data);
            return state.merge(action.data);

        case a.PB_TempMeasure: {
            let newMeasure = action.data;
            if (newMeasure.mills != null) {
                newMeasure.time = newMeasure.time + newMeasure.mills / 1000;
                delete newMeasure['mills'];
            }
            let result = state;
            if (newMeasure.time > state.get('lastRealTimeMeasure')) {
                result = state.set('lastRealTimeMeasure', newMeasure.time);
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
            let result = state.set('programState', response.state);
            switch (response.cmdType) {
                case 'START':
                    result = result.set('startTime', response.time + ((response.mills == null) ? 0 : response.mills / 1000));
                    break;
                case 'STOP':
                    break;
                case 'HARD_RESET':
                case 'CLIENT_REQUIRES_RESET':
                    result = result.set('lastRealTimeMeasure', 0);
                    result = result.set('tempProfile', []);
                    result = result.set('realPoints', []);
                    break;
                default:
                    break;
            }
            return result;
        }
        case a.PB_ResponseGetTempProfile: {
            let result = state.set('tempProfile', action.data.profile.data);
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

module.exports = {reducer, initState};