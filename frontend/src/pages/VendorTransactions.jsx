import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = '/api';

const statusBadge = (s) => {
  const map = { Pending: 'badge-pending', Processing: 'badge-processing', Shipped: 'badge-shipped', Delivered: 'badge-delivered', Cancelled: 'badge-cancelled' };
  return <span className={`badge ${map[s] || 'badge-pending'}`}>{s}</span>;
};

export default function VendorTransactions() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const headers = { Authorization: `Bearer ${user.token}` };

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/vendor/orders`, { headers });
      setOrders(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-shell">
      <div className="topbar">
        <Link to="/vendor/portal" className="btn btn-ghost btn-sm">← Home</Link>
        <div className="topbar-center">Transactions</div>
        <button className="btn btn-ghost btn-sm" onClick={() => { localStorage.removeItem('user'); navigate('/'); }}>Log Out</button>
      </div>

      <div className="page-content">
        <div className="section-header animate-in">
          <h2>Transaction History</h2>
          <span className="section-badge">{orders.length} records</span>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner"></div></div>
        ) : orders.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">💳</div><p>No transactions yet</p></div>
        ) : (
          <div className="glass-table-wrapper animate-in">
            <table className="glass-table">
              <thead><tr><th>#</th><th>Customer</th><th>Items</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={o._id}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{o.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{o.items.map(it => it.name).join(', ')}</td>
                    <td style={{ fontWeight: 600 }}>₹{o.totalAmount}</td>
                    <td>{o.paymentMethod}</td>
                    <td>{statusBadge(o.status)}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
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
