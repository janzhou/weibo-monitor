var http    = require('http');
var util = require('util');
var url     = require('url');
var fs      = require('fs');
var path    = require('path');

function createServer(config, login_url) {

    http_server = http.createServer(function (request, response) {
        var request_url = url.parse(request.url, true);
        console.log(request_url.pathname);
        switch(request_url.pathname){
            case '/auth':
                authorization_code = url.parse(request.url, true).query.code;
                http_server.emit('auth', authorization_code);
                response.statusCode = 302;
                response.setHeader("Location", "/");
                response.end();
                break;
            default :
                var content_type;
                var file;
                switch(path.extname(request_url.pathname)) {
                    case '.js':
                        content_type = 'text/javascript';
                        file = request_url.pathname;
                        break;
                    case '.css':
                        content_type = 'text/css';
                        file = request_url.pathname;
                        break;
                    case '.html':
                        content_type = 'text/html';
                        file = request_url.pathname;
                        break;
                    case '':
                        content_type = 'text/html';
                        file = request_url.pathname + '/index.html';
                        break;
                }
                fs.readFile('./public'+file, function (err, data) {
                    if (err) {
                        response.writeHead(404, {'content-type': content_type});
                        response.end('404');
                    } else {
                        if(request_url.pathname == '/') {
                            data = String(data).replace(/#login/g, login_url);
                        }
                        response.writeHead(200, {'Content-Type': content_type});
                        response.end(data);
                    }
                });
                break;
        };
    });

    http_server.listen(config.port);

    return http_server
}

exports.createServer = createServer;
