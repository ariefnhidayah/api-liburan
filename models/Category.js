const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema;
const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    item_id: [{
        type: ObjectId,
        ref: 'Items'
    }]
});

module.exports = mongoose.model('Categories', CategorySchema)