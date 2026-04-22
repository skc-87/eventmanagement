import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function GuestList() {
  const [guests, setGuests] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const addGuest = (e) => {
    e.preventDefault();
    if (!name) return;
    setGuests([...guests, { id: Date.now(), name, email, phone }]);
    setName(''); setEmail(''); setPhone('');
  };

  const removeGuest = (id) => setGuests(guests.filter(g => g.id !== id));

  return (
    <div className="page-shell">
      <div className="topbar">
        <Link to="/user/portal" className="btn btn-ghost btn-sm">← Home</Link>
        <div className="topbar-center">Guest List</div>
        <button className="btn btn-ghost btn-sm" onClick={() => { localStorage.removeItem('user'); navigate('/'); }}>Log Out</button>
      </div>

      <div className="page-content">
        <form onSubmit={addGuest} style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }} className="animate-in">
          <input className="field-group" style={{ flex: 1, minWidth: '150px', padding: '12px 18px', borderRadius: 'var(--radius)', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)' }} placeholder="Guest Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="field-group" style={{ flex: 1, minWidth: '150px', padding: '12px 18px', borderRadius: 'var(--radius)', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)' }} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="field-group" style={{ flex: 1, minWidth: '150px', padding: '12px 18px', borderRadius: 'var(--radius)', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)' }} placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <button type="submit" className="btn btn-glow">Add Guest</button>
        </form>

        {guests.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">👥</div><p>No guests added yet</p></div>
        ) : (
          <div className="glass-table-wrapper animate-in">
            <table className="glass-table">
              <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Action</th></tr></thead>
              <tbody>
                {guests.map((g, i) => (
                  <tr key={g.id}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{g.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{g.email}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{g.phone}</td>
                    <td><button className="btn btn-danger-outline btn-sm" onClick={() => removeGuest(g.id)}>Remove</button></td>
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
