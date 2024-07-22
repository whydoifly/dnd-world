// src/components/UserList.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5001/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.message);
      }
    };

    if (user && user.isAdmin) {
      fetchUsers();
    }
  }, [user]);

  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      setUsers(users.filter((user) => user._id !== id));
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const toggleAdmin = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAdmin: !currentStatus }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const updatedUser = await response.json();
      setUsers(users.map((user) => (user._id === id ? updatedUser : user)));
      alert('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!Array.isArray(users)) {
    return <div>Unexpected response format</div>;
  }

  return (
    <div className='user-list'>
      <h2>User List</h2>
      <table>
        <thead>
          <tr>
            <th>E-mail</th>
            <th>Username</th>
            <th>Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.isAdmin ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => toggleAdmin(user._id, user.isAdmin)}>
                  {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                </button>
                <button onClick={() => deleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
