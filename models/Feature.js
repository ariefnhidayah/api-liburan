const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema
const FeatureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    item_id: {
        type: ObjectId,
        ref: 'Items'
    }
});

module.exports = mongoose.model('Features', FeatureSchema)