import React, { useState } from 'react';
import { PlusCircle, Globe, ShieldCheck } from 'lucide-react';
import { validation } from '../utils/validation';
import LoadingSpinner from './LoadingSpinner';

const DomainForm = ({ onSubmit, isLoading }) => {
  const [domain, setDomain] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validation.validateDomain(domain)) {
      setError('Please enter a valid domain (e.g., example.com)');
      return;
    }

    try {
      await onSubmit(domain.trim().toLowerCase());
      setDomain('');
    } catch (err) {
      setError(err.message || 'Failed to generate certificate');
    }
  };

  return (
    <div className="glass-bg rounded-xl p-6 animate-slide-up">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <PlusCircle className="w-5 h-5 mr-2 text-blue-600" />
        Generate SSL Certificate
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Domain Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              className="input-field pr-12"
              disabled={isLoading}
            />
            <Globe className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
          </div>
          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !domain.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
          {isLoading ? (
            <LoadingSpinner size="sm" color="white" />
          ) : (
            <ShieldCheck className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Generating...' : 'Generate Certificate'}
        </button>
      </form>
    </div>
  );
};

export default DomainForm;
