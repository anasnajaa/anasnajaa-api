const smsController = require('../controllers/sms.c');

exports.init = (router)=>{
    router.post('/sms/update-sms-status', smsController.updateMessageStatus);
    router.post('/sms/send', smsController.sendMessage);
    router.get('/sms/messages', smsController.getMessages);
}