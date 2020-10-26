const { isEmpty } = require('lodash');
const { vEmail, vEmpty, vNumeric } = require('../validators/index');
const { apiError } = require('../util/errorHandler');

exports.submitServiceRequest = async (req, res, next)=>{
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
        res.status(200).json({status: 1, result});
    } catch (error) {
        apiError(error);
    }
};