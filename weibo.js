var config          = require('./config.json');

var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(config.mongodb, function(err, db) {
    if(err) throw err;

    var api = require('./api.js').createApi(config.app);
    api.loadDict(config.dict_dir);
    api.on('user', function(user){
        db.collection('user').findAndModify({'uid':user.uid}, [['uid', 1]], {$set:user}, {new:true}, function(err, us) {
            if(err) throw err;
            if( !us ) {
                db.collection('user').insert(user, function (err){
                    if(err) throw err;
                });
            }
        });
    });

    var http = require('./http.js').createServer(api, config.http, db);
    http.on('auth', api.auth);

    var crawler = require('./crawler.js').createCrawler(api, config.crawler, db);
    crawler.start();
});
