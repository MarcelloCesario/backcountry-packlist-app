import { useState, useEffect } from 'react';
import { categoryService } from '../services/api';
import Modal from '../components/Modal';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', activityType: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [catRes, typesRes] = await Promise.all([
        categoryService.getAll(),
        categoryService.getActivityTypes()
      ]);
      setCategories(catRes.categories);
      setActivityTypes(typesRes.activityTypes);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.activityType.trim()) {
      setError('Activity type is required');
      return;
    }

    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
      } else {
        await categoryService.create(formData);
      }
      await loadData();
      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category? Gear items in this category will be uncategorized.')) {
      await categoryService.delete(id);
      await loadData();
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', activityType: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      activityType: category.activity_type || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', activityType: '' });
    setError('');
  };

  const groupedCategories = categories.reduce((acc, cat) => {
    const type = cat.activity_type || 'other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(cat);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-mountain-900">Categories</h1>
          <p className="text-mountain-600 mt-1">{categories.length} categories across {activityTypes.length} activity types</p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          Add Category
        </button>
      </div>

      {Object.keys(groupedCategories).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedCategories).map(([activityType, cats]) => (
            <div key={activityType} className="card">
              <h2 className="text-lg font-semibold text-mountain-900 mb-4 capitalize">
                {activityType.replace('_', ' ')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {cats.map(category => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 bg-mountain-50 rounded-lg"
                  >
                    <span className="font-medium text-mountain-900">{category.name}</span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openEditModal(category)}
                        className="p-1.5 text-mountain-400 hover:text-primary-600 hover:bg-white rounded transition-colors"
                        title="Edit"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-1.5 text-mountain-400 hover:text-red-600 hover:bg-white rounded transition-colors"
                        title="Delete"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-mountain-900">No categories yet</h3>
          <p className="mt-2 text-mountain-600">Create categories to organize your gear</p>
          <button onClick={openCreateModal} className="btn btn-primary mt-4">
            Create Your First Category
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              placeholder="e.g., Climbing Hardware"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-1">
              Activity Type *
            </label>
            <div className="space-y-2">
              <select
                value={formData.activityType}
                onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                className="input"
              >
                <option value="">Select or enter new</option>
                {activityTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <input
                type="text"
                value={formData.activityType}
                onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                className="input"
                placeholder="Or enter a new activity type"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={closeModal} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingCategory ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Categories;
