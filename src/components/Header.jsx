import React from 'react';
import { Shield, LogOut, User } from 'lucide-react';

const Header = ({ user, onLogout, onProfileClick }) => {
  return (
    <div className="gradient-bg text-white py-6 mb-8 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-xl">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">SSL Dashboard</h1>
              <p className="text-blue-100">Manage certificates & users</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Online</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={onProfileClick}
                className="flex items-center space-x-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg px-3 py-2 transition-all"
              >
                <img 
                  src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40'} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium">{user.name}</span>
              </button>

              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 rounded-lg px-3 py-2 transition-all flex items-center space-x-1"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
