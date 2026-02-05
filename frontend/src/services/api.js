const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.message || 'Request failed');
  }

  return response.json();
}

export const authService = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  me: () => request('/auth/me')
};

export const gearService = {
  getAll: () => request('/gear'),

  getById: (id) => request(`/gear/${id}`),

  create: (data) =>
    request('/gear', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  update: (id, data) =>
    request(`/gear/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  delete: (id) =>
    request(`/gear/${id}`, {
      method: 'DELETE'
    }),

  toggleWishlist: (id) =>
    request(`/gear/${id}/wishlist`, {
      method: 'POST'
    })
};

export const categoryService = {
  getAll: (activityType) => {
    const query = activityType ? `?activityType=${activityType}` : '';
    return request(`/categories${query}`);
  },

  getById: (id) => request(`/categories/${id}`),

  getActivityTypes: () => request('/categories/activity-types'),

  create: (data) =>
    request('/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  update: (id, data) =>
    request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  delete: (id) =>
    request(`/categories/${id}`, {
      method: 'DELETE'
    })
};

export const packlistService = {
  getAll: () => request('/packlists'),

  getById: (id) => request(`/packlists/${id}`),

  create: (data) =>
    request('/packlists', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  update: (id, data) =>
    request(`/packlists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  delete: (id) =>
    request(`/packlists/${id}`, {
      method: 'DELETE'
    }),

  addItem: (packlistId, gearItemId) =>
    request(`/packlists/${packlistId}/items`, {
      method: 'POST',
      body: JSON.stringify({ gearItemId })
    }),

  removeItem: (packlistId, gearItemId) =>
    request(`/packlists/${packlistId}/items/${gearItemId}`, {
      method: 'DELETE'
    }),

  getWeight: (id) => request(`/packlists/${id}/weight`),

  analyze: (id) => request(`/packlists/${id}/analyze`)
};

export const wishlistService = {
  getAll: () => request('/wishlist')
};
