var config          = require('./config.js').loadConfig('./config.json');
var http            = require('./http.js').createServer(config.get('http'));
var auth            = require('./auth.js').createAuth(config.get('app'));
var api             = require('./api.js');

var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(config.get('mongodb'), function(err, mongo) {
    if(err) throw err;
    db = mongo;
});

api.loadDict(config.get('dict_dir'));
http.on('callback', auth.callback);
auth.on('config', config.set);
console.log(auth.authorize_url);

api.status('home_timeline', config.get('auth'), function (err, wbs) {
    if(err) throw err;
    var collection = db.collection('status');

    wbs.statuses.forEach(function ( weibo, index ) {
        collection.insert(weibo, function (err, docs) {
            if(err) throw err;
        });
    });
});
