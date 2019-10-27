import ReactDOM from 'react-dom';
import MainPage from 'pages/main/PageMain.jsx';
import 'styles/main.scss';

import {createStore} from 'redux';
import reducer from '../reducer.js';
import {Provider} from 'react-redux';
import * as a from '../actions.js';

var reduxStore = createStore(reducer);

if (module.hot) {
    module.hot.accept();
}

// при первом подключении или обновлении страницы -
// запрашиваем у сервера синхронизацию всех данных
socket.emit('client sync all');

// сервер отправил всю свою БД
socket.on('server sync all', function(newStore) {
    console.log('server sync all ', newStore);
    reduxStore.dispatch({type: a.SERVER_SYNC_ALL, data: newStore});
});
// сервер требует обновить БД
socket.on('server sync update', function(action) {
    reduxStore.dispatch(action);
});

ReactDOM.render(
    <Provider store={reduxStore}>
        <MainPage/>
    </Provider>,
    document.getElementById('app')
);
