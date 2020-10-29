require('dotenv').config();
const environment = process.env.NODE_ENV;
const { isEmpty } = require('lodash');
const { vMobile } = require('../../validators/index');
const { apiError } = require('../../util/errorHandler');
const smsService = require('../sms.c');
const UserModel = require('../../models/user.m');
const cr = require('../../locales/codedResponses');
const paramsMissing = require('../../util/methodParamCheck');

const generateAuthCode = () => Math.floor(Math.random()*90000) + 10000;

const sendAuthSMS = async (t, mobileWithCountryCode, verificationCode) => {
    if(environment === "production"){
        return await smsService.sendMessage(
            "verification",
            mobileWithCountryCode, 
            `${t("your_verification_code")}: ${verificationCode}`);
    }
    return null;
}

const fields = [
    { key: "captcha", required: true },
    { key: "mobile", required: true },
    { key: "countryCode", required: true }
];

/* 
this function will:
- verifiy user's captcha against google servers
- create intial user record with mobile and auth code
*/
module.exports = async (req, res) => {
    const t = req.__;
    if(paramsMissing(t, fields, req.body, res)){ return; };
    try {
        let errors = {};

        const {
            captcha,
            mobile,
            countryCode
        } = req.body;
        
        const mobileWithCountryCode = countryCode + mobile;

        vMobile("mobile", errors, mobileWithCountryCode);

        if(environment === "production"){
            await vCaptcha("captcha", errors, captcha);
        }

        if(!isEmpty(errors)){
            res.status(422).json({
                messages: [cr.user_input_errors(t)], 
                errors
            });
            return;
        }

        const authCode = generateAuthCode(); 

        // might be a returning user, avoid double entry
        // reset verification as we do not have a login system yet 
        const updatedUser = await UserModel.updateOne({mobile: mobileWithCountryCode}, {
            isMobileVerified: false,
            mobileAuthCode: authCode
        }).lean();

        if(updatedUser.nModified > 0) {
            await sendAuthSMS(t, mobileWithCountryCode, authCode);
            res.status(402).json({
                messages: [cr.verification_code_mobile_sent(t)]
            });
            return;
        }

        const newUser = await UserModel.create({
            mobile: mobileWithCountryCode, 
            isMobileVerified: false,
            mobileAuthCode: authCode
        });

        if(!newUser){
            res.status(402).json({
                messages: [cr.service_request_failed_to_send_code(t)]
            });
            return;
        }

        await sendAuthSMS(mobileWithCountryCode, authCode);
        res.status(200).json({
            messages: [cr.verification_code_mobile_sent(t)]
        });
    } catch (error) {
        apiError(t, res, error);
    }
};