const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create new order
router.post('/', async (req, res) => {
    try {
        const order = new Order({
            nameClient: req.body.nameClient,
            nameOfProduct: req.body.nameOfProduct,
            priceOfProduct: req.body.priceOfProduct,
            quantity: req.body.quantity,
            status: req.body.status || 'pending',
            address: req.body.address,
            city: req.body.city,
            color: req.body.color
        });
        console.log(order)
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update order
router.put('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.nameClient = req.body.nameClient || order.nameClient;
        order.nameOfProduct = req.body.nameOfProduct || order.nameOfProduct;
        order.priceOfProduct = req.body.priceOfProduct || order.priceOfProduct;
        order.quantity = req.body.quantity || order.quantity;
        order.status = req.body.status || order.status;
        order.address = req.body.address || order.address;
        order.city = req.body.city || order.city;
        order.color = req.body.color || order.color;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE order
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await order.deleteOne();
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET orders by status
router.get('/status/:status', async (req, res) => {
    try {
        const orders = await Order.find({ status: req.params.status }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
