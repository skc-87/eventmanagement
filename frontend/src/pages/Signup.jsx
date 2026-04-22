import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = '/api';

export default function Signup() {
  const [role, setRole] = useState('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('Catering');
  const [contactDetails, setContactDetails] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { name, email, password, role };
      if (role === 'vendor') {
        payload.category = category;
        payload.contactDetails = contactDetails;
      }
      const res = await axios.post(`${API}/auth/signup`, payload);
      localStorage.setItem('user', JSON.stringify(res.data));
      switch (res.data.role) {
        case 'admin': navigate('/admin/portal'); break;
        case 'vendor': navigate('/vendor/portal'); break;
        default: navigate('/user/portal'); break;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-scene">
      <div className="auth-panel">
        <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--accent-light)', marginBottom: '20px', display: 'inline-block' }}>
          ← Back to Login
        </Link>

        <h1>Create Account</h1>
        <p className="subtitle">Register a new account</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSignup}>
          <div className="field-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="vendor">Vendor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="field-group">
            <label>Full Name</label>
            <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="field-group">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="field-group">
            <label>Password</label>
            <input type="password" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>

          {role === 'vendor' && (
            <>
              <div className="field-group animate-in">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Catering">Catering</option>
                  <option value="Florist">Florist</option>
                  <option value="Decoration">Decoration</option>
                  <option value="Lighting">Lighting</option>
                </select>
              </div>
              <div className="field-group animate-in">
                <label>Contact Details</label>
                <input type="text" placeholder="Phone or address" value={contactDetails} onChange={(e) => setContactDetails(e.target.value)} required />
              </div>
            </>
          )}

          <button
            type="submit"
            className="btn btn-glow btn-lg"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating…' : 'Create Account →'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
