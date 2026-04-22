import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = '/api';

export default function CheckOut() {
  const [formData, setFormData] = useState({
    name: '', email: '', address: '', city: '',
    number: '', paymentMethod: 'Cash', state: '', pinCode: ''
  });
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API}/orders/checkout`, formData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setOrderSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    }
  };

  return (
    <div className="page-shell">
      <div className="checkout-scene">
        <div className="checkout-panel animate-in">
          <h2>Checkout</h2>
          <p className="checkout-sub">Enter delivery details to place your order</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleOrder}>
            <div className="form-grid-2">
              <div className="field-group"><label>Name</label><input name="name" placeholder="Full name" value={formData.name} onChange={handleChange} required /></div>
              <div className="field-group"><label>Phone</label><input name="number" placeholder="Phone number" value={formData.number} onChange={handleChange} required /></div>
              <div className="field-group"><label>Email</label><input name="email" type="email" placeholder="Email address" value={formData.email} onChange={handleChange} required /></div>
              <div className="field-group">
                <label>Payment</label>
                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>
              <div className="field-group"><label>Address</label><input name="address" placeholder="Street address" value={formData.address} onChange={handleChange} required /></div>
              <div className="field-group"><label>State</label><input name="state" placeholder="State" value={formData.state} onChange={handleChange} required /></div>
              <div className="field-group"><label>City</label><input name="city" placeholder="City" value={formData.city} onChange={handleChange} required /></div>
              <div className="field-group"><label>Pin Code</label><input name="pinCode" placeholder="Pin code" value={formData.pinCode} onChange={handleChange} required /></div>
            </div>

            <button type="submit" className="btn btn-glow btn-lg" style={{ width: '100%', marginTop: '28px', justifyContent: 'center' }}>
              Place Order →
            </button>
          </form>
        </div>
      </div>

      {orderSuccess && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="success-icon">✓</div>
            <h2>Order Placed!</h2>
            <div style={{ marginBottom: '8px' }}>
              <span className="total-value" style={{ fontSize: '1.6rem' }}>₹ {orderSuccess.totalAmount}</span>
            </div>

            <div className="detail-grid">
              <div className="detail-item"><span>Name</span>{orderSuccess.name}</div>
              <div className="detail-item"><span>Phone</span>{orderSuccess.number}</div>
              <div className="detail-item" style={{ gridColumn: 'span 2' }}><span>Email</span>{orderSuccess.email}</div>
              <div className="detail-item"><span>Payment</span>{orderSuccess.paymentMethod}</div>
              <div className="detail-item"><span>Pin Code</span>{orderSuccess.pinCode}</div>
              <div className="detail-item" style={{ gridColumn: 'span 2' }}><span>Address</span>{orderSuccess.address}, {orderSuccess.city}, {orderSuccess.state}</div>
            </div>

            <button className="btn btn-glow btn-lg" onClick={() => navigate('/user/portal')} style={{ width: '100%', justifyContent: 'center' }}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
