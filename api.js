var request = require('request');
var urlencode = require('urlencode');
var segment = require("nodejieba");
var url     = require('url');

var baseurl = 'https://api.weibo.com/2/';

exports.status = function (status, auth, param, callback) {
    param.access_token = auth.access_token;
    request(baseurl + 'statuses/' + status + '.json' + url.format({'query':param}),
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    callback(false, JSON.parse(body));
                } else {
                    callback(true, body);
                }
            });
}

exports.update = function (content, auth) {
    var options = {
        'url': baseurl + 'statuses/update.json?access_token=' + auth.access_token + '&status=' + urlencode(content),
        method: 'POST',
        headers: {
            'Content-Length': urlencode(content).length,
            'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
    }
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(JSON.parse(body));
        } else {
            console.log(response);
        }
    });
}

exports.loadDict = function (dict_dir) {
    segment.loadDict(dict_dir + "jieba.dict.utf8", dict_dir + "hmm_model.utf8");
}
