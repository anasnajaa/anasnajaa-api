require('dotenv').config();
const environment = process.env.NODE_ENV;
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
const UserServiceModel = require('../models/userService.m');
const r = require('../locales/codedResponses');
const mongoose = require('mongoose');

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
            if(environment === "production"){
                return await smsService.sendMessage(
                    "verification",
                    mobileWithCountryCode, 
                    `${t("your_verification_code")}: ${verificationCode}`);
            }
            return null;
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
            mobileAuthCode: authCode
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
            isMobileVerified: false,
            mobileAuthCode: authCode
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


/* 
this function will:
- update user verification details 
- add a new user service record
- return added user service id as a reference 
*/
exports.verifyAuthCode = async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
        let errors = {};
        const { 
            authCode,
            mobile,
            countryCode
        } = req.body;

        const mobileWithCountryCode = countryCode + mobile;

        vEmpty("authCode", errors, authCode);
        vMobile("mobile", errors, mobileWithCountryCode);

        if(!isEmpty(errors)){
            res.json({status: -1, errors});
            return;
        }

        session.startTransaction();
        
        const user = await UserModel.findOne({
            mobileAuthCode: authCode,
            mobile: mobileWithCountryCode
        }).session(session);

        if(!user){
            await session.abortTransaction();
            res.json({status: -1, error: "Auth code or mobile number is not valid, please restart the verification process."});
            return;
        }

        user.isMobileVerified = true;
        user.mobileAuthCode = null;
        
        const userService = await UserServiceModel.create([{
            userId: user._id
        }], {session});

        const newServiceId = userService[0]._id;

        user.services.push(newServiceId);

        const updatedUser = await user.save();

        if(!updatedUser) {
            await session.abortTransaction();
            res.json({status: -1, error: "Failed to update user details."});
            return;
        }

        await session.commitTransaction();

        res.json({
            status: 1,
            message: "Mobile verified",
            userServiceId: newServiceId
        });
    } catch (error) {
        await session.abortTransaction();
        apiError(res, error);
    }
}

exports.addInfo = async (req, res, next)=>{
    try {
        let errors = {};
        const { 
            name, 
            email, 
            userServiceId, 
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
        apiError(res, error);
    }
};