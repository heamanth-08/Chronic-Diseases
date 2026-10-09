const API_BASE_URL = '/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('vitascreen_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    localStorage.removeItem('vitascreen_token');
    localStorage.removeItem('vitascreen_user');
    if (endpoint !== '/auth/login' && endpoint !== '/auth/register') {
      window.dispatchEvent(new Event('auth-logout'));
    }
  }

  if (!response.ok) {
    let errorMsg = 'An unexpected error occurred.';
    try {
      const errorData = await response.json();
      if (typeof errorData.detail === 'string') {
        errorMsg = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        errorMsg = errorData.detail.map(e => (typeof e === 'string' ? e : e.msg || e.detail || JSON.stringify(e))).join('. ');
      } else if (typeof errorData.detail === 'object' && errorData.detail !== null) {
        errorMsg = JSON.stringify(errorData.detail);
      } else if (errorData.message) {
        errorMsg = typeof errorData.message === 'string' ? errorData.message : JSON.stringify(errorData.message);
      }
    } catch (e) {
      // Non-JSON response
    }
    throw new Error(errorMsg);
  }

  // Handle blob responses (e.g. PDF downloads)
  if (options.responseType === 'blob') {
    return await response.blob();
  }

  return await response.json();
}

export const api = {
  // Auth
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),

  // Profile
  getProfile: () => request('/user/profile'),
  saveProfile: (data) => request('/user/profile', { method: 'POST', body: JSON.stringify(data) }),
  updateProfile: (data) => request('/user/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Assessments
  submitStage1: (answers) => request('/assessment/stage1', { method: 'POST', body: JSON.stringify({ answers }) }),
  submitStage2: (data) => request('/assessment/stage2', { method: 'POST', body: JSON.stringify(data) }),
  getHistory: () => request('/assessment/history'),
  getAssessment: (id) => request(`/assessment/${id}`),
  compareAssessments: (id1, id2) => request(`/assessment/compare/${id1}/${id2}`),
  downloadPdf: async (id) => {
    const blob = await request(`/assessment/${id}/pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vitascreen_report_${id.slice(0, 8)}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  // Dashboard
  getDashboardSummary: () => request('/dashboard/summary')
};
