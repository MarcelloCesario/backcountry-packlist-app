import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mountain-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <svg className="h-16 w-16" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="loginMountainGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#166534' }} />
                  <stop offset="100%" style={{ stopColor: '#22c55e' }} />
                </linearGradient>
              </defs>
              <polygon points="50,10 85,80 15,80" fill="url(#loginMountainGrad)" />
              <polygon points="30,45 55,80 5,80" fill="#15803d" opacity="0.8" />
              <circle cx="80" cy="25" r="8" fill="#fbbf24" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-mountain-900">Backcountry Packlist</h1>
          <p className="text-mountain-600 mt-2">Sign in to manage your gear</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-mountain-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-mountain-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-mountain-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-mountain-500">
          Demo account: demo@example.com / demo1234
        </p>
      </div>
    </div>
  );
}

export default Login;
