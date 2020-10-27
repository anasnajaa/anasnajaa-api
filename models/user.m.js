const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, required: false },
    email: { type: String, required: false },
    mobile: { type: String, required: true, unique: true },
    isMobileVerified: { type: Boolean, required: false },
    isEmailVerified: { type: Boolean, required: false },
    mobileAuthCode: { type: String, required: false },
    emailAuthCode: { type: String, required: false },
    services: [{
        type: Schema.Types.ObjectId,
        ref: 'userService'
    }]
}, 
{ timestamps: true, collection: 'user' });

schema.index({mobile: 1});

module.exports = mongoose.model('user', schema);