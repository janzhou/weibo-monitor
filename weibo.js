var EventEmitter    = require('events').EventEmitter;
var events          = new EventEmitter(); 
var config          = require('./config.js').loadConfig('./config.json', events);

var http            = require('./http.js').createServer(config.get('http'));
var auth            = require('./auth.js').createAuth(config.get('app'));

http.on('callback', auth.callback);
auth.on('config', config.set);

var api             = require('./api.js')

api.loadDict(config);
console.log(auth.authorize_url);
