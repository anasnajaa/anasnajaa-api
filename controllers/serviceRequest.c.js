const { isEmpty } = require('lodash');
const { 
    vEmail, 
    vEmpty, 
    vNumeric, 
    vMobile,
    vCaptcha 
} = require('../validators/index');
const { apiError } = require('../util/errorHandler');
const smsService = require('./sms.c');
const UserModel = require('../models/user.m');
const r = require('../locales/codedResponses');

exports.sendVerificationCode = async (req, res, next) => {
    const t = req.__;
    try {
        let errors = {};

        const {
            captcha,
            mobile
        } = req.body;
        
        const mobileWithCountryCode = "+965" + mobile;

        vMobile("mobile", errors, mobileWithCountryCode);
        await vCaptcha("captcha", errors, captcha);

        if(!isEmpty(errors)){
            res.json({status: -1, validationErrors: errors});
            return;
        }

        const user = await UserModel.findOne({mobile}).exec();

        console.log("user", user);

        const verificationCode = Math.floor(Math.random()*90000) + 10000;

        const messageResponse = await smsService.sendMessage(
            "verification",
            mobileWithCountryCode, 
            `${t("your_verification_code")}: ${verificationCode}`);

        res.json({
            status: 1,
            message: r.verification_code_sent(t),
            messageResponse
        });

    } catch (error) {
        apiError(res, error);
    }
};

exports.verifyMobile = async (req, res, next) => {
    try {
        let errors = {};
        const { 
            serviceRequestId,
            mobileVerificationCode
        } = req.body;



        if(!isEmpty(errors)){
            res.json({status: -1, errors});
            return;
        }

        res.json({status: 1});

    } catch (error) {
        apiError(error);
    }
}

exports.addInfo = async (req, res, next)=>{
    try {
        let errors = {};
        const { 
            name, 
            email, 
            serviceId, 
            description 
        } = req.body;

        vEmpty("name", errors, name);
        vEmail("email", errors, email);
        vNumeric("serviceId", errors, serviceId);

        if(!isEmpty(errors)){
            res.json({status: -1, errors});
            return;
        }

        sms.date_updated = new Date();
        const result = await smsModel.updateOne({ sid: sms.SmsSid }, sms).exec();
        res.json({status: 1, result});
    } catch (error) {
        apiError(error);
    }
};