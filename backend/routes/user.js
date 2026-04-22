const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Vendor = require('../models/Vendor');

// GET /api/user/vendors - Get all vendors (optionally filtered by category)
router.get('/vendors', auth, authorize('user'), async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    const vendors = await Vendor.find(filter).select('-password');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/user/vendors/:id - Get specific vendor details
router.get('/vendors/:id', auth, authorize('user'), async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).select('-password');
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
