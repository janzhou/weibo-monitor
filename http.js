var http    = require('http');
var util = require('util');
var url     = require('url');
var fs      = require('fs');
var path    = require('path');

function redirect(response, url) {
                response.statusCode = 302;
                response.setHeader("Location", url);
                response.end();
}

function createServer(config, login_url) {
    http_server = http.createServer(function (request, response) {
        var request_url = url.parse(request.url, true);
        console.log(request_url.pathname);
        switch(request_url.pathname){
            case '/auth':
                authorization_code = url.parse(request.url, true).query.code;
                http_server.emit('auth', authorization_code);
                redirect(response, config.redirect_url);
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
