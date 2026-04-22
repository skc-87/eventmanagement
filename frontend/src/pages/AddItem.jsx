import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const API = '/api';

export default function AddItem() {
  const location = useLocation();
  const editProduct = location.state?.edit || null;

  const [name, setName] = useState(editProduct?.name || '');
  const [price, setPrice] = useState(editProduct?.price || '');
  const [image, setImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const headers = { Authorization: `Bearer ${user.token}` };

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/vendor/my-products`, { headers });
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    if (image) formData.append('image', image);

    try {
      if (editProduct) {
        await axios.put(`${API}/products/${editProduct._id}`, formData, {
          headers: { ...headers, 'Content-Type': 'multipart/form-data' }
        });
        setMessage('Product updated!');
      } else {
        await axios.post(`${API}/products`, formData, {
          headers: { ...headers, 'Content-Type': 'multipart/form-data' }
        });
        setMessage('Product added!');
      }
      setName(''); setPrice(''); setImage(null);
      fetchProducts();
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed');
    }
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
          <Link to="/vendor/dashboard" className="btn btn-ghost btn-sm">Products</Link>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Log Out</button>
        </div>
      </div>

      <div className="page-content">
        {message && <div className="alert alert-success">{message}</div>}

        <div className="split-layout animate-in">
          <div className="form-panel">
            <h3>{editProduct ? 'Update Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label>Product Name</label>
                <input placeholder="Enter product name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="field-group">
                <label>Price (₹)</label>
                <input type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>
              <div className="field-group">
                <label>Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={{ padding: '10px' }} />
              </div>
              <button type="submit" className="btn btn-glow" style={{ width: '100%', marginTop: '8px', justifyContent: 'center' }}>
                {editProduct ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>

          <div>
            <div className="section-header">
              <h2>Existing Products</h2>
              <span className="section-badge">{products.length}</span>
            </div>
            {products.length === 0 ? (
              <div className="empty-state"><p style={{ color: 'var(--text-muted)' }}>No products yet</p></div>
            ) : (
              <div className="glass-table-wrapper">
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
                            <button className="btn btn-ghost btn-sm" onClick={() => { setName(p.name); setPrice(p.price); navigate('/vendor/add-item', { state: { edit: p } }); }}>Edit</button>
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
      </div>
    </div>
  );
}
