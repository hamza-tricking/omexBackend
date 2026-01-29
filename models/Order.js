const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
    status: {
        type: String,
        required: true,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    color: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true // This automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Order', orderSchema);
