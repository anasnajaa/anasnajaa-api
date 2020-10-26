const {v4} = require('uuid');
const{contentServer} = require('../util/awake');

module.exports = async (req, res, next)=>{
    const contentServerAwake = await contentServer();
    res.json({
        id: v4(),
        contentServerAwake
    });
}