'use strict';
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config');
let compiler = webpack(webpackConfig);

const redux = require('redux');
const r = require('./reducer.js');
const a = require('./actions.js');

const stm32 = require('./nrc-stm32.js');


var reduxStore = redux.createStore(r.reducer);

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

var io = require('socket.io').listen(http);
io.on('connection', function(socket){
    //console.log('a user connected');

    // клиент требует синхронизации всех данных с сервером
    socket.on('client sync all', function() {
        socket.emit('server sync all', reduxStore.getState());
    });
    // команда от клиента микроконтроллеру
    socket.on('client cmd', stm32.sendCmdFromClientToMCU);
});

const PORT = 3000;
// const PORT = process.env.PORT || 8080
http.listen(PORT, () => {
    console.log(__dirname);
    console.log(`App listening to ${PORT}....`);
    console.log('Press Ctrl+C to quit.');
});

// запускаем программу для приема сообщений от контроллера
stm32.startReceiveMsgFromMCU(io, reduxStore);



