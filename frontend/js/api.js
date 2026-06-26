// =============================================
// CivicPulse — api.js
// =============================================

const API_BASE = 'https://civicpluse-backend.onrender.com/api';

// ---- Auth helpers ----
const getToken = () => localStorage.getItem('cp_token');
const getUser  = () => JSON.parse(localStorage.getItem('cp_user') || 'null');
const setAuth  = (data) => {
  localStorage.setItem('cp_token', data.token);
  localStorage.setItem('cp_user', JSON.stringify(data));
};
const clearAuth = () => {
  localStorage.removeItem('cp_token');
  localStorage.removeItem('cp_user');
};

// ---- Base fetch wrapper ----
const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API Error');
  return data;
};

// ---- Auth API ----
const Auth = {
  register: (body) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => apiFetch('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  me:       ()     => apiFetch('/auth/me'),
};

// ---- Issues API ----
const Issues = {
  getAll:       (params = '') => apiFetch(`/issues${params}`),
  getById:      (id)          => apiFetch(`/issues/${id}`),
  create:       (formData)    => {
    const token = getToken();
    return fetch(`${API_BASE}/issues`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    }).then(r => r.json());
  },
  vote:         (id)         => apiFetch(`/issues/${id}/vote`,    { method: 'PUT' }),
  updateStatus: (id, status) => apiFetch(`/issues/${id}/status`,  { method: 'PUT', body: JSON.stringify({ status }) }),
  comment:      (id, text)   => apiFetch(`/issues/${id}/comment`, { method: 'POST', body: JSON.stringify({ text }) }),
  delete:       (id)         => apiFetch(`/issues/${id}`,         { method: 'DELETE' }),
};

// ---- Dashboard API ----
const Dashboard = {
  stats:       () => apiFetch('/dashboard/stats'),
  leaderboard: () => apiFetch('/dashboard/leaderboard'),
  recent:      () => apiFetch('/dashboard/recent'),
};

// ---- User API ----
const Users = {
  getProfile:    ()     => apiFetch('/users/profile'),
  updateProfile: (body) => apiFetch('/users/profile', { method: 'PUT', body: JSON.stringify(body) }),
};

// ---- Nav Auth State ----
const updateNav = () => {
  const user = getUser();
  const loginLink = document.querySelector('a[href="login.html"]');
  if (loginLink && user) {
    loginLink.textContent = `👤 ${user.name}`;
  }
};

document.addEventListener('DOMContentLoaded', updateNav);