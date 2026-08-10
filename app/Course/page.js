'use client';

import { useState, useEffect } from 'react';
import CourseCard from './Course';
import './course.css';

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [user, setUser] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const headers = { 'Accept': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) };

        fetch('http://127.0.0.1:8000/api/courses', { headers })
            .then(res => res.json())
            .then(json => setCourses(json.data || []))
            .catch(console.error);

        if (token) {
            fetch('http://127.0.0.1:8000/api/user', { headers })
                .then(res => res.ok && res.json())
                .then(data => data && setUser(data))
                .catch(console.error);
        }
    }, []);

    const handleLike = async (id) => {
        if (!user) return alert('Sign in first!');

        setCourses(prev => prev.map(c => c.id === id ? {
            ...c,
            is_liked: !c.is_liked,
            likes_count: !c.is_liked ? (c.likes_count || 0) + 1 : Math.max(0, (c.likes_count || 0) - 1)
        } : c));

        await fetch(`http://127.0.0.1:8000/api/courses/${id}/like`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Accept': 'application/json' }
        }).catch(console.error);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this course?')) return;
        setCourses(prev => prev.filter(c => c.id !== id));
        await fetch(`http://127.0.0.1:8000/api/courses/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Accept': 'application/json' }
        }).catch(console.error);
    };

    const filtered = courses.filter(c => 
        c.title.toLowerCase().includes(search.toLowerCase()) || 
        c.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="courses-container">
            <header className="courses-header">
                <h1 className="courses-title-main">Available Courses</h1>
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="search-input"
                />
            </header>

            <div className="courses-grid">
                {filtered.map(c => (
                    <CourseCard key={c.id} course={c} currentUser={user} onLike={handleLike} onDelete={handleDelete} />
                ))}
            </div>
        </div>
    );
}