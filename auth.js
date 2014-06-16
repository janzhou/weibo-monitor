// Author: Jian Zhou
// Home  : http://janzhou.org

var http    = require('http');
var url     = require('url');
var request = require('request');
var fs      = require('fs');

function Auth (config) {
    this.version            = 0.1
    this.app_key            = config.get('app_key');
    this.app_secret         = config.get('app_secret');
    this.http_host          = config.get('http_host');
    this.http_port          = config.get('http_port');

    if( this.http_port == '80' ) {
        this.call_back_url  = 'http://'+this.http_host+'/callback';
    } else {
        this.call_back_url  = 'http://'+this.http_host+':'+this.http_port+'/callback';
    };
    this.access_token_url   = "https://api.weibo.com/oauth2/access_token";
    this.authorize_url      = "https://api.weibo.com/oauth2/authorize";

    this.authorize = function () {
        console.log(this.authorize_url + 
                "?client_id=" + this.app_key +
                "&redirect_uri=" + this.call_back_url
                );
    };

    //获取accesstoken的时候老是出现“miss client id or secret”错误。
    //原因：该方法说是只能通过post请求传递，但是参数又必须放到url里面，是get/post混搭使用的，实际上post的内容为空，参数都是拼在url中。
    this.authorization_token = function (authorization_code) {
        var auth=this;
        request.post(this.access_token_url+
            '?client_id=' + this.app_key +
            '&client_secret=' + this.app_secret +
            '&grant_type=' + 'authorization_code' +
            '&code=' + authorization_code +
            '&redirect_uri=' + this.call_back_url,
            {}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                eval('var token = ' + body);
                config.set('access_token', token);
                auth.http_server.close();
            } else {
                console.log(response);
            }
        });
    };

    this.http_server = http.createServer(function (request, response) {
        authorization_code = url.parse(request.url, true).query.code;
        this.weibo.authorization_token(authorization_code);
        response.write(authorization_code);
        response.end();
        request.connection.destroy();
    });

    this.http_server.weibo = this;
    this.http_server.listen(this.http_port);
}

exports.init = function (config, events) {
    auth = new Auth (config);
    events.on('auth-start', function () {auth.authorize()});
    return auth;
}
