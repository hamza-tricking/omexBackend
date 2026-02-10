const mongoose = require('mongoose');

const incompleteOrderSchema = new mongoose.Schema({
    nameClient: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    nameOfProduct: {
        type: String,
        required: true,
        trim: true
    },
    priceOfProduct: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    address: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    color: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['incomplete', 'pending', 'cancelled'],
        default: 'incomplete'
    },
    notes: {
        type: String,
        trim: true
    },
    // Additional fields for tracking incomplete orders
    selectedColor: {
        type: String,
        trim: true
    },
    selectedPackage: {
        type: String,
        trim: true
    },
    timestamp: {
        type: String,
        trim: true
    },
    exitReason: {
        type: String,
        trim: true
    },
    userAgent: {
        type: String,
        trim: true
    },
    page: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('IncompleteOrder', incompleteOrderSchema);
