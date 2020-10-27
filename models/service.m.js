const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, required: false },
    description: { type: String, required: false }
}, 
{ timestamps: false });

schema.index({name: 1, collection: 'userService'});

module.exports = mongoose.model('service', schema);