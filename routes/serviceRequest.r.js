const cServiceRequests = require('../controllers/serviceRequest.c');

exports.init = (router) => {
    router.post("/request/service/send-verification-code", cServiceRequests.sendVerificationCode);
    router.post("/request/service/verify-mobile", cServiceRequests.verifyMobile);
    router.post("/request/service/add-user-info", cServiceRequests.addInfo);
}