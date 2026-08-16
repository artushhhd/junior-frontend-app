'use client';

import { useEffect, useState } from 'react';
import './admin.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export default function AdminDashboard() {
    const [tab, setTab] = useState('courses');
    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    // Состояния для редактирования
    const [editingCourse, setEditingCourse] = useState(null);
    const [editTitle, setEditTitle] = useState('');

    const apiRequest = async (url, options = {}) => {
        try {
            const res = await fetch(`${API_URL}/${url}`, {
                ...options,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });
            if (!res.ok) throw new Error();
            return res.status !== 204 ? await res.json() : true;
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    useEffect(() => {
        apiRequest('user').then(setCurrentUser);
    }, []);

    useEffect(() => {
        const endpoint = tab === 'courses' ? 'admin/courses' : 'admin/users';
        apiRequest(endpoint).then(data => {
            const fallback = [];
            if (tab === 'courses') {
                setCourses(Array.isArray(data) ? data : data?.courses || fallback);
            } else {
                setUsers(Array.isArray(data) ? data : data?.users || fallback);
            }
        });
    }, [tab]);

    const handleApprove = async (id) => {
        const res = await apiRequest(`admin/courses/${id}/approve`, { method: 'POST' });
        if (res) setCourses(prev => prev.map(c => c.id === id ? { ...c, status: 'published' } : c));
    };

    const handleCourseDelete = async (id) => {
        if (!confirm('Delete course?')) return;
        const res = await apiRequest(`admin/courses/${id}`, { method: 'DELETE' });
        if (res) setCourses(prev => prev.filter(c => c.id !== id));
    };

    // Открытие формы редактирования
    const handleStartEdit = (course) => {
        setEditingCourse(course);
        setEditTitle(course.title);
    };

    // Сохранение изменений курса
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!editingCourse) return;

        const res = await apiRequest(`admin/courses/${editingCourse.id}`, {
            method: 'PUT',
            body: JSON.stringify({ title: editTitle }),
        });

        if (res) {
            setCourses(prev => prev.map(c => c.id === editingCourse.id ? { ...c, title: editTitle } : c));
            setEditingCourse(null);
            setEditTitle('');
        }
    };

    const handleToggleBlock = async (id) => {
        const data = await apiRequest(`admin/users/${id}/toggle-block`, { method: 'POST' });
        if (data) setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: data.is_active } : u));
    };

    const handleUserDelete = async (id) => {
        if (!confirm('Delete user?')) return;
        const res = await apiRequest(`admin/users/${id}`, { method: 'DELETE' });
        if (res) setUsers(prev => prev.filter(u => u.id !== id));
    };

    const currentRole = currentUser?.role?.toLowerCase() || '';
    const isModer = currentRole.includes('moder');

    const canManage = (targetUser) => {
        const targetRole = targetUser.role?.toLowerCase() || '';
        if (targetRole === 'superadmin') return false;
        if (currentRole === 'superadmin') return true;
        return currentRole === 'admin' && targetRole === 'user';
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1 className="admin-title">Management Panel</h1>
                <div className="flex gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                    <button onClick={() => setTab('courses')} className={`tab-btn ${tab === 'courses' ? 'tab-btn-active' : 'tab-btn-inactive'}`}>Courses</button>
                    {!isModer && <button onClick={() => setTab('users')} className={`tab-btn ${tab === 'users' ? 'tab-btn-active' : 'tab-btn-inactive'}`}>Users</button>}
                </div>
            </header>

            <div className="admin-table-wrapper">
                {tab === 'courses' ? (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th className="admin-th">Course Details</th>
                                <th className="admin-th">Author</th>
                                <th className="admin-th">Status</th>
                                <th className="admin-th">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course.id} className="admin-tr">
                                    <td className="admin-td font-semibold text-gray-900">{course.title}</td>
                                    <td className="admin-td">{course.author?.name || 'Deleted'}</td>
                                    <td className="admin-td">
                                        <span className={`status-tag ${course.status === 'published' ? 'status-active' : 'status-pending'}`}>{course.status}</span>
                                    </td>
                                    <td className="admin-td flex gap-2">
                                        {course.status !== 'published' && <button onClick={() => handleApprove(course.id)} className="btn-action bg-green-600 text-white">Approve</button>}
                                        
                                        {/* Кнопка Edit доступна только Superadmin */}
                                        {currentRole === 'superadmin' && (
                                            <button onClick={() => handleStartEdit(course)} className="btn-action bg-blue-50 text-blue-600 shadow-none">Edit</button>
                                        )}

                                        {(currentRole === 'superadmin' || (course.author?.role?.toLowerCase() !== 'superadmin')) ? (
                                            <button onClick={() => handleCourseDelete(course.id)} className="btn-action bg-red-50 text-red-600 shadow-none">Delete</button>
                                        ) : <span className="text-xs text-gray-400 italic">Protected</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th className="admin-th">User</th>
                                <th className="admin-th">Role</th>
                                <th className="admin-th">Account status</th>
                                <th className="admin-th">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => {
                                const isActive = String(user.is_active) === '1' || user.is_active === true;
                                return (
                                    <tr key={user.id} className="admin-tr">
                                        <td className="admin-td">
                                            <div className="font-semibold text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-400">{user.email}</div>
                                        </td>
                                        <td className="admin-td capitalize font-medium text-xs text-gray-500">{user.role}</td>
                                        <td className="admin-td">
                                            <span className={`status-tag ${isActive ? 'status-active' : 'status-pending'}`}>{isActive ? 'Active' : 'Blocked'}</span>
                                        </td>
                                        <td className="admin-td flex gap-2">
                                            {canManage(user) ? (
                                                <>
                                                    <button onClick={() => handleToggleBlock(user.id)} className={`btn-action text-white ${isActive ? 'bg-amber-500' : 'bg-emerald-600'}`}>
                                                        {isActive ? 'Block' : 'Unblock'}
                                                    </button>
                                                    <button onClick={() => handleUserDelete(user.id)} className="btn-action bg-red-600 text-white">Delete</button>
                                                </>
                                            ) : <span className="text-xs text-gray-400 italic">Protected</span>}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Модальное окно редактирования курса */}
            {editingCourse && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Course</h2>
                        <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Title</label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingCourse(null)}
                                    className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}