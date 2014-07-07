var mail = function (config) {
    var nodemailer = require("nodemailer");
    var ejs = require('ejs')
        , fs = require('fs')
        , html = fs.readFileSync(__dirname + '/templates/'+config.theme+'/html.ejs', 'utf8')
        , text = fs.readFileSync(__dirname + '/templates/'+config.theme+'/text.ejs', 'utf8');

    this.send = function (message){
        // Prepare nodemailer transport object
        var transport = nodemailer.createTransport("SMTP", config);

        // Send a single email
        transport.sendMail({
            from: config.from,
            to: message.email,
            subject: message.subject,
            html: ejs.render(html, message),
            // generateTextFromHTML: true,
            text: ejs.render(text, message)
        }, function(err, responseStatus) {
            if (err) {
                console.log(err);
            } else {
                console.log(responseStatus.message);
            }
            transport.close(); // shut down the connection pool, no more messages
        });
    };
}

exports.createMail = function(config){
    return new mail(config);
};
