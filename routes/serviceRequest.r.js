exports.init = (router) => {
    router.post("/request/service/send-verification-code", 
    require('../controllers/serviceRequest/sendVerificationCode.c'));

    router.post("/request/service/verify", 
    require('../controllers/serviceRequest/verifyAuthCode.c'));

    router.post("/request/service/add-info", 
    require('../controllers/serviceRequest/addUserInfo.c'));
}