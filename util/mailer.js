require("dotenv").config();
const environment = process.env.NODE_ENV;
const stage = require("../config/index")[environment];
const { merge } = require("lodash");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(stage.sendGridApiKey);

exports.sendMail = async (mailObject) => {
  try {
    if (environment !== "production") {
      mailObject.to = "spidernet12@gmail.com";
    }
    const msg = merge({ from: "anas.najaa@outlook.com" }, mailObject);
    const response = await sgMail.send(msg);
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};
