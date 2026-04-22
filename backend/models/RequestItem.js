const mongoose = require('mongoose');

const requestItemSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  itemName: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RequestItem', requestItemSchema);
