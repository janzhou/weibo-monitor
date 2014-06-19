var http    = require('http');
var util = require('util');
var url     = require('url');
var fs      = require('fs');
var uuid = require('node-uuid');

function redirect(response, url) {
                response.statusCode = 302;
                response.setHeader("Location", url);
                response.end();
}

function createServer(config, login_url) {
    http_server = http.createServer(function (request, response) {
        var request_url = url.parse(request.url, true);
        switch(request_url.pathname){
            case '/auth':
                authorization_code = url.parse(request.url, true).query.code;
                var id = url.parse(request.url, true).query.state;
                http_server.emit('auth', authorization_code, id);
                redirect(response, config.redirect_url);
                break;
            case '/login':
                var id = uuid.v4();
                if(url.parse(request.url, true).query.callback) {
                    response.setHeader("Content-Type", 'text/javascript');
                    var data = url.parse(request.url, true).query.callback + "(" + JSON.stringify({"login_url":login_url, "state": id}) + ");";
                } else {
                    response.setHeader("Content-Type", 'text/plain');
                    var data = login_url + "&state=" + id;
                };
                response.end(data);
                break;
            default :
                redirect(response, config.redirect_url);
                break;
        };
    });

    http_server.listen(config.port);

    return http_server
}

exports.createServer = createServer;
