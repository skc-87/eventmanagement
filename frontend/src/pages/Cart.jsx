import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = '/api';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const headers = { Authorization: `Bearer ${user.token}` };

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API}/cart`, { headers });
      setCart(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateQty = async (productId, quantity) => {
    try {
      const res = await axios.put(`${API}/cart/update`, { productId, quantity: parseInt(quantity) }, { headers });
      setCart(res.data);
    } catch (err) { console.error(err); }
  };

  const removeItem = async (productId) => {
    try {
      const res = await axios.delete(`${API}/cart/remove/${productId}`, { headers });
      setCart(res.data);
    } catch (err) { console.error(err); }
  };

  const clearCart = async () => {
    try {
      const res = await axios.delete(`${API}/cart/clear`, { headers });
      setCart(res.data);
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/'); };

  return (
    <div className="page-shell">
      <div className="topbar">
        <Link to="/user/portal" className="btn btn-ghost btn-sm">← Home</Link>
        <div className="topbar-center">Shopping Cart</div>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Log Out</button>
      </div>

      <div className="page-content">
        {loading ? (
          <div className="spinner-wrap"><div className="spinner"></div></div>
        ) : !cart || cart.items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <div className="animate-in">
            <div className="glass-table-wrapper">
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <img
                          src={item.product?.image ? `${item.product.image}` : 'https://placehold.co/48/1a1a2e/6c5ce7?text=·'}
                          alt={item.product?.name}
                        />
                      </td>
                      <td style={{ fontWeight: 600 }}>{item.product?.name}</td>
                      <td>₹{item.product?.price}</td>
                      <td>
                        <select className="quantity-control" value={item.quantity} onChange={(e) => updateQty(item.product._id, e.target.value)}>
                          {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </td>
                      <td style={{ fontWeight: 600 }}>₹{item.totalPrice}</td>
                      <td>
                        <button className="btn btn-danger-outline btn-sm" onClick={() => removeItem(item.product._id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="summary-bar">
              <div>
                <span className="total-label">Grand Total</span>
                <div className="total-value">₹ {cart.grandTotal}</div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-danger-outline btn-sm" onClick={clearCart}>Clear All</button>
                <button className="btn btn-glow" onClick={() => navigate('/user/checkout')}>Checkout →</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
