var http    = require('http');
var util = require('util');

function createServer(config) {

    http_server = http.createServer(function (request, response) {
        http_server.emit('callback', request, response);
    });

    http_server.listen(config.port);

    return http_server
}

exports.createServer = createServer;
