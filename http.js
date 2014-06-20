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

function createServer(api, config, db) {
    http_server = http.createServer(function (request, response) {
        var request_url = url.parse(request.url, true);
        //console.log(request_url.pathname);
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
                    var data = url.parse(request.url, true).query.callback + "(" + JSON.stringify({"authorize_url": api.authorize_url, "state": id}) + ");";
                } else {
                    response.setHeader("Content-Type", 'text/plain');
                    var data = api.authorize_url + "&state=" + id;
                };
                response.end(data);
                break;
            case '/email':
                var id = url.parse(request.url, true).query.uuid;
                var email = url.parse(request.url, true).query.email;
                var callback = url.parse(request.url, true).query.callback;
                if(id) {
                    if(email) { // set email
                        db.collection('user').findAndModify({'uuid':id}, [['uid', 1]], {$set:{'setting':{'email':email}}}, {new:true}, function(err, user) {
                            if(err) throw err;
                            redirect(response, config.redirect_url);
                            return;
                        });
                    } else { // get email
                        db.collection('user').findOne({'uuid': id}, {'limit': 1}, function (err, user){
                            if(err) throw err;
                            if(user) {
                                if( user.setting && 'email' in user.setting) {
                                    var email = user.setting.email;
                                } else {
                                    var email = 'place your email';
                                }
                                if(callback) {
                                    response.setHeader("Content-Type", 'text/javascript');
                                    response.end(callback + '({"email":"'+email+'"});');
                                } else {
                                    response.setHeader("Content-Type", 'text/plain');
                                    response.end(JSON.stringify({'email': email}));
                                };
                            } else {
                                response.end(callback + '({"error":true});');
                            }
                        });
                    }
                } else {
                    response.end(JSON.stringify({"error":true}));
                }
                break;
            case '/robots.txt':
                response.setHeader("Content-Type", 'text/plain');
                response.end('User-agent: *\nDisallow: /');
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
