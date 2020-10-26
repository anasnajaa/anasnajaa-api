require("dotenv").config();
const environment = process.env.NODE_ENV;
const stage = require("../config/index")[environment];
const { merge } = require("lodash");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(stage.sendGridApiKey);

// mailObject example:
// {
//   to: 'test@example.com',
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }

exports.sendMail = async (mailObject) => {
  try {
    const msg = merge({ from: "anas.najaa@outlook.com" }, mailObject);
    const response = await sgMail.send(msg);
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};