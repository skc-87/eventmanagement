import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'Catering', icon: '🍽️', desc: 'Food & beverages' },
  { name: 'Florist', icon: '💐', desc: 'Flowers & bouquets' },
  { name: 'Decoration', icon: '✨', desc: 'Venue decor' },
  { name: 'Lighting', icon: '💡', desc: 'Event lighting' },
];

export default function UserPortal() {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="page-shell">
      <div className="topbar">
        <div className="topbar-brand">EventFlow</div>
        <div className="topbar-center">User Dashboard</div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Log Out</button>
        </div>
      </div>

      <div className="page-content">
        <div className="portal-hero animate-in">
          <h1>Welcome, <span className="greeting">{user?.name || 'User'}</span></h1>
          <p>Your Dashboard</p>
        </div>

        <div className="portal-grid animate-in">
          <div className="dropdown-wrap">
            <div className="portal-tile" onClick={() => setShowDropdown(!showDropdown)}>
              <span className="tile-icon">🏪</span>
              <span className="tile-label">Browse Vendors</span>
              <span className="tile-desc">Find services by category</span>
            </div>
            {showDropdown && (
              <div className="dropdown-list">
                {categories.map((cat) => (
                  <div
                    key={cat.name}
                    className="dd-item"
                    onClick={() => { setShowDropdown(false); navigate(`/user/vendors/${cat.name}`); }}
                  >
                    <span>{cat.icon}</span> {cat.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="portal-tile" onClick={() => navigate('/user/cart')}>
            <span className="tile-icon">🛒</span>
            <span className="tile-label">My Cart</span>
            <span className="tile-desc">View & manage cart items</span>
          </div>

          <div className="portal-tile" onClick={() => navigate('/user/guests')}>
            <span className="tile-icon">👥</span>
            <span className="tile-label">Guest List</span>
            <span className="tile-desc">Manage event guests</span>
          </div>

          <div className="portal-tile" onClick={() => navigate('/user/orders')}>
            <span className="tile-icon">📦</span>
            <span className="tile-label">Order Status</span>
            <span className="tile-desc">Track your orders</span>
          </div>
        </div>
      </div>
    </div>
  );
}
