var crawler = function (api, config, db) {
    var since_id = 0;
    var new_since_id = 0;
    var interval = 1000 * 3600 / config.crawler.limit;
    var count       = config.crawler.count;

    function timeline (param) {
        api.status('home_timeline', config.auth, param, function (err, wbs) {
            if(err) return timeline(param);

            var collection = db.collection('status');
            var cnt = 0;

            wbs.statuses.forEach(function ( weibo, index ) {
                if (weibo.id > since_id ) {
                    cnt++;
                    collection.insert(weibo, function (err, docs) {
                        if(err) throw err;
                    });
                }
            });

            console.log('-------------------------------' + cnt);
            if(since_id == 0) {
                since_id = wbs.since_id; //如果是第一次取，只取一次
                setTimeout(timeline, interval, {'since_id': wbs.since_id, 'count': count}); //本次读结束
                console.log('第一次取，只取一次');
            } else if (since_id < wbs.max_id) { //上次取完成的点为 since_id，
                setTimeout(timeline, interval, {'max_id': wbs.max_id, 'count': count});
                console.log('上次取完的点为' + since_id);
                console.log('这次取到的点为' + wbs.max_id);
            } else {
                since_id = new_since_id; //取到了上次结束的点
                setTimeout(timeline, interval, {'since_id': wbs.since_id, 'count': count}); //本次读结束
                console.log('全部取完');
            }

            if(wbs.since_id > new_since_id) new_since_id = wbs.since_id;
        });
    }

    this.start = function () {
        timeline({'count':count});
    }
};

exports.createCrawler = function(api, config, db) {
    return new crawler(api, config, db);
};
