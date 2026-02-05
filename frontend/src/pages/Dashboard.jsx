import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gearService, packlistService, wishlistService } from '../services/api';
import { useSettings } from '../context/SettingsContext';

function Dashboard() {
  const { formatWeight } = useSettings();
  const [stats, setStats] = useState({
    totalGear: 0,
    totalWeight: 0,
    packLists: 0,
    wishlistItems: 0
  });
  const [recentPacklists, setRecentPacklists] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [heaviestItems, setHeaviestItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setError(null);
      const [gearRes, packlistRes, wishlistRes] = await Promise.all([
        gearService.getAll(),
        packlistService.getAll(),
        wishlistService.getAll()
      ]);

      const items = gearRes.items || [];
      const totalWeight = items.reduce((sum, item) => sum + (item.weight || 0), 0);

      setStats({
        totalGear: items.length,
        totalWeight,
        packLists: (packlistRes.packlists || []).length,
        wishlistItems: (wishlistRes.items || []).length
      });

      setRecentPacklists((packlistRes.packlists || []).slice(0, 5));

      // Calculate category breakdown
      const categoryMap = new Map();
      items.forEach(item => {
        const catName = item.category_name || 'Uncategorized';
        if (!categoryMap.has(catName)) {
          categoryMap.set(catName, { name: catName, count: 0, weight: 0 });
        }
        const cat = categoryMap.get(catName);
        cat.count += 1;
        cat.weight += item.weight || 0;
      });

      const breakdown = Array.from(categoryMap.values())
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 6);
      setCategoryBreakdown(breakdown);

      // Get heaviest items
      const heaviest = [...items]
        .filter(item => item.weight > 0)
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 5);
      setHeaviestItems(heaviest);

    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-50 border-red-200">
        <div className="flex items-center space-x-3">
          <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-red-800 font-medium">{error}</p>
            <button
              onClick={loadDashboardData}
              className="text-red-600 hover:text-red-800 text-sm underline mt-1"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const maxWeight = categoryBreakdown.length > 0
    ? Math.max(...categoryBreakdown.map(c => c.weight))
    : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-mountain-900 mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link to="/gear" className="card hover:shadow-md transition-shadow group">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-mountain-600">Total Gear Items</p>
              <p className="text-2xl font-bold text-mountain-900">{stats.totalGear}</p>
            </div>
          </div>
        </Link>

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

        <Link to="/packlists" className="card hover:shadow-md transition-shadow group">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-mountain-600">Pack Lists</p>
              <p className="text-2xl font-bold text-mountain-900">{stats.packLists}</p>
            </div>
          </div>
        </Link>

        <Link to="/wishlist" className="card hover:shadow-md transition-shadow group">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
              <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-mountain-600">Wishlist Items</p>
              <p className="text-2xl font-bold text-mountain-900">{stats.wishlistItems}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Kit Analysis */}
        <div className="card">
          <h2 className="text-lg font-semibold text-mountain-900 mb-4">Kit Analysis</h2>
          {categoryBreakdown.length > 0 ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-mountain-700 mb-3">Weight by Category</h3>
                <div className="space-y-3">
                  {categoryBreakdown.map((cat, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-mountain-700">{cat.name}</span>
                        <span className="text-mountain-900 font-medium">
                          {formatWeight(cat.weight)} ({cat.count} items)
                        </span>
                      </div>
                      <div className="h-2 bg-mountain-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all duration-500"
                          style={{ width: `${maxWeight > 0 ? (cat.weight / maxWeight) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {heaviestItems.length > 0 && (
                <div className="pt-4 border-t border-mountain-100">
                  <h3 className="text-sm font-medium text-mountain-700 mb-3">Heaviest Items</h3>
                  <div className="space-y-2">
                    {heaviestItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-mountain-700 truncate flex-1 mr-2">{item.name}</span>
                        <span className="text-mountain-900 font-medium flex-shrink-0">
                          {formatWeight(item.weight)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-mountain-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="mt-4 text-mountain-500">Add gear to see your kit analysis</p>
              <Link to="/gear" className="btn btn-primary mt-4 inline-block">
                Add Gear
              </Link>
            </div>
          )}
        </div>

        {/* Recent Pack Lists */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-mountain-900">Recent Pack Lists</h2>
            <Link to="/packlists" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all
            </Link>
          </div>
          {recentPacklists.length > 0 ? (
            <div className="space-y-2">
              {recentPacklists.map(packlist => (
                <Link
                  key={packlist.id}
                  to={`/packlists/${packlist.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-mountain-50 transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-mountain-900 group-hover:text-primary-600 transition-colors truncate">
                      {packlist.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {packlist.activity_type && (
                        <span className="badge badge-primary">{packlist.activity_type}</span>
                      )}
                      <span className="text-sm text-mountain-500">
                        {packlist.item_count} items
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-mountain-600 ml-4 flex-shrink-0">
                    {formatWeight(parseFloat(packlist.total_weight))}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-mountain-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-4 text-mountain-500">No pack lists yet</p>
              <Link to="/packlists" className="btn btn-primary mt-4 inline-block">
                Create Pack List
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-mountain-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Link
            to="/gear"
            className="flex items-center p-4 rounded-lg border border-mountain-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
          >
            <div className="p-2 bg-primary-100 rounded-lg mr-4 group-hover:bg-primary-200 transition-colors">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-mountain-900">Add New Gear</p>
              <p className="text-sm text-mountain-500">Add equipment to inventory</p>
            </div>
          </Link>

          <Link
            to="/packlists"
            className="flex items-center p-4 rounded-lg border border-mountain-200 hover:border-purple-300 hover:bg-purple-50 transition-colors group"
          >
            <div className="p-2 bg-purple-100 rounded-lg mr-4 group-hover:bg-purple-200 transition-colors">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-mountain-900">Create Pack List</p>
              <p className="text-sm text-mountain-500">Build a list for your trip</p>
            </div>
          </Link>

          <Link
            to="/categories"
            className="flex items-center p-4 rounded-lg border border-mountain-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
          >
            <div className="p-2 bg-blue-100 rounded-lg mr-4 group-hover:bg-blue-200 transition-colors">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            </div>
            <div>
              <p className="font-medium text-mountain-900">Manage Categories</p>
              <p className="text-sm text-mountain-500">Organize your gear</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
