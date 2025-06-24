import React, { useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { apiService } from '../utils/api';
import { authUtils, defaultUsers } from '../utils/auth';
import LoadingSpinner from './LoadingSpinner';
import { jwtDecode } from "jwt-decode"; 

const Login = ({ onLogin, onToast }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let user =null, token = null;
      try {
        const response = await apiService.login(credentials);
        token = response.token;
        const decoded = jwtDecode(token);
        user = decoded.user;
        authUtils.setAuthToken(token);
      } catch (apiError) {
        throw new Error('Invalid credentials');
        // const demoUser = defaultUsers.find(u => 
        //   u.username === credentials.username && u.password === credentials.password
        // );
        // if (!demoUser) throw new Error('Invalid credentials');
        // user = demoUser;
        // authUtils.setAuthToken('demo-token-' + Date.now());
      }

      authUtils.setCurrentUser(user);
      onLogin(user);
      onToast('Login successful', 'success');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="glass-bg rounded-2xl p-8 w-full max-w-md shadow-xl animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">SSL Dashboard</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="input-field"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="input-field pr-12"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-bounce-in">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? <LoadingSpinner size="sm" color="white" /> : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
          <p className="text-xs text-blue-600">Admin: admin / admin123</p>
          <p className="text-xs text-blue-600">User: user / user123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
