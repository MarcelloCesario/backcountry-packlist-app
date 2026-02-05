import { useState, useEffect } from 'react';
import { wishlistService, gearService, categoryService } from '../services/api';
import GearItemCard from '../components/GearItemCard';
import Modal from '../components/Modal';
import GearForm from '../components/GearForm';

function Wishlist() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [wishlistRes, catRes] = await Promise.all([
        wishlistService.getAll(),
        categoryService.getAll()
      ]);
      setItems(wishlistRes.items);
      setCategories(catRes.categories);
    } catch (error) {
      console.error('Failed to load data:', error);
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

  const totalEstimatedCost = items.reduce((sum, item) => {
    return sum;
  }, 0);

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
          <h1 className="text-2xl font-bold text-mountain-900">Wishlist</h1>
          <p className="text-mountain-600 mt-1">
            {items.length} items you want to buy
          </p>
        </div>
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
