import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AddUser.css';

const API_BASE = 'http://localhost:4000';

function UpdateUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', role: 'buyer', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/admin/getUserById/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.message || 'Failed to fetch user');
          return;
        }
        const user = await res.json();
        setFormData(prev => ({ ...prev, name: user.name || '', email: user.email || '', role: user.role || 'sales-agent' }));
      } catch (err) {
        setError('Network error: ' + err.message);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const body = { name: formData.name, email: formData.email, role: formData.role };
      if (formData.password) body.password = formData.password;

      const res = await fetch(`${API_BASE}/updateUser/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to update user');
        return;
      }

      setSuccess('User updated successfully');
      setTimeout(() => navigate('/admin/properties'), 1200);
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-user-page">
      <header className="add-user-header">
        <div className="header-container">
          <div className="logo">
            <h1>Darvo <span>Real Estate</span></h1>
          </div>
          <button onClick={() => navigate('/admin/properties')} className="back-btn">Back to Admin</button>
        </div>
      </header>

      <div className="add-user-container">
        <div className="add-user-card">
          <h2>Update User</h2>
          <p className="subtitle">Modify user details</p>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="role">User Role</label>
              <select id="role" name="role" value={formData.role} onChange={handleChange} className="form-select">
                <option value="buyer">Renter / Buyer</option>
                <option value="owner">Owner</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" required className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" required className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password (leave blank to keep current)</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter new password" className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" className="form-input" />
            </div>

            <button type="submit" disabled={loading} className="submit-btn">{loading ? 'Updating...' : 'Update User'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateUser;
