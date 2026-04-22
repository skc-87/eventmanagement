const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  category: { 
    type: String, 
    enum: ['Catering', 'Florist', 'Decoration', 'Lighting'],
    required: true 
  },
  status: { type: String, default: 'Active', enum: ['Active', 'Inactive', 'Pending'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
