const { isEmpty } = require('lodash');
const { 
    vEmail, 
    vEmpty
} = require('../../validators/index');
const { apiError } = require('../../util/errorHandler');
const UserServiceModel = require('../../models/userService.m');
const ServiceModel = require('../../models/service.m');
const cr = require('../../locales/codedResponses');
const mongoose = require('mongoose');
const serviceRequestEmail = require('../../email/serviceRequestReceived');
const paramsMissing = require('../../util/methodParamCheck');

const fields = [
    { key: "token", required: true},
    { key: "first_name", required: true },
    { key: "last_name", required: true },
    { key: "email", required: true },
    { key: "serviceId", required: true },
    { key: "description", trequired: true }
];

/* 
this function will:
- update user info 
- send confirmation email to the user
*/
module.exports = async (req, res)=>{
    const t = req.__;
    if(paramsMissing(t, fields, req.body, res)){ return; }
    const session = await mongoose.startSession();
    try {
        let errors = {};
        const { 
            name, 
            email, 
            description,
            userServiceId,
            infoUpdateToken,
            serviceId
        } = req.body;

        vEmpty("infoUpdateToken", errors, infoUpdateToken);
        vEmpty("name", errors, name);
        vEmail("email", errors, email);
        vEmpty("userServiceId", errors, userServiceId);
        vEmpty("serviceId", errors, serviceId);

        if(!isEmpty(errors)){
            session.endSession;
            res.status(422).json({
                messages: [cr.user_input_errors(t)], 
                errors
            });
            return;
        }

        session.startTransaction();

        const user = await UserModel.findOne({
            infoUpdateToken
        }).session(session);

        if(!user) {
            await session.abortTransaction();
            session.endSession;
            res.status(402).json({
                messages: [cr.service_request_submission_failed(t)]
            });
            return;
        }
        const service  = await ServiceModel.findOne({
            _id: serviceId
        }).session(session);

        const userService = await UserServiceModel.findOne({
            _id: userServiceId
        }).session(session);

        if(!userService||!service) {
            await session.abortTransaction();
            session.endSession;
            res.status(402).json({
                messages: [cr.service_request_submission_failed(t)]
            });
            return;
        }

        user.name               = name;
        user.email              = email;
        user.infoUpdateToken    = null;
        
        userService.serviceId       = serviceId;
        userService.description     = description;
        userService.isUserContacted = false;

        const updatedUser = await user.save();
        const updatedUserService = await userService.save();
        
        if(!updatedUser || !updatedUserService || !service ){
            await session.abortTransaction();
            session.endSession;
            res.status(402).json({
                messages: [cr.service_request_submission_failed(t)]
            });
            return;
        }
        
        await session.commitTransaction();

        await serviceRequestEmail({email, name, serviceTitle: service.name});

        session.endSession;

        res.status(200).json({ 
            messages: [""]
        });
    } catch (error) {
        if(session.inTransaction()){
            await session.abortTransaction();
            session.endSession;
        }
        apiError(t, res, error);
    }
};