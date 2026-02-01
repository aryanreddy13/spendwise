import axios from 'axios';

// Create a configured axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('user_id_token'); // Or whatever we call it
  // Actually backend expects user_id query param or similar.
  // We can attach it as a query param for GET requests if not present
  // But standard way is Authorization header or just stick to params.

  // Let's stick closer to the existing backend style:
  // Many endpoints take `user_id` param.
  // We can inject it into params.

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  // If we have a token or user ID, let's use it.
  // Our fake login returns { token: user_id, user_id: ... }

  const userId = user.user_id || 'default';

  if (config.method === 'get' || config.method === 'delete') {
    config.params = config.params || {};
    if (!config.params.user_id) {
      config.params.user_id = userId;
    }
  } else {
    // POST/PUT
    if (config.data && typeof config.data === 'object' && !config.data.user_id) {
      // Some endpoints expect user_id in body (none I saw, usually params)
      // But `add_expense` takes `user_id` as query param in my definition: `def add_expense(item: ExpenseItem, user_id: str = "default"):`
      config.params = config.params || {};
      if (!config.params.user_id) {
        config.params.user_id = userId;
      }
    }
  }

  return config;
});

export default api;
