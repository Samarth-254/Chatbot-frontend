const BASE_URL = import.meta.env.VITE_API_URL;

const storage = {
  getToken() {
    return localStorage.getItem('token');
  },
  getUser() {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setAuth(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

const getHeaders = (isMultipart = false) => {
  const token = storage.getToken();
  const headers = {};

  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

const handleUnauthorized = () => {
  storage.clearAuth();
};

const handleResponse = async (response) => {
  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    if (response.status === 401) {
      handleUnauthorized();
    }

    const error = new Error(data.message || 'Something went wrong');
    error.status = response.status;
    throw error;
  }

  return data;
};

const request = async (url, options = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, options);
  return handleResponse(res);
};

export const api = {
  auth: {
    login: async (username, password) => {
      const data = await request('/auth/login', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username, password })
      });

      if (data.token && data.user) {
        storage.setAuth(data.token, data.user);
      }

      return data;
    },

    adminLogin: async (username, password) => {
      const data = await request('/auth/admin-login', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username, password })
      });

      if (data.token && data.user) {
        storage.setAuth(data.token, data.user);
      }

      return data;
    },

    register: async (username, password) => {
      const data = await request('/auth/register', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username, password })
      });

      if (data.token && data.user) {
        storage.setAuth(data.token, data.user);
      }

      return data;
    },

    logout: () => {
      storage.clearAuth();
    },

    getCurrentUser: () => storage.getUser(),
    getToken: () => storage.getToken(),
    isAuthenticated: () => !!storage.getToken(),
    isAdmin: () => storage.getUser()?.role === 'admin',

    getTotalUsers: async () =>
      request('/auth/users/count', {
        method: 'GET',
        headers: getHeaders()
      }),

    getProfile: async () =>
      request('/auth/profile', {
        method: 'GET',
        headers: getHeaders()
      })
  },

  documents: {
    list: async () =>
      request('/documents', {
        method: 'GET',
        headers: getHeaders()
      }),

    upload: async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      return request('/documents/upload', {
        method: 'POST',
        headers: getHeaders(true),
        body: formData
      });
    },

    delete: async (id) =>
      request(`/documents/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
  },

  qa: {
    list: async (search = '') => {
      const url = search ? `/qa?search=${encodeURIComponent(search)}` : '/qa';
      return request(url, {
        method: 'GET',
        headers: getHeaders()
      });
    },

    create: async (question, answer) =>
      request('/qa', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ question, answer })
      }),

    update: async (id, question, answer) =>
      request(`/qa/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ question, answer })
      }),

    delete: async (id) =>
      request(`/qa/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
  },

  chat: {
    query: async (question, sessionId) =>
      request('/chat/query', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ question, sessionId })
      }),

    getUserHistory: async () =>
      request('/chat/user-history', {
        method: 'GET',
        headers: getHeaders()
      }),

    getHistory: async () =>
      request('/chat/history', {
        method: 'GET',
        headers: getHeaders()
      }),

    clearHistory: async () =>
      request('/chat/history', {
        method: 'DELETE',
        headers: getHeaders()
      })
  }
};