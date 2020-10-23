const {v4} = require('uuid');

exports.init = (router)=>{
    router.get('/awake', async (req, res, next)=>{
        res.json({id: v4()});
    });
}