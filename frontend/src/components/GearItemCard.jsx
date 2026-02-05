import { useSettings } from '../context/SettingsContext';

function GearItemCard({ item, onEdit, onDelete, onToggleWishlist, showActions = true }) {
  const { formatWeight } = useSettings();

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-mountain-900 truncate">{item.name}</h3>
          <div className="mt-1 flex flex-wrap gap-2">
            {item.category_name && (
              <span className="badge badge-primary">{item.category_name}</span>
            )}
            {item.activity_type && (
              <span className="badge badge-secondary">{item.activity_type}</span>
            )}
          </div>
          <div className="mt-2 flex items-center space-x-3">
            <span className="text-sm font-medium text-mountain-700">
              {formatWeight(item.weight)}
            </span>
            {item.in_wishlist && (
              <span className="inline-flex items-center text-xs text-amber-600">
                <svg className="h-3.5 w-3.5 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Wishlist
              </span>
            )}
          </div>
          {item.notes && (
            <p className="mt-2 text-sm text-mountain-500 line-clamp-2">{item.notes}</p>
          )}
        </div>

        {showActions && (
          <div className="flex items-center space-x-1 ml-4 flex-shrink-0">
            <button
              onClick={() => onToggleWishlist?.(item.id)}
              className={`p-2 rounded-lg transition-colors ${
                item.in_wishlist
                  ? 'text-amber-500 hover:bg-amber-50'
                  : 'text-mountain-400 hover:bg-mountain-100 hover:text-mountain-600'
              }`}
              title={item.in_wishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <svg className="h-5 w-5" fill={item.in_wishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
            <button
              onClick={() => onEdit?.(item)}
              className="p-2 text-mountain-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Edit"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete?.(item.id)}
              className="p-2 text-mountain-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GearItemCard;
