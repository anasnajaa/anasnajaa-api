const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: Number, required: true },
    isMobileVerified: { type: Boolean, required: true },
    isEmailVerified: { type: Boolean, required: true },
    serviceId: { type: Number, required: true },
    description: { type: String, required: true },
    isContacted: { type: Boolean, required: true },
    isServiceDelivered: { type: Boolean, required: true },
    serviceDeliveryDate: { type: Date, required: true },
    rating: { type: Number, required: true },
    testimonial: { type: Number, required: true },
}, 
{ timestamps: true });

const Service = mongoose.model('Service', schema);

module.exports = Service; 