require('dotenv').config();
const apiMail = require('../email/apiErrorEmail');
const dbMail = require('../email/dbErrorEmail');
const cr = require('../locales/codedResponses');
const environment = process.env.NODE_ENV;

exports.apiError = (t, res, error) => {
    if (environment !== 'production') {
        res.status(500).json({ messages: [
            {
                message: error.message,
                code: -1,
                type: "error"
            }
        ]});
        console.log(error);
    } else {
        res.status(500).json({ messages: [cr.server_error(t)]});
        apiMail.sendEmail(error);
    }
}

exports.databaseError = (error) => {
    if (environment !== 'production') {
        console.log(error);
    } else {
        dbMail.sendEmail(error);
    }
}