'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth';
import './login.css';

export default function LoginForm() {
    const router = useRouter();
    const { login } = useAuth();
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
            await login(formData.email, formData.password);
            router.push('/Course');
        } catch (err) {
            if (err.status === 422) {
                setErrors(err.data?.errors || {});
            } else {
                alert(err.message || 'Invalid credentials');
            }
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
                {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <a href="/">Register</a>
        </form>
    );
}
