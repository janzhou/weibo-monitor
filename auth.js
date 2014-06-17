// Author: Jian Zhou
// Home  : http://janzhou.org

var url     = require('url');
var request = require('request');
var events = require('events');
var util = require('util');

auth = function (app) {
    events.EventEmitter.call(this);
    access_token_url   = "https://api.weibo.com/oauth2/access_token";
    authorize_url      = "https://api.weibo.com/oauth2/authorize";

    this.authorize_url = authorize_url + "?client_id=" + app.key + "&redirect_uri=" + app.callback_url;

    var auth = this;

    //获取accesstoken的时候老是出现“miss client id or secret”错误。
    //原因：该方法说是只能通过post请求传递，但是参数又必须放到url里面，是get/post混搭使用的，实际上post的内容为空，参数都是拼在url中。
    function authorization_token (authorization_code) {
        request.post(access_token_url+
            '?client_id=' + app.key +
            '&client_secret=' + app.secret +
            '&grant_type=' + 'authorization_code' +
            '&code=' + authorization_code +
            '&redirect_uri=' + app.callback_url,
            {}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                eval('var token = ' + body);
                auth.emit('config', 'auth', token);
            } else {
                console.log(response);
            }
        });
    };

    this.callback = function (request, response) {
        authorization_code = url.parse(request.url, true).query.code;
        authorization_token(authorization_code);
        response.write(authorization_code);
        response.end();
        request.connection.destroy();
    };

};

util.inherits(auth, events.EventEmitter);

exports.createAuth = function (app) {
    return new auth(app);
};
