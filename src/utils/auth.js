export const authUtils = {
  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  },

  getAuthToken() {
    return localStorage.getItem('authToken');
  },

  setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!this.getAuthToken();
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },

  hasRole(requiredRole) {
    const user = this.getCurrentUser();
    return user?.role === requiredRole || user?.role === 'admin';
  },

  canManageUsers() {
    return this.hasRole('admin');
  }
};

export const defaultUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    name: 'System Administrator',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    name: 'Regular User',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    createdAt: new Date().toISOString()
  }
];
