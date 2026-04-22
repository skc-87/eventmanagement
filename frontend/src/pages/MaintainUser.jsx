import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = '/api';

export default function MaintainUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const headers = { Authorization: `Bearer ${user.token}` };

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/admin/users`, { headers });
      setUsers(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API}/admin/users/${id}`, { headers });
      setUsers(users.filter(u => u._id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="page-shell">
      <div className="topbar">
        <Link to="/admin/portal" className="btn btn-ghost btn-sm">← Home</Link>
        <div className="topbar-center">Manage Users</div>
        <button className="btn btn-ghost btn-sm" onClick={() => { localStorage.removeItem('user'); navigate('/'); }}>Log Out</button>
      </div>

      <div className="page-content">
        <div className="section-header animate-in">
          <h2>All Users</h2>
          <span className="section-badge">{users.length} users</span>
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner"></div></div>
        ) : users.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">👤</div><p>No users found</p></div>
        ) : (
          <div className="glass-table-wrapper animate-in">
            <table className="glass-table">
              <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Joined</th><th>Action</th></tr></thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u._id}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td><button className="btn btn-danger-outline btn-sm" onClick={() => deleteUser(u._id)}>Delete</button></td>
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
