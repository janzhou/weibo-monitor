var crawler = function (api, config, db) {
    function crawlhome_timeline (user, cursor) {
        if(!('auth'in user)){
            console.log(user);
            console.log('!auth in @' + user.screen_name);
            return;
        }
        var param = {'count': config.count};
        if('crawler' in user){
            if(user.crawler.max_id) {
                param.max_id = user.crawler.max_id;
            } else {
                param.since_id = user.crawler.since_id;
            }
        } else user.crawler = {};
        api.status('home_timeline', user.auth.access_token, param, function (err, weibos) {
            if(err) {
                console.log(err + ' @'+user.screen_name + ' ' + user.auth.access_token);
                return;
            }

            var collection = db.collection('status');
            var cnt = 0;

            weibos.statuses.forEach(function ( weibo, index ) {
                if (weibo.id > user.crawler.since_id ) {
                    cnt++;
                    collection.insert(weibo, function (err) {
                        if(err) throw err;
                    });
                }
            });

            console.log('-------------------------------' + cnt);

            if(!('since_id' in user.crawler)) {
                user.crawler.since_id   = weibos.since_id;
                console.log('initial since_id: ' + user.crawler.since_id + ' @' + user.screen_name);
            } else if(weibos.statuses.length == 0){
                if('next_since_id' in user.crawler) {
                    user.crawler.since_id = user.crawler.next_since_id;
                    delete user.crawler.next_since_id;
                    delete user.crawler.max_id;
                }
                console.log('since_id: ' + user.crawler.since_id + ' @' + user.screen_name);
            } else {
                if(!('next_since_id' in user.crawler)) {
                    user.crawler.next_since_id   = weibos.since_id;
                }
                user.crawler.max_id         = weibos.max_id;

                if (user.crawler.max_id < user.crawler.since_id) {
                    user.crawler.since_id = user.crawler.next_since_id;
                    delete user.crawler.next_since_id;
                    delete user.crawler.max_id;
                    console.log('since_id: ' + user.crawler.since_id + ' @' + user.screen_name);
                } else {
                    console.log('next_since_id: ' + user.crawler.next_since_id + ' @' + user.screen_name);
                    console.log('max_id: ' + user.crawler.max_id + ' @' + user.screen_name);
                }
            }
            db.collection('user').findAndModify({'uid':user.uid}, [['uid', 1]], {$set:{'crawler':user.crawler}}, {new:true}, function(err, user) {
                if(err) throw err;
                cursor.nextObject(function(err, user){
                    if(err) throw(err);
                    if(user) crawlhome_timeline(user, cursor);
                });
            });
        });
    }

    function crawlusers(){
        var cursor  = db.collection('user').find();
        cursor.nextObject(function(err, user){
            if(err) throw(err);
            if(user) crawlhome_timeline(user, cursor);
        });
    }

    this.start = function () {
        crawlusers();
        setInterval(crawlusers, 1000 * 60 * 60 / config.limit);
    }
};

exports.createCrawler = function(api, config, db) {
    return new crawler(api, config, db);
};
