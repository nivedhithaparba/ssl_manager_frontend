import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import Modal from './components/Modal';
import UserProfile from './components/UserProfile';
import Toast from './components/Toast';
import { authUtils } from './utils/auth';
import { apiService } from './utils/api';

// // Global Trickle functions (these would be provided by the Trickle system)
// window.trickleListObjects = window.trickleListObjects || async function(type, limit, desc) {
//   return { items: [] };
// };

// window.trickleCreateObject = window.trickleCreateObject || async function(type, data) {
//   return { objectId: Date.now().toString(), objectData: data };
// };

// window.trickleUpdateObject = window.trickleUpdateObject || async function(type, id, data) {
//   return { objectId: id, objectData: data };
// };

// window.trickleDeleteObject = window.trickleDeleteObject || async function(type, id) {
//   return true;
// };

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('certificates');
  const [showProfile, setShowProfile] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const user = authUtils.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    authUtils.logout();
    setCurrentUser(null);
  };

  const handleProfileUpdate = async (profileData) => {
    try {
      const updatedUser = { ...currentUser, ...profileData };
      authUtils.setCurrentUser(updatedUser);
      setCurrentUser(updatedUser);
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update profile', 'error');
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} onToast={showToast} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={currentUser} 
        onLogout={handleLogout}
        onProfileClick={() => setShowProfile(true)}
      />
      
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <Toast 
          message={toast?.message} 
          type={toast?.type} 
          onClose={() => setToast(null)} 
        />

        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'certificates' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              SSL Certificates
            </button>
            {authUtils.canManageUsers() && (
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'users' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                User Management
              </button>
            )}
          </div>
        </div>

        {activeTab === 'certificates' ? (
          <Dashboard onToast={showToast} />
        ) : (
          <UserManagement user={currentUser} onToast={showToast} />
        )}

        <Modal isOpen={showProfile} onClose={() => setShowProfile(false)}>
          <UserProfile
            user={currentUser}
            onUpdate={handleProfileUpdate}
            onClose={() => setShowProfile(false)}
          />
        </Modal>
      </div>
    </div>
  );
}

export default App;
