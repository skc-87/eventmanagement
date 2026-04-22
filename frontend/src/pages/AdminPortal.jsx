import { useNavigate } from 'react-router-dom';

export default function AdminPortal() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/'); };

  return (
    <div className="page-shell">
      <div className="topbar">
        <div className="topbar-brand">EventFlow</div>
        <div className="topbar-center">Admin Panel</div>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Log Out</button>
      </div>

      <div className="page-content">
        <div className="portal-hero animate-in">
          <h1>Welcome, <span className="greeting">{user?.name || 'Admin'}</span></h1>
          <p>Your Dashboard</p>
        </div>

        <div className="portal-grid animate-in">
          <div className="portal-tile" onClick={() => navigate('/admin/users')}>
            <span className="tile-icon">👤</span>
            <span className="tile-label">Manage Users</span>
            <span className="tile-desc">View & remove users</span>
          </div>
          <div className="portal-tile" onClick={() => navigate('/admin/vendors')}>
            <span className="tile-icon">🏪</span>
            <span className="tile-label">Manage Vendors</span>
            <span className="tile-desc">Approve & manage vendors</span>
          </div>
        </div>
      </div>
    </div>
  );
}
