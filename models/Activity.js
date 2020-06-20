const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema
const ActivitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    is_popular: {
        type: Boolean
    },
    item_id: {
        type: ObjectId,
        ref: 'Items'
    }
});

module.exports = mongoose.model('Activities', ActivitySchema)