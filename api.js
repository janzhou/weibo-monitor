var request = require('request');
var urlencode = require('urlencode');

var baseurl = 'https://api.weibo.com/2/';

exports.status = function (status, config) {
    request(baseurl + 'statuses/' + status + '.json?access_token=' + config.get('access_token.access_token'),
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(JSON.parse(body));
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
