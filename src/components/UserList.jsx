import React from 'react';
import { UserPlus, Users } from 'lucide-react';
import UserCard from './UserCard';
import { authUtils } from '../utils/auth';

const UserList = ({ users, onEdit, onDelete, onPasswordReset, onAdd, currentUser }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Users ({users.length})
        </h3>
        {authUtils.canManageUsers() && (
          <button
            onClick={onAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        )}
      </div>

      {users.length === 0 ? (
        <div className="glass-bg rounded-xl p-8 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h4>
          <p className="text-gray-600">Add your first user to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              currentUser={currentUser}
              onEdit={onEdit}
              onDelete={onDelete}
              onPasswordReset={onPasswordReset}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
