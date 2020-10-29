const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    serviceId: { 
        type: Schema.Types.ObjectId,
        ref: 'service',
        required: false
    },
    description: { type: String, required: false },
    isUserContacted: { type: Boolean, required: false },
    isDelivered: { type: Boolean, required: false },
    deliveryDate: { type: Date, required: false },
    rating: { type: Number, required: false },
    testimonial: { type: String, required: false },
    contractUrl: { type: String, required: false },
}, 
{ timestamps: true, collection: 'userService' });

module.exports = mongoose.model('userService', schema);