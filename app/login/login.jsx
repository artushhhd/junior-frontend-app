'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json().catch(() => ({}));

      if (res.ok && result.success) {
        localStorage.setItem('token', result.data?.access_token);
        router.push('/profile');
      } else if (res.status === 422) {
        setErrors(result.errors || result.data || {});
      } else {
        alert(result.message || 'Неверный логин или пароль');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-fields">
        <div className="form-group">
          <label className="form-label">Email address</label>
          <input
            name="email"
            type="email"
            required
            className={`form-input ${errors.email ? 'input-error' : ''}`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error-text">{errors.email[0]}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            name="password"
            type="password"
            required
            className={`form-input ${errors.password ? 'input-error' : ''}`}
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error-text">{errors.password[0]}</p>}
        </div>
      </div>

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? 'Вход...' : 'Sign In'}
      </button>
      
      <a href="/">Register</a>
    </form>
  );
}