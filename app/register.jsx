'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import './register.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {  
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json().catch(() => ({}));

      if (res.ok && result.success) {
        localStorage.setItem('token', result.data.access_token);
        router.push('/login');
      } else if (res.status === 422) {
        setErrors(result.errors || result.data || {});
      } else {
        alert(result.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="form-fields">
        {['name', 'email', 'password', 'password_confirmation'].map((field) => {
          const isPassword = field.includes('password');
          const labels = {
            name: 'Full Name',
            email: 'Email address',
            password: 'Password',
            password_confirmation: 'Confirm Password'
          };

          return (
            <div className="form-group" key={field}>
              <label className="form-label">{labels[field]}</label>
              <input
                name={field}
                type={field === 'email' ? 'email' : isPassword ? 'password' : 'text'}
                required
                className={`form-input ${errors[field] ? 'input-error' : ''}`}
                value={formData[field]}
                onChange={handleChange}
              />
              {errors[field] && <p className="error-text">{errors[field][0]}</p>}
            </div>
          );
        })}
      </div>

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? (
          <span className="spinner-container">
            <svg className="spinner" viewBox="0 0 24 24">
              <circle className="spinner-bg" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Registering...
          </span>
        ) : 'Register'}
      </button>
      <a href="/login">Already have an account? Login here.</a>
    </form>
  );
}