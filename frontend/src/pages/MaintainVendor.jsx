import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = '/api';

export default function MaintainVendor() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const headers = { Authorization: `Bearer ${user.token}` };

  useEffect(() => { fetchVendors(); }, []);

  const fetchVendors = async () => {
    try {
      const res = await axios.get(`${API}/admin/vendors`, { headers });
      setVendors(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const approveVendor = async (id) => {
    try {
      await axios.put(`${API}/admin/vendors/${id}/approve`, {}, { headers });
      fetchVendors();
    } catch (err) { console.error(err); }
  };

  const deleteVendor = async (id) => {
    try {
      await axios.delete(`${API}/admin/vendors/${id}`, { headers });
      setVendors(vendors.filter(v => v._id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="page-shell">
      <div className="topbar">
        <Link to="/admin/portal" className="btn btn-ghost btn-sm">← Home</Link>
        <div className="topbar-center">Manage Vendors</div>
        <button className="btn btn-ghost btn-sm" onClick={() => { localStorage.removeItem('user'); navigate('/'); }}>Log Out</button>
      </div>

      <div className="page-content">
        <div className="section-header animate-in">
          <h2>All Vendors</h2>
          <span className="section-badge">{vendors.length} vendors</span>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner"></div></div>
        ) : vendors.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">🏪</div><p>No vendors found</p></div>
        ) : (
          <div className="glass-table-wrapper animate-in">
            <table className="glass-table">
              <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Category</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {vendors.map((v, i) => (
                  <tr key={v._id}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{v.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{v.email}</td>
                    <td>{v.category}</td>
                    <td>
                      <span className={`badge ${v.isApproved ? 'badge-approved' : 'badge-pending'}`}>
                        {v.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {!v.isApproved && (
                          <button className="btn btn-success-outline btn-sm" onClick={() => approveVendor(v._id)}>Approve</button>
                        )}
                        <button className="btn btn-danger-outline btn-sm" onClick={() => deleteVendor(v._id)}>Delete</button>
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
