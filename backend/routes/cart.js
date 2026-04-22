const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

router.get('/', auth, authorize('user'), async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [], grandTotal: 0 });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/add', auth, authorize('user'), async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [], grandTotal: 0 });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity = quantity || existingItem.quantity + 1;
      existingItem.totalPrice = existingItem.quantity * product.price;
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity || 1,
        totalPrice: (quantity || 1) * product.price
      });
    }

    cart.grandTotal = cart.items.reduce((total, item) => total + item.totalPrice, 0);
    await cart.save();

    cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/update', auth, authorize('user'), async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    item.quantity = quantity;
    item.totalPrice = quantity * product.price;
    cart.grandTotal = cart.items.reduce((total, item) => total + item.totalPrice, 0);
    await cart.save();

    cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/remove/:productId', auth, authorize('user'), async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
    cart.grandTotal = cart.items.reduce((total, item) => total + item.totalPrice, 0);
    await cart.save();

    cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/clear', auth, authorize('user'), async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    cart.grandTotal = 0;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
