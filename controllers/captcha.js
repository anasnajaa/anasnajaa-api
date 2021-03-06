const {isCaptchaValid} = require('../util/captcha');

module.exports = async(req, res, next) => {
    const key = req.query.key;
    const captchaResult = await isCaptchaValid(key);
    res.json({
        isValid: captchaResult
    })
};