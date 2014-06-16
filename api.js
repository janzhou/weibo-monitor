var request = require('request');
var urlencode = require('urlencode');
var segment = require("nodejieba");

var baseurl = 'https://api.weibo.com/2/';

exports.status = function (status, config) {
    request(baseurl + 'statuses/' + status + '.json?access_token=' + config.get('access_token.access_token'),
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    body = JSON.parse(body);
                    body.statuses.forEach(function ( weibo, index ) {
                        console.log(weibo.text);
                        console.log(segment.cut(weibo.text));
                    });
                } else {
                    console.log(response);
                }
            });
}

exports.update = function (content, config) {
    var options = {
        'url': baseurl + 'statuses/update.json?access_token=' + config.get('access_token.access_token') + '&status=' + urlencode(content),
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

exports.loadDict = function (config) {
    segment.loadDict(config.get('dict_dir') + "jieba.dict.utf8", config.get('dict_dir') + "hmm_model.utf8");
}
