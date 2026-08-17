'use client';

import { useState, useEffect } from 'react';
import '../Course/course.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000';

export default function CourseCard({ course, onDelete, currentUser, onLike }) {
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(course?.comments || []);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        setComments(course?.comments || []);
    }, [course?.comments]);

    const isSeller = currentUser && (
        Number(currentUser.id) === Number(course?.user_id) || 
        Number(currentUser.id) === Number(course?.author?.id)
    );

    const sendComment = async (e) => {
        e.preventDefault();
        if (!text.trim() || sending) return;

        setSending(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE}/api/courses/${course.id}/comment`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ content: text })
            });

            const json = await res.json();

            if (res.ok && json.success) {
                setComments(prev => [json.data, ...prev]);
                setText('');
            } else {
                console.error('Failed to post comment:', json.message || res.statusText);
            }
        } catch (err) {
            console.error('Network error while posting comment:', err);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="course-card">
            <div className="course-image-wrapper">
                <img 
                    src={course?.image ? `${API_BASE}/storage/${course.image}` : '/placeholder-course.png'} 
                    alt={course?.title || 'Course'} 
                    className="course-image" 
                    loading="lazy" 
                />
                <span className={`status-badge ${course?.status || 'draft'}`}>
                    {course?.status || 'draft'}
                </span>
            </div>
            
            <div className="course-content">
                <h3 className="course-title">{course?.title}</h3>
                <span className="course-author">Author: {course?.author?.name || 'Unknown'}</span>
                <p className="course-description">{course?.description}</p>
                
                <div className="course-footer">
                    <span className="course-price">
                        {parseFloat(course?.price) > 0 ? `$${course.price}` : 'Free'}
                    </span>
                    
                    <div className="course-actions">
                        <button 
                            className={`like-btn ${course?.is_liked ? 'liked' : ''}`} 
                            onClick={() => onLike?.(course.id)}
                            type="button"
                        >
                            <span>{course?.is_liked ? '❤️' : '🤍'}</span>
                            <span className="like-count">{course?.likes_count || 0}</span>
                        </button>

                        <button 
                            className="course-btn" 
                            onClick={() => setShowComments(prev => !prev)}
                            type="button"
                        >
                            {showComments ? 'Hide' : `Details (${comments.length})`}
                        </button>

                        {isSeller && (
                            <button 
                                className="delete-btn" 
                                onClick={() => onDelete?.(course.id)}
                                type="button"
                                title="Delete Course"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {showComments && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        {currentUser ? (
                            <form onSubmit={sendComment} className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    placeholder="Write a comment..."
                                    value={text}
                                    onChange={e => setText(e.target.value)}
                                    className="flex-grow px-3 py-1 text-xs border rounded-xl outline-none bg-gray-50 focus:border-blue-500"
                                />
                                <button 
                                    type="submit" 
                                    disabled={sending || !text.trim()} 
                                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded-xl disabled:opacity-50"
                                >
                                    {sending ? '...' : 'Send'}
                                </button>
                            </form>
                        ) : (
                            <p className="text-xs text-gray-400 italic mb-3">Sign in to comment.</p>
                        )}

                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {comments.length > 0 ? (
                                comments.map(c => (
                                    <div key={c.id} className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                                        <div className="flex justify-between text-[10px] mb-0.5">
                                            <span className="font-bold text-gray-700">{c.user?.name || 'Anonymous'}</span>
                                            <span className="text-gray-400">
                                                {c.created_at ? new Date(c.created_at).toLocaleDateString() : ''}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600">{c.content}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400 text-center py-2">No comments yet.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}