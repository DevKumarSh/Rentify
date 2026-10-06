import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ShieldCheck, UserX, UserCheck, Users, Mail, Phone } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllUsers();
      setUsers(res.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id, currentEnabled) => {
    await adminService.toggleUserStatus(id, !currentEnabled);
    fetchUsers();
  };

  const handleVerifyUser = async (id) => {
    await adminService.verifyUser(id);
    fetchUsers();
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Manage Platform Users</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Control user access, toggle disabled accounts, and verify landlords.
          </p>
        </div>
        <span className="badge badge-primary">{users.length} Total Users</span>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading user accounts..." />
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>ID</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>User</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Role</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Phone</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Verified</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>#{u.id}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.email}</p>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className="badge badge-primary">{u.role?.replace('ROLE_', '')}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>{u.phone}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {u.verified ? (
                      <span className="badge badge-success">Verified</span>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={() => handleVerifyUser(u.id)}
                      >
                        Verify
                      </button>
                    )}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={`badge ${u.enabled !== false ? 'badge-success' : 'badge-danger'}`}>
                      {u.enabled !== false ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button
                      type="button"
                      className={`btn btn-sm ${u.enabled !== false ? 'btn-secondary text-danger' : 'btn-success'}`}
                      onClick={() => handleToggleStatus(u.id, u.enabled !== false)}
                    >
                      {u.enabled !== false ? (
                        <>
                          <UserX size={14} /> Disable
                        </>
                      ) : (
                        <>
                          <UserCheck size={14} /> Enable
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
