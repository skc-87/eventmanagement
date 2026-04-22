import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = '/api';

export default function VendorPage() {
  const { category } = useParams();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => { fetchVendors(); }, [category]);

  const fetchVendors = async () => {
    try {
      const res = await axios.get(`${API}/user/vendors?category=${category}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setVendors(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/'); };

  return (
    <div className="page-shell">
      <div className="topbar">
        <Link to="/user/portal" className="btn btn-ghost btn-sm">← Home</Link>
        <div className="topbar-center">{category} Vendors</div>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Log Out</button>
      </div>

      <div className="page-content">
        <div className="section-header animate-in">
          <h2>{category} Vendors</h2>
          <span className="section-badge">{vendors.length} found</span>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner"></div></div>
        ) : vendors.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p>No vendors found in {category}</p>
          </div>
        ) : (
          <div className="cards-grid animate-in">
            {vendors.map((v) => (
              <div key={v._id} className="glass-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--gradient-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                    🏪
                  </div>
                  <div>
                    <div className="card-title">{v.name}</div>
                    <div className="card-subtitle">{v.contactDetails || 'No contact info'}</div>
                  </div>
                </div>
                <button className="btn btn-glow btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate(`/user/products/${v._id}`)}>
                  Shop Items →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
