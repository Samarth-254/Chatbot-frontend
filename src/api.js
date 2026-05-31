const BASE_URL = import.meta.env.VITE_API_URL;

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('token');
  const headers = {};
  
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const api = {
  auth: {
    login: async (username, password) => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username, password })
      });
      const data = await handleResponse(res);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    },
    adminLogin: async (username, password) => {
      const res = await fetch(`${BASE_URL}/auth/admin-login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username, password })
      });
      const data = await handleResponse(res);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    },
    register: async (username, password) => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username, password })
      });
      const data = await handleResponse(res);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    getCurrentUser: () => {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    },
    isAuthenticated: () => {
      return !!localStorage.getItem('token');
    },
    getTotalUsers: async () => {
      const res = await fetch(`${BASE_URL}/auth/users/count`, {
        headers: getHeaders(),
      });
      return res.json();
    },
    getProfile: async () => {
      const res = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  },

  documents: {
    list: async () => {
      const res = await fetch(`${BASE_URL}/documents`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    upload: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch(`${BASE_URL}/documents/upload`, {
        method: 'POST',
        headers: getHeaders(true), 
        body: formData
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${BASE_URL}/documents/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  },

  qa: {
    list: async (search = '') => {
      const url = search ? `${BASE_URL}/qa?search=${encodeURIComponent(search)}` : `${BASE_URL}/qa`;
      const res = await fetch(url, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    create: async (question, answer) => {
      const res = await fetch(`${BASE_URL}/qa`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ question, answer })
      });
      return handleResponse(res);
    },
    update: async (id, question, answer) => {
      const res = await fetch(`${BASE_URL}/qa/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ question, answer })
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${BASE_URL}/qa/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  },

  chat: {
    query: async (question, sessionId) => {
      const res = await fetch(`${BASE_URL}/chat/query`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ question, sessionId })
      });
      return handleResponse(res);
    },
    getUserHistory: async () => {
      const res = await fetch(`${BASE_URL}/chat/user-history`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    getHistory: async () => {
      const res = await fetch(`${BASE_URL}/chat/history`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse(res);
    },
    clearHistory: async () => {
      const res = await fetch(`${BASE_URL}/chat/history`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return handleResponse(res);
    }
  }
};
