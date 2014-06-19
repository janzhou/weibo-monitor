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
        console.log(request_url.pathname);
        switch(request_url.pathname){
            case '/auth':
                authorization_code = url.parse(request.url, true).query.code;
                uuid = url.parse(request.url, true).query.state;
                http_server.emit('auth', authorization_code, uuid);
                redirect(response, config.redirect_url);
                break;
            case '/login':
                response.setHeader("Content-Type", 'application/json');
                response.end(JSON.stringify({"login_url":login_url, "state":uuid.v4()}));
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
