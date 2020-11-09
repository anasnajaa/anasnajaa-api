
const {v4} = require('uuid');
const express = require('express');

const smsController = require('../controllers/sms.c');
const awsS3 = require('../util/awsS3');

const router = express.Router();

// Customer Service

router.post("/request/service/send-verification-code", require('../controllers/customer_service/sendVerificationCode.c'));
router.post("/request/service/verify", require('../controllers/customer_service/verifyAuthCode.c'));
router.post("/request/service/add-info", require('../controllers/customer_service/completeProfile.c'));

router.get("/requests", require('../controllers/requests/getAll.c'));

// Util

router.get('/awake', require('../controllers/awake'));
router.get("/captcha", require('../controllers/captcha'));
router.get("/email/test", require('../controllers/emailTest'));

router.post('/sms/update-sms-status', smsController.updateMessageStatus);

router.get('/sign-s3', async (req, res)=>{
    const fileName = v4() +"."+ req.query['file-name'].split(".")[1];
    const fileType = req.query['file-type'];
    const data = await awsS3.getSignedUrl(fileName, fileType);
    res.json(data);
});

module.exports = router;