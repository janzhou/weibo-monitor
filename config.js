var fs  = require('fs');

function config (file, events) {
    var config = require(file);

    this.set = function (conf, data) {
        eval('config.' + conf +' = data');
        fs.writeFile(file, JSON.stringify(config), function(err){
            if (err) throw err;
        });
    }

    this.get = function (conf) {
        return eval('config.' + conf);
    }

}

exports.loadConfig = function (file, events) {
    conf = new config(file, events);
    return conf;
}

