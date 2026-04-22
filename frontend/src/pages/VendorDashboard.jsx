import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = '/api';

export default function VendorDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const headers = { Authorization: `Bearer ${user.token}` };

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/vendor/my-products`, { headers });
      setProducts(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API}/products/${id}`, { headers });
      setProducts(products.filter(p => p._id !== id));
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/'); };

  return (
    <div className="page-shell">
      <div className="topbar">
        <Link to="/vendor/portal" className="btn btn-ghost btn-sm">← Home</Link>
        <div className="topbar-center">Welcome, {user.name}</div>
        <div className="topbar-actions">
          <Link to="/vendor/product-status" className="btn btn-ghost btn-sm">Status</Link>
          <Link to="/vendor/requests" className="btn btn-ghost btn-sm">Requests</Link>
          <Link to="/vendor/add-item" className="btn btn-glow btn-sm">+ Add Item</Link>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Log Out</button>
        </div>
      </div>

      <div className="page-content">
        <div className="section-header animate-in">
          <h2>My Products</h2>
          <span className="section-badge">{products.length} items</span>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner"></div></div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p>No products yet. <Link to="/vendor/add-item" style={{ color: 'var(--accent-light)' }}>Add one!</Link></p>
          </div>
        ) : (
          <div className="glass-table-wrapper animate-in">
            <table className="glass-table">
              <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td><img src={p.image ? `${p.image}` : 'https://placehold.co/48/1a1a2e/6c5ce7?text=·'} alt={p.name} /></td>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>₹{p.price}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/vendor/add-item', { state: { edit: p } })}>Edit</button>
                        <button className="btn btn-danger-outline btn-sm" onClick={() => deleteProduct(p._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
