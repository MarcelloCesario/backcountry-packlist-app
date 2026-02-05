import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { packlistService, gearService } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import Modal from '../components/Modal';

function PackListDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatWeight } = useSettings();
  const [packlist, setPacklist] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [availableGear, setAvailableGear] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [searchGear, setSearchGear] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setError(null);
      const [packlistRes, gearRes] = await Promise.all([
        packlistService.getById(id),
        gearService.getAll()
      ]);
      setPacklist(packlistRes.packlist);
      setAvailableGear(gearRes.items || []);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load pack list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalysis = async () => {
    try {
      const res = await packlistService.analyze(id);
      setAnalysis(res.analysis);
      setShowAnalysis(true);
    } catch (err) {
      console.error('Failed to load analysis:', err);
    }
  };

  const handleAddItem = async (gearItemId) => {
    await packlistService.addItem(id, gearItemId);
    await loadData();
  };

  const handleRemoveItem = async (gearItemId) => {
    await packlistService.removeItem(id, gearItemId);
    await loadData();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalWeight = packlist?.items?.reduce((sum, item) => sum + (item.weight || 0), 0) || 0;

  const itemsNotInList = availableGear
    .filter(gear => !packlist?.items?.some(item => item.id === gear.id))
    .filter(gear =>
      !searchGear ||
      gear.name.toLowerCase().includes(searchGear.toLowerCase()) ||
      (gear.category_name && gear.category_name.toLowerCase().includes(searchGear.toLowerCase()))
    );

  const groupedItems = packlist?.items?.reduce((acc, item) => {
    const category = item.category_name || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {}) || {};

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
              onClick={() => navigate('/packlists')}
              className="text-red-600 hover:text-red-800 text-sm underline mt-1"
            >
              Back to Pack Lists
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!packlist) {
    return null;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/packlists')}
          className="text-mountain-600 hover:text-mountain-900 flex items-center mb-2 transition-colors"
        >
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Pack Lists
        </button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-mountain-900">{packlist.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {packlist.activity_type && (
                <span className="badge badge-primary">{packlist.activity_type}</span>
              )}
              {packlist.date && (
                <span className="badge badge-secondary">{formatDate(packlist.date)}</span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <button onClick={loadAnalysis} className="btn btn-secondary">
              Analyze Kit
            </button>
            <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary">
              Add Gear
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <p className="text-sm text-mountain-600">Total Items</p>
          <p className="text-2xl font-bold text-mountain-900">{packlist.items?.length || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-mountain-600">Total Weight</p>
          <p className="text-2xl font-bold text-mountain-900">{formatWeight(totalWeight)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-mountain-600">Categories</p>
          <p className="text-2xl font-bold text-mountain-900">{Object.keys(groupedItems).length}</p>
        </div>
      </div>

      {/* Items by Category */}
      {packlist.items?.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-mountain-900">{category}</h2>
                <span className="text-sm text-mountain-600 font-medium">
                  {formatWeight(items.reduce((sum, item) => sum + (item.weight || 0), 0))}
                </span>
              </div>
              <div className="divide-y divide-mountain-100">
                {items.map(item => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-mountain-900">{item.name}</p>
                      {item.notes && (
                        <p className="text-sm text-mountain-500 truncate">{item.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 ml-4">
                      <span className="text-sm text-mountain-600 font-medium">{formatWeight(item.weight)}</span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 text-mountain-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Remove from list"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <svg className="mx-auto h-12 w-12 text-mountain-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-mountain-900">No items in this pack list</h3>
          <p className="mt-2 text-mountain-600">Add gear from your inventory to build your pack list</p>
          <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary mt-4">
            Add Gear
          </button>
        </div>
      )}

      {/* Add Gear Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSearchGear('');
        }}
        title="Add Gear to Pack List"
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search gear..."
            value={searchGear}
            onChange={(e) => setSearchGear(e.target.value)}
            className="input"
          />
        </div>
        {itemsNotInList.length > 0 ? (
          <div className="max-h-96 overflow-y-auto -mx-6 px-6">
            <div className="divide-y divide-mountain-100">
              {itemsNotInList.map(item => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-mountain-900">{item.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {item.category_name && (
                        <span className="badge badge-primary text-xs">{item.category_name}</span>
                      )}
                      <span className="text-sm text-mountain-500">{formatWeight(item.weight)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddItem(item.id)}
                    className="btn btn-primary text-sm ml-4"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : availableGear.length === packlist.items?.length ? (
          <p className="text-center text-mountain-600 py-4">
            All your gear is already in this pack list
          </p>
        ) : (
          <p className="text-center text-mountain-600 py-4">
            No matching gear found
          </p>
        )}
      </Modal>

      {/* Analysis Modal */}
      <Modal
        isOpen={showAnalysis}
        onClose={() => setShowAnalysis(false)}
        title="Kit Analysis"
      >
        {analysis && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-50 rounded-lg p-4">
                <p className="text-sm text-primary-700">Total Weight</p>
                <p className="text-xl font-bold text-primary-900">{formatWeight(analysis.totalWeight)}</p>
              </div>
              <div className="bg-mountain-50 rounded-lg p-4">
                <p className="text-sm text-mountain-600">Total Items</p>
                <p className="text-xl font-bold text-mountain-900">{analysis.itemCount}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-mountain-900 mb-3">Weight by Category</h4>
              <div className="space-y-3">
                {analysis.categoryBreakdown.map((cat, idx) => {
                  const percentage = analysis.totalWeight > 0
                    ? (parseFloat(cat.category_weight) / analysis.totalWeight) * 100
                    : 0;
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-mountain-700">{cat.category || 'Uncategorized'}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-mountain-500">{cat.item_count} items</span>
                          <span className="font-medium text-mountain-900">{formatWeight(parseFloat(cat.category_weight))}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-mountain-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {analysis.heaviestItems.length > 0 && (
              <div>
                <h4 className="font-medium text-mountain-900 mb-3">Heaviest Items</h4>
                <div className="space-y-2">
                  {analysis.heaviestItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-mountain-50 rounded-lg p-3">
                      <span className="text-mountain-700">{item.name}</span>
                      <span className="font-medium text-mountain-900">{formatWeight(item.weight)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default PackListDetail;
