import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { packlistService, categoryService } from '../services/api';
import Modal from '../components/Modal';

function PackLists() {
  const [packlists, setPacklists] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPacklist, setEditingPacklist] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    activityType: '',
    date: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [packlistRes, typesRes] = await Promise.all([
        packlistService.getAll(),
        categoryService.getActivityTypes()
      ]);
      setPacklists(packlistRes.packlists);
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

    try {
      if (editingPacklist) {
        await packlistService.update(editingPacklist.id, formData);
      } else {
        await packlistService.create(formData);
      }
      await loadData();
      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this pack list?')) {
      await packlistService.delete(id);
      await loadData();
    }
  };

  const openCreateModal = () => {
    setEditingPacklist(null);
    setFormData({ name: '', activityType: '', date: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (packlist) => {
    setEditingPacklist(packlist);
    setFormData({
      name: packlist.name || '',
      activityType: packlist.activity_type || '',
      date: packlist.date ? packlist.date.split('T')[0] : ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPacklist(null);
    setFormData({ name: '', activityType: '', date: '' });
    setError('');
  };

  const formatWeight = (weight) => {
    const w = parseFloat(weight);
    if (w >= 1000) {
      return `${(w / 1000).toFixed(2)} kg`;
    }
    return `${w} g`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-mountain-900">Pack Lists</h1>
        <button onClick={openCreateModal} className="btn btn-primary">
          Create Pack List
        </button>
      </div>

      {packlists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {packlists.map(packlist => (
            <div key={packlist.id} className="card hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <Link to={`/packlists/${packlist.id}`} className="flex-1">
                  <h3 className="font-semibold text-mountain-900 hover:text-primary-600 transition-colors">
                    {packlist.name}
                  </h3>
                </Link>
                <div className="flex items-center space-x-1 ml-2">
                  <button
                    onClick={() => openEditModal(packlist)}
                    className="p-1.5 text-mountain-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(packlist.id)}
                    className="p-1.5 text-mountain-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {packlist.activity_type && (
                  <span className="badge badge-primary">{packlist.activity_type}</span>
                )}
                {packlist.date && (
                  <span className="badge badge-secondary">{formatDate(packlist.date)}</span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-mountain-600">
                <span>{packlist.item_count} items</span>
                <span className="font-medium">{formatWeight(packlist.total_weight)}</span>
              </div>

              <Link
                to={`/packlists/${packlist.id}`}
                className="mt-4 block text-center btn btn-secondary text-sm"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <svg className="mx-auto h-12 w-12 text-mountain-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-mountain-900">No pack lists yet</h3>
          <p className="mt-2 text-mountain-600">Create your first pack list to start planning your trips</p>
          <button onClick={openCreateModal} className="btn btn-primary mt-4">
            Create Your First Pack List
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingPacklist ? 'Edit Pack List' : 'Create Pack List'}
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
              placeholder="e.g., Yosemite Climbing Trip"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-1">
              Activity Type
            </label>
            <select
              value={formData.activityType}
              onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
              className="input"
            >
              <option value="">Select activity</option>
              {activityTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-mountain-700 mb-1">
              Trip Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={closeModal} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingPacklist ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default PackLists;
