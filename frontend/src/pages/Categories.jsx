import { useState, useEffect } from 'react';
import { categoryService } from '../services/api';
import Modal from '../components/Modal';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', activityType: '', customActivityType: '' });
  const [formError, setFormError] = useState('');
  const [useCustomActivity, setUseCustomActivity] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const [catRes, typesRes] = await Promise.all([
        categoryService.getAll(),
        categoryService.getActivityTypes()
      ]);
      setCategories(catRes.categories || []);
      setActivityTypes(typesRes.activityTypes || []);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Name is required');
      return;
    }

    const activityType = useCustomActivity ? formData.customActivityType : formData.activityType;
    if (!activityType.trim()) {
      setFormError('Activity type is required');
      return;
    }

    try {
      const data = { name: formData.name, activityType };
      if (editingCategory) {
        await categoryService.update(editingCategory.id, data);
      } else {
        await categoryService.create(data);
      }
      await loadData();
      closeModal();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category? Gear items in this category will be uncategorized.')) {
      try {
        await categoryService.delete(id);
        await loadData();
      } catch (err) {
        console.error('Failed to delete category:', err);
      }
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', activityType: '', customActivityType: '' });
    setUseCustomActivity(false);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    const isCustom = !activityTypes.includes(category.activity_type);
    setFormData({
      name: category.name || '',
      activityType: isCustom ? '' : category.activity_type || '',
      customActivityType: isCustom ? category.activity_type || '' : ''
    });
    setUseCustomActivity(isCustom);
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', activityType: '', customActivityType: '' });
    setUseCustomActivity(false);
    setFormError('');
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-mountain-900">Categories</h1>
          <p className="text-mountain-600 mt-1">
            {categories.length} {categories.length === 1 ? 'category' : 'categories'} across {Object.keys(groupedCategories).length} activity {Object.keys(groupedCategories).length === 1 ? 'type' : 'types'}
          </p>
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
                {activityType.replace(/_/g, ' ')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {cats.map(category => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 bg-mountain-50 rounded-lg group hover:bg-mountain-100 transition-colors"
                  >
                    <span className="font-medium text-mountain-900">{category.name}</span>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
          {formError && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {formError}
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
            {!useCustomActivity ? (
              <div className="space-y-2">
                <select
                  value={formData.activityType}
                  onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                  className="input"
                >
                  <option value="">Select an activity type</option>
                  {activityTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setUseCustomActivity(true)}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + Create new activity type
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={formData.customActivityType}
                  onChange={(e) => setFormData({ ...formData, customActivityType: e.target.value })}
                  className="input"
                  placeholder="Enter new activity type"
                />
                <button
                  type="button"
                  onClick={() => {
                    setUseCustomActivity(false);
                    setFormData({ ...formData, customActivityType: '' });
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Select from existing types
                </button>
              </div>
            )}
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
