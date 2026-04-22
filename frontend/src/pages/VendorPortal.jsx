import { useNavigate } from 'react-router-dom';

export default function VendorPortal() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => { localStorage.removeItem('user'); navigate('/'); };

  return (
    <div className="page-shell">
      <div className="topbar">
        <div className="topbar-brand">EventFlow</div>
        <div className="topbar-center">Vendor Portal</div>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Log Out</button>
      </div>

      <div className="page-content">
        <div className="portal-hero animate-in">
          <h1>Welcome, <span className="greeting">{user?.name || 'Vendor'}</span></h1>
          <p>Your Dashboard</p>
        </div>

        <div className="portal-grid animate-in">
          <div className="portal-tile" onClick={() => navigate('/vendor/dashboard')}>
            <span className="tile-icon">📋</span>
            <span className="tile-label">My Products</span>
            <span className="tile-desc">View & manage items</span>
          </div>
          <div className="portal-tile" onClick={() => navigate('/vendor/add-item')}>
            <span className="tile-icon">➕</span>
            <span className="tile-label">Add New Item</span>
            <span className="tile-desc">List a new product</span>
          </div>
          <div className="portal-tile" onClick={() => navigate('/vendor/transactions')}>
            <span className="tile-icon">💳</span>
            <span className="tile-label">Transactions</span>
            <span className="tile-desc">View order history</span>
          </div>
          <div className="portal-tile" onClick={() => navigate('/vendor/requests')}>
            <span className="tile-icon">📝</span>
            <span className="tile-label">Request Items</span>
            <span className="tile-desc">Submit item requests</span>
          </div>
          <div className="portal-tile" onClick={() => navigate('/vendor/product-status')}>
            <span className="tile-icon">📊</span>
            <span className="tile-label">Product Status</span>
            <span className="tile-desc">Track order statuses</span>
          </div>
        </div>
      </div>
    </div>
  );
}
