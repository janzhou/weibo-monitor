var EventEmitter = require('events').EventEmitter;
var events = new EventEmitter(); 

var auth    = require('./auth.js').init('208143261', '7cf1ba728ea5db374f4ec99bed04e719', '127.0.0.1', 8456, events);

events.emit('auth-start')
