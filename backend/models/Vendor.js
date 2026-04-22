const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'vendor' },
  category: { 
    type: String, 
    enum: ['Catering', 'Florist', 'Decoration', 'Lighting'],
    required: true 
  },
  contactDetails: { type: String, default: '' },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vendor', vendorSchema);
