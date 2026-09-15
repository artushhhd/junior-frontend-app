'use client';

import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useAuth, isStaff } from '../../lib/auth';
import './admin.css';

export default function AdminDashboard() {
    const [tab, setTab] = useState('courses');
    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingCourse, setEditingCourse] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        if (!isStaff(user)) return;

        const endpoint = tab === 'courses' ? 'admin/courses' : 'admin/users';
        api.get(endpoint).then(data => {
            if (tab === 'courses') {
                setCourses(data?.courses?.data ?? data?.courses ?? []);
            } else {
                setUsers(data?.users?.data ?? data?.users ?? []);
            }
        }).catch(console.error);
    }, [tab, user]);

    const handleApprove = async (id) => {
        try {
            await api.post(`admin/courses/${id}/approve`);
            setCourses(prev => prev.map(c => c.id === id ? { ...c, status: 'published' } : c));
        } catch (err) { console.error(err); }
    };

    const handleCourseDelete = async (id) => {
        if (!confirm('Delete course?')) return;
        try {
            await api.delete(`admin/courses/${id}`);
            setCourses(prev => prev.filter(c => c.id !== id));
        } catch (err) { console.error(err); }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!editingCourse) return;
        try {
            await api.post(`admin/courses/${editingCourse.id}`, { title: editTitle });
            setCourses(prev => prev.map(c => c.id === editingCourse.id ? { ...c, title: editTitle } : c));
            setEditingCourse(null);
        } catch (err) { console.error(err); }
    };

    const handleToggleBlock = async (id) => {
        try {
            const data = await api.post(`admin/users/${id}/toggle-block`);
            setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: data.is_active } : u));
        } catch (err) { console.error(err); }
    };

    const handleUserDelete = async (id) => {
        if (!confirm('Delete user?')) return;
        try {
            await api.delete(`admin/users/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (err) { console.error(err); }
    };

    const currentRole = user?.role?.toLowerCase() || '';
    const isModer = currentRole.includes('moder');

    const canManage = (target) => {
        const role = target.role?.toLowerCase() || '';
        if (role === 'superadmin') return false;
        if (currentRole === 'superadmin') return true;
        return currentRole === 'admin' && role === 'user';
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
                                <th className="admin-th">Course</th>
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
                                        {course.status !== 'published' && (
                                            <button onClick={() => handleApprove(course.id)} className="btn-action bg-green-600 text-white">Approve</button>
                                        )}
                                        {currentRole === 'superadmin' && (
                                            <button onClick={() => { setEditingCourse(course); setEditTitle(course.title); }} className="btn-action bg-blue-50 text-blue-600">Edit</button>
                                        )}
                                        {(currentRole === 'superadmin' || course.author?.role?.toLowerCase() !== 'superadmin') ? (
                                            <button onClick={() => handleCourseDelete(course.id)} className="btn-action bg-red-50 text-red-600">Delete</button>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Protected</span>
                                        )}
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
                                <th className="admin-th">Status</th>
                                <th className="admin-th">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="admin-tr">
                                    <td className="admin-td">
                                        <div className="font-semibold text-gray-900">{user.name}</div>
                                        <div className="text-xs text-gray-400">{user.email}</div>
                                    </td>
                                    <td className="admin-td capitalize text-xs text-gray-500">{user.role}</td>
                                    <td className="admin-td">
                                        <span className={`status-tag ${user.is_active ? 'status-active' : 'status-pending'}`}>
                                            {user.is_active ? 'Active' : 'Blocked'}
                                        </span>
                                    </td>
                                    <td className="admin-td flex gap-2">
                                        {canManage(user) ? (
                                            <>
                                                <button onClick={() => handleToggleBlock(user.id)} className={`btn-action text-white ${user.is_active ? 'bg-amber-500' : 'bg-emerald-600'}`}>
                                                    {user.is_active ? 'Block' : 'Unblock'}
                                                </button>
                                                <button onClick={() => handleUserDelete(user.id)} className="btn-action bg-red-600 text-white">Delete</button>
                                            </>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Protected</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {editingCourse && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Course</h2>
                        <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Title</label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={e => setEditTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-2">
                                <button type="button" onClick={() => setEditingCourse(null)} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
