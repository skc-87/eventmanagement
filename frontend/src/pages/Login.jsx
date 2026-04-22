import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = '/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      localStorage.setItem('user', JSON.stringify(res.data));
      switch (res.data.role) {
        case 'admin': navigate('/admin/portal'); break;
        case 'vendor': navigate('/vendor/portal'); break;
        default: navigate('/user/portal'); break;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-scene">
      <div className="auth-panel">
        <h1>EventFlow</h1>
        <p className="subtitle">Sign in to manage your events</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="field-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="field-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-glow btn-lg"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Create one</Link>
        </div>
      </div>
    </div>
  );
}
