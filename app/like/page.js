'use client';

import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import LikedCourses from './LikedCourses';

export default function LikesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) { setLoading(false); return; }

        api.get('courses').then(res => {
            const list = res.data?.data ?? res.data ?? [];
            setCourses(list.filter(c => c.is_liked));
        }).catch(console.error)
          .finally(() => setLoading(false));
    }, [user]);

    const unlike = async (id) => {
        setCourses(prev => prev.filter(c => c.id !== id));
        try { await api.post(`courses/${id}/like`); } catch {}
    };

    return <LikedCourses liked={courses} loading={loading} onUnlike={unlike} />;
}
