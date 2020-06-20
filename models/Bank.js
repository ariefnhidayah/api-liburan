const mongoose = require('mongoose')
const BankSchema = new mongoose.Schema({
    name_bank: {
        type: String,
        required: true
    },
    account_number: {
        type: String,
        required: true
    },
    account_name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Banks', BankSchema)