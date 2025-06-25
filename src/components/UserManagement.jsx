import React, { useState, useEffect } from 'react';
import { authUtils } from '../utils/auth';
import UserList from './UserList';
import UserForm from './UserForm';
import Modal from './Modal';

const UserManagement = ({ user, onToast }) => {
  const [users, setUsers] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const result = await window.trickleListObjects('user', 100, true);
      const userList = result.items?.map(item => ({
        id: item.objectId,
        ...item.objectData
      }));
      setUsers(userList);
    } catch (error) {
      onToast('Using demo users', 'info');
    }
  };

  const handleUserSubmit = async (userData) => {
    try {
      if (editingUser) {
        await window.trickleUpdateObject('user', editingUser.id, userData);
        onToast('User updated successfully', 'success');
      } else {
        await window.trickleCreateObject('user', userData);
        onToast('User created successfully', 'success');
      }
      await loadUsers();
      setShowUserForm(false);
      setEditingUser(null);
    } catch (error) {
      onToast('Failed to save user', 'error');
    }
  };

  const handleDeleteUser = async (userToDelete) => {
    if (window.confirm(`Delete user ${userToDelete.name}?`)) {
      try {
        await window.trickleDeleteObject('user', userToDelete.id);
        onToast('User deleted successfully', 'success');
        await loadUsers();
      } catch (error) {
        onToast('Failed to delete user', 'error');
      }
    }
  };

  const handlePasswordReset = async (userToReset) => {
    const newPassword = window.prompt(`Enter new password for ${userToReset.name}:`);
    if (newPassword) {
      try {
        const updatedData = { ...userToReset, password: newPassword };
        await window.trickleUpdateObject('user', userToReset.id, updatedData);
        onToast('Password updated successfully', 'success');
      } catch (error) {
        onToast('Failed to update password', 'error');
      }
    }
  };

  return (
    <div>
      <UserList
        users={users}
        currentUser={user}
        onAdd={() => { setEditingUser(null); setShowUserForm(true); }}
        onEdit={(userToEdit) => { setEditingUser(userToEdit); setShowUserForm(true); }}
        onDelete={handleDeleteUser}
        onPasswordReset={handlePasswordReset}
      />

      <Modal isOpen={showUserForm} onClose={() => setShowUserForm(false)}>
        <UserForm
          user={editingUser}
          onSubmit={handleUserSubmit}
          onClose={() => setShowUserForm(false)}
        />
      </Modal>
    </div>
  );
};

export default UserManagement;
