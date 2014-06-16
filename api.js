var request = require('request');

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
