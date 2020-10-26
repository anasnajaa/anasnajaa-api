const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, required: false },
    description: { type: String, required: false }
}, 
{ timestamps: true });

module.exports = mongoose.model('service', schema);