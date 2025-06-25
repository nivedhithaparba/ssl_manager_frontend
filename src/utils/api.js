import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://13.201.12.208:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Authentication
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  async logout() {
    await apiClient.post('/auth/logout');
  },

  // Users
  async getUsers() {
    const response = await apiClient.get('/users');
    return response.data;
  },

  async createUser(userData) {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  async updateUser(userId, userData) {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  },

  async deleteUser(userId) {
    await apiClient.delete(`/users/${userId}`);
  },

  async updatePassword(userId, passwordData) {
    const response = await apiClient.patch(`/users/${userId}/password`, passwordData);
    return response.data;
  },

  // SSL Certificates
  async getCertificates() {
    console.log("getCertificates");
    const response = await apiClient.get('/certificates');
    return response.data;
  },

  async generateCertificate(domain) {
    console.log("generateCertificate", domain);
    const response = await apiClient.post('/certificates', { domain });
    return response.data;
  },

  async renewCertificate(certificateId) {
    const response = await apiClient.post(`/certificates/${certificateId}/renew`);
    return response.data;
  },

  async deleteCertificate(certificateId) {
    await apiClient.delete(`/certificates/${certificateId}`);
  }, 

    // DNS TXT Record APIs
  async generateDNSRecord(domain) {
    try {
      const response = await apiClient.post('/dns/generate', { domain });
      return response.data;
    } catch (error) {
      throw new Error('Something went worng',error);
    }
  },

  async verifyDNSRecord(domain, name, value) {
    try {
      const response = await apiClient.post('/dns/verify', { domain, name, value });
      return response.data;
    } catch (error) {
      throw new Error('DNS record not found or value mismatch');
    }
  }

};
