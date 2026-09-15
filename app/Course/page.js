'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import CourseCard from './Course';
import './course.css';

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useAuth();

    const loadCourses = useCallback(async () => {
        try {
            const res = await api.get('courses');
            setCourses(res.data?.data ?? res.data ?? []);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => { loadCourses(); }, [loadCourses]);

    const handleLike = async (id) => {
        if (!user) return alert('Sign in first');

        setCourses(prev => prev.map(c => c.id === id
            ? { ...c, is_liked: !c.is_liked, likes_count: c.is_liked ? c.likes_count - 1 : (c.likes_count || 0) + 1 }
            : c
        ));

        try {
            await api.post(`courses/${id}/like`);
        } catch {
            loadCourses();
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this course?')) return;
        try {
            await api.delete(`courses/${id}`);
            setCourses(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            alert(err.message);
        }
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
