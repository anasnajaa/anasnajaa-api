const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, required: false },
    description: { type: String, required: false },
    index: { type: Number, required: false }
}, 
{ timestamps: false, collection: 'service' });

module.exports = mongoose.model('service', schema);