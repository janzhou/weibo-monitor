var EventEmitter = require('events').EventEmitter;
var events = new EventEmitter(); 

var config  = require('./config.js').loadConfig('./config.json', events);
var auth    = require('./auth.js').init(config, events);
var api     = require('./api.js')

events.emit('auth-start');
//api.status('home_timeline', config);
api.update('test', config);
