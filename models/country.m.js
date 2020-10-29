const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    code: { type: String, required: false },
    name: { type: String, required: false },
    d_code: { type: Number, required: false },
    index: { type: Number, required: false }
}, 
{ timestamps: false, collection: 'country' });

module.exports = mongoose.model('country', schema);