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
            mobile,
            countryCode
        } = req.body;
        
        const mobileWithCountryCode = countryCode + mobile;

        const generateAuthCode = () => Math.floor(Math.random()*90000) + 10000;

        const sendAuthSMS = async (mobileWithCountryCode, verificationCode) => {
            return await smsService.sendMessage(
                "verification",
                mobileWithCountryCode, 
                `${t("your_verification_code")}: ${verificationCode}`);
        }




        vMobile("mobile", errors, mobileWithCountryCode);
        //await vCaptcha("captcha", errors, captcha);

        if(!isEmpty(errors)){
            res.json({status: -2, validationErrors: errors});
            return;
        }

        const authCode = generateAuthCode(); 

        // might be a returning user, avoid double entry
        // reset verification as we do not have a login system yet 
        const updatedUser = await UserModel.updateOne({mobile: mobileWithCountryCode}, {
            isMobileVerified: false,
            verificationDate: null,
            verificationCode: authCode
        }).lean();

        if(updatedUser.nModified > 0) {
            await sendAuthSMS(mobileWithCountryCode, authCode);
            res.json({
                status: 1,
                message: r.verification_code_mobile_sent(t)
            });
            return;
        }

        const newUser = await UserModel.create({
            mobile: mobileWithCountryCode, 
            verificationCode: authCode,
            isMobileVerified: false,
            verificationDate: null
        });

        if(newUser){
            await sendAuthSMS(mobileWithCountryCode, authCode);
            res.json({
                status: 1,
                message: r.verification_code_mobile_sent(t)
            });
        } else {
            res.json({
                status: -1,
                error: "Failed to send verification code"
            });
        }
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