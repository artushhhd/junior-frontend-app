'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, setToken as saveToken, clearToken } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await api.get('profile');
            setUser(res.data.user);
        } catch {
            clearToken();
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchUser(); }, [fetchUser]);

    const login = async (email, password) => {
        const res = await api.post('login', { email, password });
        saveToken(res.data.access_token);
        setUser(res.data.user);
        return res;
    };

    const register = async (data) => {
        const res = await api.post('register', data);
        saveToken(res.data.access_token);
        setUser(res.data.user);
        return res;
    };

    const logout = async () => {
        try { await api.post('logout'); } catch {}
        clearToken();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}

const STAFF_ROLES = ['superadmin', 'admin', 'moderator'];

export function isStaff(user) {
    return STAFF_ROLES.includes(user?.role?.toLowerCase());
}
