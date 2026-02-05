import { useState, useEffect } from 'react';
import { gearService, categoryService } from '../services/api';
import Modal from '../components/Modal';
import GearItemCard from '../components/GearItemCard';
import GearForm from '../components/GearForm';

function GearList() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filter, setFilter] = useState({ category: '', search: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [gearRes, catRes] = await Promise.all([
        gearService.getAll(),
        categoryService.getAll()
      ]);
      setItems(gearRes.items);
      setCategories(catRes.categories);
    } catch (error) {
      console.error('Failed to load data:', error);
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

  const filteredItems = items.filter(item => {
    const matchesCategory = !filter.category || item.category_id === parseInt(filter.category);
    const matchesSearch = !filter.search ||
      item.name.toLowerCase().includes(filter.search.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(filter.search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const totalWeight = filteredItems.reduce((sum, item) => sum + (item.weight || 0), 0);

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
          <h1 className="text-2xl font-bold text-mountain-900">Gear Inventory</h1>
          <p className="text-mountain-600 mt-1">
            {filteredItems.length} items | Total weight: {totalWeight >= 1000 ? `${(totalWeight / 1000).toFixed(2)} kg` : `${totalWeight} g`}
          </p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary">
          Add Gear
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search gear..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="input"
            />
          </div>
          <div className="w-full md:w-64">
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="input"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.activity_type})
                </option>
              ))}
            </select>
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
            {filter.search || filter.category
              ? 'Try adjusting your filters'
              : 'Get started by adding your first piece of gear'}
          </p>
          {!filter.search && !filter.category && (
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
