const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./.env" })

module.exports = async function (email, subject, content) {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const mailoptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: subject,
            html: content
        }

        transporter.sendMail(mailoptions, function (err, info) {
            if (err) {
                console.log("error", err)
            }
            else {
                console.log("mail sent successfully :-", info.response)
            }
        })
    } catch (error) {
        console.log("error", error);
    }

}
