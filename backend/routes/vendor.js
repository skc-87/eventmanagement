const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const RequestItem = require('../models/RequestItem');

// GET /api/vendor/profile - Get vendor profile
router.get('/profile', auth, authorize('vendor'), async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.user.id).select('-password');
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/vendor/my-products - Get vendor's own products
router.get('/my-products', auth, authorize('vendor'), async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/vendor/requests - Get vendor's request items
router.get('/requests', auth, authorize('vendor'), async (req, res) => {
  try {
    const requests = await RequestItem.find({ vendor: req.user.id });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/vendor/requests - Create a request item
router.post('/requests', auth, authorize('vendor'), async (req, res) => {
  try {
    const request = await RequestItem.create({
      vendor: req.user.id,
      itemName: req.body.itemName,
      description: req.body.description
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/vendor/orders - Get orders containing vendor's products
router.get('/orders', auth, authorize('vendor'), async (req, res) => {
  try {
    const vendorProducts = await Product.find({ vendor: req.user.id }).select('_id');
    const productIds = vendorProducts.map(p => p._id);
    const Order = require('../models/Order');
    const orders = await Order.find({ 'items.product': { $in: productIds } })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
