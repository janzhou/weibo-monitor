var nodemailer = require("nodemailer");
var emailTemplates = require('email-templates');

var mail = function (config) {

    this.send = function (message){

        emailTemplates('./templates', function(err, template) {

            if (err) {
                console.log(err);
                return;
            }

            // ## Send a single email

            // Prepare nodemailer transport object
            var transport = nodemailer.createTransport("SMTP", config);

            // Send a single email
            template('weibo', message, function(err, html, text) {
                if (err) {
                    console.log(err);
                    return;
                }
                transport.sendMail({
                    from: config.from,
                    to: message.email,
                    subject: message.subject,
                    html: html,
                    // generateTextFromHTML: true,
                    text: text
                }, function(err, responseStatus) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(responseStatus.message);
                    }
                    transport.close(); // shut down the connection pool, no more messages
                });
            });
        });
    };
}

exports.createMail = function(config){
    return new mail(config);
};
