import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gearService, packlistService, wishlistService } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalGear: 0,
    totalWeight: 0,
    packLists: 0,
    wishlistItems: 0
  });
  const [recentPacklists, setRecentPacklists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [gearRes, packlistRes, wishlistRes] = await Promise.all([
        gearService.getAll(),
        packlistService.getAll(),
        wishlistService.getAll()
      ]);

      const totalWeight = gearRes.items.reduce((sum, item) => sum + (item.weight || 0), 0);

      setStats({
        totalGear: gearRes.items.length,
        totalWeight,
        packLists: packlistRes.packlists.length,
        wishlistItems: wishlistRes.items.length
      });

      setRecentPacklists(packlistRes.packlists.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatWeight = (weight) => {
    if (weight >= 1000) {
      return `${(weight / 1000).toFixed(2)} kg`;
    }
    return `${weight} g`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-mountain-900 mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-mountain-600">Total Gear Items</p>
              <p className="text-2xl font-bold text-mountain-900">{stats.totalGear}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-mountain-600">Total Weight</p>
              <p className="text-2xl font-bold text-mountain-900">{formatWeight(stats.totalWeight)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-mountain-600">Pack Lists</p>
              <p className="text-2xl font-bold text-mountain-900">{stats.packLists}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-lg">
              <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-mountain-600">Wishlist Items</p>
              <p className="text-2xl font-bold text-mountain-900">{stats.wishlistItems}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-mountain-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              to="/gear"
              className="flex items-center p-3 rounded-lg hover:bg-mountain-50 transition-colors"
            >
              <div className="p-2 bg-primary-100 rounded-lg mr-3">
                <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-mountain-900">Add New Gear</p>
                <p className="text-sm text-mountain-500">Add equipment to your inventory</p>
              </div>
            </Link>

            <Link
              to="/packlists"
              className="flex items-center p-3 rounded-lg hover:bg-mountain-50 transition-colors"
            >
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-mountain-900">Create Pack List</p>
                <p className="text-sm text-mountain-500">Build a list for your next trip</p>
              </div>
            </Link>

            <Link
              to="/wishlist"
              className="flex items-center p-3 rounded-lg hover:bg-mountain-50 transition-colors"
            >
              <div className="p-2 bg-amber-100 rounded-lg mr-3">
                <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-mountain-900">View Wishlist</p>
                <p className="text-sm text-mountain-500">See gear you want to buy</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-mountain-900 mb-4">Recent Pack Lists</h2>
          {recentPacklists.length > 0 ? (
            <div className="space-y-2">
              {recentPacklists.map(packlist => (
                <Link
                  key={packlist.id}
                  to={`/packlists/${packlist.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-mountain-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-mountain-900">{packlist.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {packlist.activity_type && (
                        <span className="badge badge-primary">{packlist.activity_type}</span>
                      )}
                      <span className="text-sm text-mountain-500">
                        {packlist.item_count} items
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-mountain-600">
                    {formatWeight(parseFloat(packlist.total_weight))}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-mountain-500 text-center py-4">
              No pack lists yet. Create your first one!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
