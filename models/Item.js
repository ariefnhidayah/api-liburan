const mongoose = require('mongoose')

const { ObjectId } = mongoose.Schema;

const ItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        default: 'Indonesia'
    },
    city: {
        type: String,
        required: true
    },
    is_popular: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    },
    image_id: [{
        type: ObjectId,
        ref: "Images"
    }],
    feature_id: [{
        type: ObjectId,
        ref: "Features"
    }],
    activity_id: [{
        type: ObjectId,
        ref: "Activities"
    }],
    category_id: {
        type: ObjectId,
        ref: 'Categories'
    },
    sum_booking: {
        type: Number
    },
    unit: {
        type: String
    }
});

module.exports = mongoose.model('Items', ItemSchema)