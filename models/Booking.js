const mongoose = require('mongoose')

const { ObjectId } = mongoose.Schema;

const BookingSchema = new mongoose.Schema({
    date_start: {
        type: Date,
        required: true
    },
    date_end: {
        type: Date,
        required: true
    },
    item_id: {
        _id: {
            type: ObjectId,
            ref: 'Items',
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: true
        }
    },
    total: {
        type: Number,
        required: true
    },
    member_id: {
        type: ObjectId,
        ref: "Members"
    },
    bank_id: {
        type: ObjectId,
        ref: "Banks"
    },
    payments: {
        proof_payment: {
            type: String,
            required: true
        },
        bank_from: {
            type: String,
            required: true
        },
        account_holder: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            default: 'Proses'
        },
    },
    invoice: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Bookings', BookingSchema)