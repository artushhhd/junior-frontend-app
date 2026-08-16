'use client';

import { useState, useEffect } from 'react';
import LikedCourses from './like';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const getHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
});

export default function LikesPage() {
    const [courses, setCourses] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!localStorage.getItem('token')) return setLoading(false);

        Promise.all([
            fetch(`${API_URL}/user`, { headers: getHeaders() }).then(r => r.json()),
            fetch(`${API_URL}/courses`, { headers: getHeaders() }).then(r => r.json()),
        ]).then(([user, data]) => {
            setUserId(user?.id);
            const list = data.success ? (data.data?.data ?? data.data) : (Array.isArray(data) ? data : []);
            setCourses(list);
        }).catch(console.error)
          .finally(() => setLoading(false));
    }, []);

    const unlike = (id) => {
        setCourses(prev => prev.filter(c => c.id !== id));
        fetch(`${API_URL}/courses/${id}/like`, { method: 'POST', headers: getHeaders() }).catch(console.error);
    };

    const liked = courses.filter(c =>
        c.is_liked === true || c.likes?.some(l => Number(l.user_id) === Number(userId))
    );

    return <LikedCourses liked={liked} loading={loading} onUnlike={unlike} />;
}