var fs  = require('fs');

function config (file) {
    var config = require(file);

    function getDateTime() {
        var date = new Date();

        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;

        var min  = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;

        var sec  = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;

        var year = date.getFullYear();

        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;

        var day  = date.getDate();
        day = (day < 10 ? "0" : "") + day;

        return year + month + day + hour + min + sec;
    }

    function save () {
        fs.rename(file, file + '_' + getDateTime(), function(err){
            if (err) throw err;
            fs.writeFile(file, JSON.stringify(config, null, "\t"), function(err){
                if (err) throw err;
            });
        });
    }

    this.set = function (conf, data) {
        eval('config.' + conf +' = data');
        save();
    }

    this.get = function (conf) {
        return eval('config.' + conf);
    }

    this.del = function (conf) {
        eval('delete config.' + conf);
        save();
    }
}

exports.loadConfig = function (file) {
    conf = new config(file);
    return conf;
}

