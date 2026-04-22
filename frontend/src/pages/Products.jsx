import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = '/api';

export default function Products() {
  const { vendorId } = useParams();
  const [products, setProducts] = useState([]);
  const [vendorName, setVendorName] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => { fetchProducts(); }, [vendorId]);

  const fetchProducts = async () => {
    try {
      const [prodRes, vendorRes] = await Promise.all([
        axios.get(`${API}/products?vendor=${vendorId}`),
        axios.get(`${API}/user/vendors/${vendorId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
      ]);
      setProducts(prodRes.data);
      setVendorName(vendorRes.data.name);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post(`${API}/cart/add`, { productId, quantity: 1 }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/'); };

  return (
    <div className="page-shell">
      <div className="topbar">
        <Link to="/user/portal" className="btn btn-ghost btn-sm">← Home</Link>
        <div className="topbar-center">{vendorName || 'Products'}</div>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Log Out</button>
      </div>

      <div className="page-content">
        <div className="section-header animate-in">
          <h2>Products</h2>
          <span className="section-badge">{products.length} items</span>
        </div>

        {message && <div className="alert alert-success">{message}</div>}

        {loading ? (
          <div className="spinner-wrap"><div className="spinner"></div></div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p>No products available</p>
          </div>
        ) : (
          <div className="cards-grid animate-in">
            {products.map((p) => (
              <div key={p._id} className="glass-card">
                <img src={p.image ? `${p.image}` : 'https://placehold.co/400x200/1a1a2e/6c5ce7?text=Product'} alt={p.name} />
                <div className="card-title">{p.name}</div>
                <div className="card-price">₹ {p.price}</div>
                <button className="btn btn-glow btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => addToCart(p._id)}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
