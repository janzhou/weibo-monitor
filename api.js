var request     = require('request');
var urlencode   = require('urlencode');
var segment     = require("nodejieba");
var url         = require('url');
var events      = require('events');
var util        = require('util');

var baseurl     = 'https://api.weibo.com/2/';

var api         = function (app) {
    var self = this;
    events.EventEmitter.call(this);
    access_token_url   = "https://api.weibo.com/oauth2/access_token";
    authorize_url      = "https://api.weibo.com/oauth2/authorize";

    this.authorize_url = authorize_url + "?client_id=" + app.key + "&redirect_uri=" + app.callback_url;

    //获取accesstoken的时候老是出现“miss client id or secret”错误。
    //原因：该方法说是只能通过post请求传递，但是参数又必须放到url里面，是get/post混搭使用的，实际上post的内容为空，参数都是拼在url中。
    this.auth = function (authorization_code, uuid) {
        request.post(access_token_url+
            '?client_id=' + app.key +
            '&client_secret=' + app.secret +
            '&grant_type=' + 'authorization_code' +
            '&code=' + authorization_code +
            '&redirect_uri=' + app.callback_url,
            {}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var auth = JSON.parse(body);
                var request_url  = baseurl + 'users/show.json' + url.format({'query':{'access_token':auth.access_token,'uid':auth.uid}});
                request.get(request_url, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            var user = JSON.parse(body);
                            user.auth = auth;
                            user.uuid = uuid;
                            self.emit('user', user);
                        } else {
                            console.log(response);
                            console.log('users/show.json error: ' + request_url);
                        }
                    });
            } else {
                console.log(response);
                console.log('auth code error');
            }
        });
    };

    this.status = function (status, access_token, param, callback) {
        param.access_token = access_token;
        request(baseurl + 'statuses/' + status + '.json' + url.format({'query':param}),
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        callback(null, JSON.parse(body));
                    } else {
                        callback(body);
                    }
                });
    }

    this.update = function (content, access_token) {
        var options = {
            'url': baseurl + 'statuses/update.json?access_token=' + access_token + '&status=' + urlencode(content),
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

    this.loadDict = function (dict_dir) {
        segment.loadDict(dict_dir + "jieba.dict.utf8", dict_dir + "hmm_model.utf8");
    }
};

util.inherits(api, events.EventEmitter);

exports.createApi = function (app) {
    return new api(app);
};
