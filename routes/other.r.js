const {v4} = require('uuid');
const {isCaptchaValid} = require('../util/cpatch');

exports.init = (router)=>{
    router.get('/awake', async (req, res, next)=>{
        res.json({id: v4()});
    });

    router.get("/captcha", async(req, res, next) => {
        const key = req.query.key;
        const captchaResult = await isCaptchaValid(key);
        res.json({
            isValid: captchaResult
        })
    });
}