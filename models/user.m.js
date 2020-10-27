const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, required: false },
    email: { type: String, required: false },
    mobile: { type: Number, required: true, unique: true },
    isMobileVerified: { type: Boolean, required: false },
    verificationDate: { type: Boolean, required: false },
    verificationCode: { type: String, required: false },
    services: [{
        type: Schema.Types.ObjectId,
        ref: 'userService'
    }]
}, 
{ timestamps: true });

module.exports = mongoose.model('user', schema);