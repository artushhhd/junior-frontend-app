'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth';
import './register.css';

const FIELDS = [
    { name: 'name', label: 'Full Name', type: 'text' },
    { name: 'email', label: 'Email address', type: 'email' },
    { name: 'password', label: 'Password', type: 'password' },
    { name: 'password_confirmation', label: 'Confirm Password', type: 'password' },
];

export default function RegisterForm() {
    const router = useRouter();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '' });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await register(formData);
            router.push('/Course');
        } catch (err) {
            if (err.status === 422) {
                setErrors(err.data?.errors || {});
            } else {
                alert(err.message || 'Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <div className="form-fields">
                {FIELDS.map(({ name, label, type }) => (
                    <div className="form-group" key={name}>
                        <label className="form-label">{label}</label>
                        <input
                            name={name}
                            type={type}
                            required
                            className={`form-input ${errors[name] ? 'input-error' : ''}`}
                            value={formData[name]}
                            onChange={handleChange}
                        />
                        {errors[name] && <p className="error-text">{errors[name][0]}</p>}
                    </div>
                ))}
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Registering...' : 'Register'}
            </button>
            <a href="/login">Already have an account? Login here.</a>
        </form>
    );
}
