const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Product = require('../models/Product');
const upload = require('../middleware/upload');

router.get('/', async (req, res) => {
  try {
    const { category, vendor } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (vendor) filter.vendor = vendor;
    const products = await Product.find(filter).populate('vendor', 'name contactDetails category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('vendor', 'name contactDetails category');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, authorize('vendor'), upload.single('image'), async (req, res) => {
  try {
    const { name, price } = req.body;
    const vendor = await require('../models/Vendor').findById(req.user.id);
    const product = await Product.create({
      name,
      price,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      vendor: req.user.id,
      category: vendor.category
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, authorize('vendor'), upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.vendor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updates = { name: req.body.name, price: req.body.price };
    if (req.file) updates.image = `/uploads/${req.file.filename}`;

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, authorize('vendor'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.vendor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
