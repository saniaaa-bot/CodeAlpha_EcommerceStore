const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

// 1. Naya order place karna
router.post('/', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ message: "Unauthorized" });
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { items, totalAmount, address, phone } = req.body;
        
        const newOrder = new Order({
            user: decoded.id,
            items,
            totalAmount,
            address,
            phone
        });

        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully!", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "Error placing order", error: error.message });
    }
});

// 2. Admin ke liye saare orders dekhna
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
});

// 3. Customer ke apne orders dekhna (Ye /:id se PEHLE hona zaroori hai)
router.get('/myorders', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ message: "Unauthorized" });
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const orders = await Order.find({ user: decoded.id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching your orders", error: error.message });
    }
});

// 4. Admin ke liye order ka status update karna
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Error updating status" });
    }
});

module.exports = router;