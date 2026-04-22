import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = '/api';

export default function RequestItem() {
  const [requests, setRequests] = useState([]);
  const [itemName, setItemName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const headers = { Authorization: `Bearer ${user.token}` };

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API}/vendor/requests`, { headers });
      setRequests(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const addRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/vendor/requests`, { itemName, description: '' }, { headers });
      setItemName('');
      fetchRequests();
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/'); };

  return (
    <div className="page-shell">
      <div className="topbar">
        <Link to="/vendor/portal" className="btn btn-ghost btn-sm">← Home</Link>
        <div className="topbar-center">Request Items</div>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Log Out</button>
      </div>

      <div className="page-content">
        <form onSubmit={addRequest} style={{ display: 'flex', gap: '12px', marginBottom: '28px' }} className="animate-in">
          <input
            style={{ flex: 1, padding: '14px 18px', borderRadius: 'var(--radius)', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)', fontSize: '0.95rem' }}
            placeholder="Enter item name to request..."
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-glow">Add Request</button>
        </form>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner"></div></div>
        ) : requests.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📝</div><p>No item requests yet</p></div>
        ) : (
          <div className="request-grid animate-in">
            {requests.map((r) => (
              <div key={r._id} className="request-chip">
                {r.itemName}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
