const cCaptcha = require('../controllers/captcha');
const cAwake = require('../controllers/awake');
const emailTest = require('../controllers/emailTest');

exports.init = (router)=>{
    router.get('/awake', cAwake);
    router.get("/captcha", cCaptcha);
    router.get("/email/test", emailTest);
}