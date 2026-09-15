const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

function getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}

export function setToken(token) {
    localStorage.setItem('token', token);
}

export function clearToken() {
    localStorage.removeItem('token');
}

async function request(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
    };

    const res = await fetch(`${API_URL}/${endpoint}`, { ...options, headers });

    if (res.status === 401) {
        clearToken();
        if (typeof window !== 'undefined') window.location.href = '/login';
        throw new Error('Unauthorized');
    }

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const error = new Error(data.message || `Request failed (${res.status})`);
        error.status = res.status;
        error.data = data;
        throw error;
    }

    return res.status === 204 ? null : res.json();
}

export const api = {
    get: (endpoint) => request(endpoint),
    post: (endpoint, body, isForm = false) =>
        request(endpoint, { method: 'POST', body: isForm ? body : JSON.stringify(body) }),
    put: (endpoint, body) =>
        request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

const STORAGE_BASE = API_URL.replace(/\/api$/, '');

export function mediaUrl(path) {
    if (!path) return '/placeholder-course.png';
    if (/^https?:\/\//.test(path)) return path;
    return `${STORAGE_BASE}/storage/${path}`;
}

export { API_URL };
