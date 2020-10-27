const cServiceRequests = require('../controllers/serviceRequest.c');

exports.init = (router) => {
    router.post("/request/service/send-verification-code", cServiceRequests.sendVerificationCode);
    router.post("/request/service/verify", cServiceRequests.verifyAuthCode);
    router.post("/request/service/add-info", cServiceRequests.addInfo);
}