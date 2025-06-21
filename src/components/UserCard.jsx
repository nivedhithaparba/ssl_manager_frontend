import React from 'react';
import { Edit, Trash2, Key } from 'lucide-react';

const UserCard = ({ user, onEdit, onDelete, onPasswordReset, currentUser }) => {
  const canEdit = currentUser.role === 'admin' || currentUser.id === user.id;
  const canDelete = currentUser.role === 'admin' && currentUser.id !== user.id;

  return (
    <div className="glass-bg rounded-xl p-4 card-hover">
      <div className="flex items-center space-x-4">
        <img
          src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60'}
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{user.name}</h4>
          <p className="text-sm text-gray-600">{user.email}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`px-2 py-1 text-xs rounded-full ${
              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {user.role}
            </span>
            <span className="text-xs text-gray-500">
              @{user.username}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          {canEdit && (
            <button
              onClick={() => onEdit(user)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit User"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {currentUser.role === 'admin' && (
            <button
              onClick={() => onPasswordReset(user)}
              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
              title="Reset Password"
            >
              <Key className="w-4 h-4" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(user)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete User"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
