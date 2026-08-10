'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './addCourse.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function AddCourseForm() {
    const router = useRouter();
    const [form, setForm] = useState({ title: '', description: '', price: '', status: 'draft' });
    const [image, setImage] = useState(null);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) return alert('Please login first');

        const slug = form.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
        const formData = new FormData();

        Object.entries({ ...form, slug, price: parseFloat(form.price) || 0 }).forEach(([k, v]) => formData.append(k, v));
        if (image) formData.append('image', image);

        try {
            const res = await fetch(`${API_URL}/api/courses`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
                body: formData
            });

            if (res.ok) {
                alert('Course created!');
                router.push('/shop');
                setForm({ title: '', description: '', price: '', status: 'draft' });
                setImage(null);
                e.target.reset();
            } else {
                const err = await res.json().catch(() => ({}));
                alert(err.message || 'Error creating course');
            }
        } catch (err) {
            console.error(err);
            alert('Network error. Please try again.');
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Create New Course</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Course Title</label>
                    <input type="text" name="title" value={form.title} onChange={handleChange} className="form-input" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Course Cover Image</label>
                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="form-file-input" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows="4" className="form-textarea" required />
                </div>
                <div className="form-grid">
                    <div>
                        <label className="form-label">Price ($)</label>
                        <input type="number" name="price" value={form.price} onChange={handleChange} step="0.01" className="form-input" required />
                    </div>
                    <div>
                        <label className="form-label">Status</label>
                        <select name="status" value={form.status} onChange={handleChange} className="form-select">
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                </div>
                <button type="submit" className="form-submit-btn">Create Course</button>
            </form>
        </div>
    );
}