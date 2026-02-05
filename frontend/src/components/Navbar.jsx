import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/gear', label: 'Gear' },
    { path: '/packlists', label: 'Pack Lists' },
    { path: '/wishlist', label: 'Wishlist' },
    { path: '/categories', label: 'Categories' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-mountain-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <svg className="h-8 w-8" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="navMountainGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#166534' }} />
                    <stop offset="100%" style={{ stopColor: '#22c55e' }} />
                  </linearGradient>
                </defs>
                <polygon points="50,10 85,80 15,80" fill="url(#navMountainGrad)" />
                <polygon points="30,45 55,80 5,80" fill="#15803d" opacity="0.8" />
                <circle cx="80" cy="25" r="8" fill="#fbbf24" />
              </svg>
              <span className="font-bold text-xl text-mountain-900">Backcountry</span>
            </Link>

            <div className="hidden md:flex ml-10 space-x-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-mountain-600 hover:bg-mountain-100 hover:text-mountain-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-mountain-600">{user?.email}</span>
            <button
              onClick={logout}
              className="btn btn-secondary text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden pb-3">
          <div className="flex flex-wrap gap-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-mountain-600 hover:bg-mountain-100 hover:text-mountain-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
