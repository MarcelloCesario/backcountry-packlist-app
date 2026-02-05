import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wishlistService, gearService, categoryService } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import GearItemCard from '../components/GearItemCard';
import Modal from '../components/Modal';
import GearForm from '../components/GearForm';

function Wishlist() {
  const { formatWeight } = useSettings();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const [wishlistRes, catRes] = await Promise.all([
        wishlistService.getAll(),
        categoryService.getAll()
      ]);
      setItems(wishlistRes.items || []);
      setCategories(catRes.categories || []);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load wishlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = async (id) => {
    await gearService.toggleWishlist(id);
    await loadData();
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

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const totalWeight = items.reduce((sum, item) => sum + (item.weight || 0), 0);

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
          <h1 className="text-2xl font-bold text-mountain-900">Wishlist</h1>
          <p className="text-mountain-600 mt-1">
            {items.length} {items.length === 1 ? 'item' : 'items'} you want to buy
            {items.length > 0 && ` | Total: ${formatWeight(totalWeight)}`}
          </p>
        </div>
        <Link to="/gear" className="btn btn-secondary">
          Browse Gear
        </Link>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-mountain-900">Your wishlist is empty</h3>
          <p className="mt-2 text-mountain-600">
            Star items from your gear inventory to add them to your wishlist
          </p>
          <Link to="/gear" className="btn btn-primary mt-4 inline-block">
            Browse Gear Inventory
          </Link>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        title="Edit Gear"
      >
        <GearForm
          item={editingItem}
          categories={categories}
          onSubmit={handleUpdate}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
        />
      </Modal>
    </div>
  );
}

export default Wishlist;
