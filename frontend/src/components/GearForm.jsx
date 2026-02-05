import { useState, useEffect } from 'react';

function GearForm({ item, categories, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    weight: '',
    categoryId: '',
    notes: '',
    inWishlist: false
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        weight: item.weight || '',
        categoryId: item.category_id || '',
        notes: item.notes || '',
        inWishlist: item.in_wishlist || false
      });
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      await onSubmit({
        name: formData.name,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        categoryId: formData.categoryId || null,
        notes: formData.notes,
        inWishlist: formData.inWishlist
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
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
          placeholder="e.g., Black Diamond Camalot #2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-mountain-700 mb-1">
          Weight (grams)
        </label>
        <input
          type="number"
          value={formData.weight}
          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
          className="input"
          placeholder="e.g., 136"
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-mountain-700 mb-1">
          Category
        </label>
        <select
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          className="input"
        >
          <option value="">No category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.activity_type})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-mountain-700 mb-1">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="input"
          rows={3}
          placeholder="Additional notes about this item..."
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="inWishlist"
          checked={formData.inWishlist}
          onChange={(e) => setFormData({ ...formData, inWishlist: e.target.checked })}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-mountain-300 rounded"
        />
        <label htmlFor="inWishlist" className="ml-2 text-sm text-mountain-700">
          Add to wishlist
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {item ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}

export default GearForm;
