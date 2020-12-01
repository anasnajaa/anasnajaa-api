const linkModel = require('../models/link.m');
const {apiError} = require('../util/errorHandler');

exports.getLinks =  async (req, res)=> {
    try {
        const links = await linkModel.find({}).lean();
        res.status(200).json({links});
    } catch (error) {
        apiError(error);
    }
}

exports.addLink = async (req, res)=> {
    try {
        const { 
            title,
            url,
            likes,
            tags,
            date_created
        } = req.body;

        const newLink = await new linkModel({
            title,
            url,
            likes,
            tags,
            date_created
        });
        await newLink.save();
        res.status(200).json({newLink});
    } catch (error) {
        apiError(error);
    }
}