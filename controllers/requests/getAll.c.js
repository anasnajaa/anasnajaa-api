const { isEmpty } = require('lodash');
const { 
    vEmail, 
    vEmpty
} = require('../../validators/index');
const { apiError } = require('../../util/errorHandler');
const UserModel = require('../../models/user.m');
const UserServiceModel = require('../../models/userService.m');
const ServiceModel = require('../../models/service.m');
const cr = require('../../locales/codedResponses');
const mongoose = require('mongoose');
const serviceRequestEmail = require('../../email/serviceRequestReceived');
const paramsMissing = require('../../util/methodParamCheck');
const fields = [
    { key: "pending", required: true }
];

/* 
this function will:
- update user info 
- send confirmation email to the user
*/
module.exports = async (req, res)=>{
    const t = req.__;
    //if(paramsMissing(t, fields, req.body, res)){ return; };

    try {

        // const users = await UserModel.aggregate([
        //     {$lookup: {
        //             from: "userService",
        //             localField: "services",
        //             foreignField: "_id",
        //             as: "services"
        //     }},
            // {$unwind: {
            //     path: "$services",
            //     preserveNullAndEmptyArrays: true
            // }},
            // {$lookup: {
            //     from: 'service',
            //     localField: 'services.serviceId',
            //     foreignField: '_id',
            //     as: 'services.service'
            // }},
            // {$group: {
            //     _id: "$_id",
            //     name: "$name",
            //     mobile: "$mobile",
            //     isMobileVerified: "$isMobileVerified",
            //     email: "$email",
            //     services: {$push: {
            //         _id: "$services._id",
            //         description: "$services.description",
            //         isUserContacted: "$services.isUserContacted",
            //         createdAt: "$services.createdAt",
            //     }}
            //     // question: {$push: {
            //     //     title: "$questions.title",
            //     //     form: "$questions.form",
            //     //     options: "$options"
            //     // }}
            // }}
        // ]);

        const users = await UserModel.find({});
        // const pendingUsers = [];
        // for(let i in users){
        //     if(!users[i].services.find(x=>x.isUserContacted)){
        //         pendingUsers.push(users[i]);
        //     }
        // }
        res.status(200).json({
            data: {
                users
            }
        });
    } catch (error) {
        apiError(t, res, error);
    }
}