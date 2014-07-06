var analysis = function (config, db, mail) {
    function do_analysis() {
        var status = db.collection('status').find().limit(5).toArray(function(err, wb){
            mail.send({'email':'i@janzhou.org', 'subject':'Weibo-monitor!', 'user':{'name':'janzhou'}, 'status':wb});
        });
    }

    this.start = function () {
        do_analysis();
        setInterval(do_analysis, 1000 * 60 * 60 * 24);
    }
};

exports.createAnalysis = function(config, db, mail){
    return new analysis(config, db, mail);
};
