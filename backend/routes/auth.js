const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Admin = require('../models/Admin');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const getModelByRole = (role) => {
  switch (role) {
    case 'user': return User;
    case 'vendor': return Vendor;
    case 'admin': return Admin;
    default: return null;
  }
};

// unified login - checks all collections
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    let account = null;
    let role = null;

    account = await User.findOne({ email });
    if (account) role = 'user';

    if (!account) {
      account = await Vendor.findOne({ email });
      if (account) role = 'vendor';
    }

    if (!account) {
      account = await Admin.findOne({ email });
      if (account) role = 'admin';
    }

    if (!account) return res.status(400).json({ message: 'No account found with this email' });

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const payload = {
      _id: account._id,
      name: account.name,
      email: account.email,
      role,
      token: generateToken(account._id, role)
    };
    if (role === 'vendor') payload.category = account.category;

    res.json(payload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// unified signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, category, contactDetails } = req.body;

    if (!['user', 'vendor', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const Model = getModelByRole(role);

    // check all collections to prevent duplicate emails across roles
    const existsUser = await User.findOne({ email });
    const existsVendor = await Vendor.findOne({ email });
    const existsAdmin = await Admin.findOne({ email });
    if (existsUser || existsVendor || existsAdmin) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const data = { name, email, password: hashedPassword };
    if (role === 'vendor') {
      if (!category) return res.status(400).json({ message: 'Vendor category is required' });
      data.category = category;
      data.contactDetails = contactDetails || '';
    }

    const account = await Model.create(data);

    const payload = {
      _id: account._id,
      name: account.name,
      email: account.email,
      role,
      token: generateToken(account._id, role)
    };
    if (role === 'vendor') payload.category = account.category;

    res.status(201).json(payload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
