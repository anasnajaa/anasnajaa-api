const nodemailer = require("nodemailer");
require('dotenv').config();
const environment = process.env.NODE_ENV;
const stage = require('../config/index')[environment];

exports.sendMail = async function(mailObject, logMessage) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: stage.mailer.user,
          pass: stage.mailer.password
        }
    });

    let info = await transporter.sendMail(mailObject);

    console.log("[mailer] %s: %s", logMessage, info.messageId);
};