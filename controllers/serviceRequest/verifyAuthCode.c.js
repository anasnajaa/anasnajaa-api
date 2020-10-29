const { isEmpty } = require('lodash');
const { 
    vEmpty, 
    vMobile
} = require('../../validators/index');
const { apiError } = require('../../util/errorHandler');
const UserModel = require('../../models/user.m');
const UserServiceModel = require('../../models/userService.m');
const cr = require('../../locales/codedResponses');
const mongoose = require('mongoose');
const paramsMissing = require('../../util/methodParamCheck');

const fields = [
    { key: "authCode", required: true },
    { key: "mobile", required: true },
    { key: "countryCode", required: true }
];

const generateAuthCode = () => Math.floor(Math.random()*90000) + 10000;

/* 
this function will:
- update user verification details 
- add a new user service record
- return added user, update info token and service id as a reference 
*/
module.exports = async (req, res) => {
    const t = req.__;
    if(paramsMissing(t, fields, req.body, res)){ return; };
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
            res.status(422).json({
                messages: [cr.user_input_errors(t)], 
                errors
            });
            return;
        }

        session.startTransaction();
        
        const user = await UserModel.findOne({
            mobileAuthCode: authCode,
            mobile: mobileWithCountryCode
        }).session(session);

        if(!user){
            await session.abortTransaction();
            res.status(402).json({
                messages: [cr.service_request_mobile_or_auth_invalid(t)]
            });
            return;
        }

        user.isMobileVerified = true;
        user.mobileAuthCode = null;
        user.infoUpdateToken = generateAuthCode();
        
        const userService = await UserServiceModel.create([{
            userId: user._id
        }], {session});

        const newServiceId = userService[0]._id;

        user.services.push(newServiceId);

        const updatedUser = await user.save();

        if(!updatedUser) {
            await session.abortTransaction();
            res.status(402).json({
                messages: [cr.service_request_failed_to_update_user_details(t)]
            });
            return;
        }

        await session.commitTransaction();

        res.status(200).json({
            messages: [cr.service_request_mobile_number_verified(t)],
            data: {
                userServiceId: newServiceId,
                infoUpdateToken: user.infoUpdateToken
            }
        });
    } catch (error) {
        await session.abortTransaction();
        apiError(t, res, error);
    }
}