var config          = require('./config.js').loadConfig('./config.json');
var http            = require('./http.js').createServer(config.get('http'));
var auth            = require('./auth.js').createAuth(config.get('app'));
var api             = require('./api.js')

api.loadDict(config);
http.on('callback', auth.callback);
auth.on('config', config.set);
console.log(auth.authorize_url);
