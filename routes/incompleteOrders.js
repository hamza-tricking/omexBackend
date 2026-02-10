const express = require('express');
const router = express.Router();
const IncompleteOrder = require('../models/IncompleteOrder');

// GET all incomplete orders
router.get('/', async (req, res) => {
    try {
        const orders = await IncompleteOrder.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET incomplete order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await IncompleteOrder.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Incomplete order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST create new incomplete order
router.post('/', async (req, res) => {
    try {
        const order = new IncompleteOrder({
            nameClient: req.body.nameClient,
            phone: req.body.phone,
            nameOfProduct: req.body.nameOfProduct,
            priceOfProduct: req.body.priceOfProduct,
            quantity: req.body.quantity,
            address: req.body.address,
            city: req.body.city,
            color: req.body.color,
            status: req.body.status || 'incomplete',
            notes: req.body.notes
        });
        
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT update incomplete order
router.put('/:id', async (req, res) => {
    try {
        const order = await IncompleteOrder.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Incomplete order not found' });
        }

        order.nameClient = req.body.nameClient || order.nameClient;
        order.phone = req.body.phone || order.phone;
        order.nameOfProduct = req.body.nameOfProduct || order.nameOfProduct;
        order.priceOfProduct = req.body.priceOfProduct || order.priceOfProduct;
        order.quantity = req.body.quantity || order.quantity;
        order.address = req.body.address || order.address;
        order.city = req.body.city || order.city;
        order.color = req.body.color || order.color;
        order.status = req.body.status || order.status;
        order.notes = req.body.notes || order.notes;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE incomplete order
router.delete('/:id', async (req, res) => {
    try {
        const order = await IncompleteOrder.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Incomplete order not found' });
        }

        await order.deleteOne();
        res.json({ message: 'Incomplete order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE all incomplete orders
router.delete('/all', async (req, res) => {
    try {
        const result = await IncompleteOrder.deleteMany({});
        res.json({ 
            message: 'All incomplete orders deleted successfully',
            deletedCount: result.deletedCount 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET incomplete orders by status
router.get('/status/:status', async (req, res) => {
    try {
        const orders = await IncompleteOrder.find({ status: req.params.status }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Convert incomplete order to complete order
router.post('/:id/convert', async (req, res) => {
    try {
        const incompleteOrder = await IncompleteOrder.findById(req.params.id);
        if (!incompleteOrder) {
            return res.status(404).json({ message: 'Incomplete order not found' });
        }

        const Order = require('../models/Order');
        const completeOrder = new Order({
            nameClient: incompleteOrder.nameClient,
            phone: incompleteOrder.phone,
            nameOfProduct: incompleteOrder.nameOfProduct,
            priceOfProduct: incompleteOrder.priceOfProduct,
            quantity: incompleteOrder.quantity,
            address: req.body.address || incompleteOrder.address,
            city: req.body.city || incompleteOrder.city,
            color: req.body.color || incompleteOrder.color,
            status: 'pending'
        });

        const savedCompleteOrder = await completeOrder.save();
        
        // Delete the incomplete order after conversion
        await incompleteOrder.deleteOne();

        res.json({
            message: 'Order converted successfully',
            completeOrder: savedCompleteOrder
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
