var nodemailer = require("nodemailer");

var mail = function (config) {
    var transport = nodemailer.createTransport("SMTP", config);

    this.send = function (to, title, content){
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: config.from, // sender address
            to: to, // list of receivers
            subject: title, // Subject line
            //text: "Hello world ✔", // plaintext body
            html: content // html body
        }

        // send mail with defined transport object
        transport.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
            }else{
                console.log("Message sent: " + response.message);
            }

            //transport.close(); // shut down the connection pool, no more messages
        });
    };
}

exports.createMail = function(config){
    return new mail(config);
};
