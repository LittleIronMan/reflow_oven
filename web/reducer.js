const Map = require("immutable").Map;
const a = require('./actions.js');

// база данных по-умолчанию:
const initState = {
    //syncId: 0, // идентификатор БД, для её синхронизации между сервером и клиентом
    tempProfile: [], // термопрофиль программы нагревания
    realPoints: [], // некоторое количество последних измерений температуры
    lastRealTimeMeasure: 0, // время последнего измерения температуры
    fControlData: {
        leadControlMode: 'DEFAULT_OFF',
        ovenState: 'OFF',
        constTempValue: 26,
        data: [
            {
                controlMode: 'FOLLOW_TEMP_PROFILE',
                controlState: 'DISABLED',
                isPaused: false,
                startTime: 0,
                elapsedTime: 0,
                duration: 0
            },
            {
                controlMode: 'HOLD_CONST_TEMP',
                controlState: 'DISABLED',
                isPaused: false,
                startTime: 0,
                elapsedTime: 0,
                duration: 0
            }
        ]
    }
};

function reducer (state = Map(initState), action) {
    switch (action.type) {
        case a.SET_STATE:
            //return Map(action.data);
            return state.merge(action.data);

        case a.PB_TempMeasure: {
            let newMeasure = action.data;
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
        case a.PB_SwitchOvenState: {
            let fControlData = state.get('fControlData');
            let result = state.set('fControlData', {...fControlData, ovenState: action.data.ovenState});
            return result;
        }
        case a.PB_Response: {
            let response = action.data;
            let result = state;
            switch (response.cmdType) {
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
            return result;
        }
        case a.PB_FullControlData: {
            let result = state.set('fControlData', action.data);
            return result;
        }
    }
    return state;
};

module.exports = {reducer, initState};