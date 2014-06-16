var EventEmitter = require('events').EventEmitter;
var events = new EventEmitter(); 

var config  = require('./config.js').loadConfig('./config.json', events);
var auth    = require('./auth.js').init(config, events);

events.emit('auth-start');
