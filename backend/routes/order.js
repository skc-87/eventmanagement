const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

router.post('/checkout', auth, authorize('user'), async (req, res) => {
  try {
    const { name, email, number, address, city, state, pinCode, paymentMethod } = req.body;
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      totalPrice: item.totalPrice
    }));

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount: cart.grandTotal,
      name, email, number, address, city, state, pinCode, paymentMethod
    });

    cart.items = [];
    cart.grandTotal = 0;
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-orders', auth, authorize('user'), async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/all', auth, authorize('admin'), async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', auth, authorize('admin'), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
