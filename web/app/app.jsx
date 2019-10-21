import ReactDOM from 'react-dom';
import MainPage from 'pages/main/PageMain.jsx';
import 'styles/main.scss';
import {globalStore, sync} from '../reflow_oven_store.js';

if (module.hot) {
    module.hot.accept();
}

function call(method) {
    if (globalVar.hasOwnProperty(method)) {
        globalVar[method]();
    }
}

// при первом подключении или обновлении страницы -
// запрашиваем у сервера синхронизацию всех данных
socket.emit('client sync all');

// сервер отправил всю свою БД
socket.on('server sync all', function(newStore) {
    globalStore.data = newStore;
    call('updateRealTimeView');
    call('updateTempLabel');
});
// сервер требует обновить БД
socket.on('server sync update', function(updateItem) {
    let success = sync(updateItem);
    if (success) {
        call('updateRealTimeView');
        call('updateTempLabel');
    }
    else {
        console.log('Error sync store!')
        //socket.emit('client sync all');
    }
});

ReactDOM.render(
    <MainPage/>,
    document.getElementById('app')
);
