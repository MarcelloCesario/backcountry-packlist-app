import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gearService, categoryService } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import Modal from '../components/Modal';
import GearItemCard from '../components/GearItemCard';
import GearForm from '../components/GearForm';

function GearList() {
  const { formatWeight } = useSettings();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filter, setFilter] = useState({ category: '', activityType: '', search: '', wishlistOnly: false });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const [gearRes, catRes, typesRes] = await Promise.all([
        gearService.getAll(),
        categoryService.getAll(),
        categoryService.getActivityTypes()
      ]);
      setItems(gearRes.items || []);
      setCategories(catRes.categories || []);
      setActivityTypes(typesRes.activityTypes || []);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load gear data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    await gearService.create(data);
    await loadData();
    setIsModalOpen(false);
  };

  const handleUpdate = async (data) => {
    await gearService.update(editingItem.id, data);
    await loadData();
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await gearService.delete(id);
      await loadData();
    }
  };

  const handleToggleWishlist = async (id) => {
    await gearService.toggleWishlist(id);
    await loadData();
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const clearFilters = () => {
    setFilter({ category: '', activityType: '', search: '', wishlistOnly: false });
  };

  // Filter categories by activity type
  const filteredCategories = filter.activityType
    ? categories.filter(cat => cat.activity_type === filter.activityType)
    : categories;

  const filteredItems = items.filter(item => {
    const matchesCategory = !filter.category || item.category_id === parseInt(filter.category);
    const matchesActivityType = !filter.activityType || item.activity_type === filter.activityType;
    const matchesSearch = !filter.search ||
      item.name.toLowerCase().includes(filter.search.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(filter.search.toLowerCase()));
    const matchesWishlist = !filter.wishlistOnly || item.in_wishlist;
    return matchesCategory && matchesActivityType && matchesSearch && matchesWishlist;
  });

  const totalWeight = filteredItems.reduce((sum, item) => sum + (item.weight || 0), 0);
  const hasActiveFilters = filter.category || filter.activityType || filter.search || filter.wishlistOnly;

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
              onClick={loadData}
              className="text-red-600 hover:text-red-800 text-sm underline mt-1"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-mountain-900">Gear Inventory</h1>
          <p className="text-mountain-600 mt-1">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            {hasActiveFilters && ` (filtered from ${items.length})`}
            {' '} | Total: {formatWeight(totalWeight)}
          </p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary whitespace-nowrap">
          Add Gear
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-mountain-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search gear..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                className="input"
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-sm font-medium text-mountain-700 mb-1">Activity Type</label>
              <select
                value={filter.activityType}
                onChange={(e) => setFilter({ ...filter, activityType: e.target.value, category: '' })}
                className="input"
              >
                <option value="">All Activities</option>
                {activityTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-56">
              <label className="block text-sm font-medium text-mountain-700 mb-1">Category</label>
              <select
                value={filter.category}
                onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                className="input"
              >
                <option value="">All Categories</option>
                {filteredCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filter.wishlistOnly}
                onChange={(e) => setFilter({ ...filter, wishlistOnly: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-mountain-300 rounded"
              />
              <span className="text-sm text-mountain-700">Wishlist items only</span>
            </label>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gear List */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <GearItemCard
              key={item.id}
              item={item}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onToggleWishlist={handleToggleWishlist}
            />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <svg className="mx-auto h-12 w-12 text-mountain-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-mountain-900">No gear found</h3>
          <p className="mt-2 text-mountain-600">
            {hasActiveFilters
              ? 'Try adjusting your filters'
              : 'Get started by adding your first piece of gear'}
          </p>
          {hasActiveFilters ? (
            <button onClick={clearFilters} className="btn btn-secondary mt-4">
              Clear Filters
            </button>
          ) : (
            <button onClick={openCreateModal} className="btn btn-primary mt-4">
              Add Your First Gear
            </button>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'Edit Gear' : 'Add New Gear'}
      >
        <GearForm
          item={editingItem}
          categories={categories}
          onSubmit={editingItem ? handleUpdate : handleCreate}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
        />
      </Modal>
    </div>
  );
}

export default GearList;
