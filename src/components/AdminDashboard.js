import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useUser } from '../context/UserContext';

const AdminDashboard = ({ onBack }) => {
  const { isAdmin, loginAdmin, logoutAdmin, deleteUser, banUser } = useAdmin();
  const { potentialMatches, pits } = useUser();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginAdmin(password)) {
      setPassword('');
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '10px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <button type="submit" style={{ padding: '10px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Login</button>
          <button onClick={onBack} type="button" style={{ padding: '10px', background: 'transparent', color: '#666', border: 'none', cursor: 'pointer' }}>Back to App</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
        <h2>Admin Dashboard 🛠️</h2>
        <button onClick={logoutAdmin} style={{ padding: '5px 15px', background: '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
        <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '10px' }}>
          <h3>Total Users</h3>
          <p style={{ fontSize: '2rem', margin: 0 }}>{potentialMatches.length}</p>
        </div>
        <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '10px' }}>
          <h3>Current User Pits</h3>
          <p style={{ fontSize: '2rem', margin: 0 }}>{pits}</p>
        </div>
      </div>

      <h3>User Management</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ textAlign: 'left', background: '#eee' }}>
            <th style={{ padding: '10px' }}>ID</th>
            <th style={{ padding: '10px' }}>Alias / Real Name</th>
            <th style={{ padding: '10px' }}>Status</th>
            <th style={{ padding: '10px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {potentialMatches.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{user.id}</td>
              <td style={{ padding: '10px' }}>
                <div><strong>{user.alias}</strong></div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>{user.realName}</div>
              </td>
              <td style={{ padding: '10px' }}>
                {user.banned ? <span style={{ color: 'red', fontWeight: 'bold' }}>BANNED</span> : <span style={{ color: 'green' }}>Active</span>}
              </td>
              <td style={{ padding: '10px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => banUser(user.id)}
                  style={{ padding: '5px 10px', background: user.banned ? '#ccc' : '#ffa500', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                  disabled={user.banned}
                >
                  {user.banned ? 'Banned' : 'Ban'}
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  style={{ padding: '5px 10px', background: '#ff4d4d', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <button onClick={onBack} style={{ padding: '10px 20px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Back to App</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
