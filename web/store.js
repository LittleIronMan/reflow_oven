const createStore = require('redux').createStore;
const r = require('./reducer.js');

const reduxStore = createStore(r.reducer);

module.exports = reduxStore;