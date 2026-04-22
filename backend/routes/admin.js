const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Order = require('../models/Order');

router.get('/users', auth, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/users/:id', auth, authorize('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/vendors', auth, authorize('admin'), async (req, res) => {
  try {
    const vendors = await Vendor.find().select('-password');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/vendors/:id/approve', auth, authorize('admin'), async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/vendors/:id', auth, authorize('admin'), async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vendor removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/orders', auth, authorize('admin'), async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/orders/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
