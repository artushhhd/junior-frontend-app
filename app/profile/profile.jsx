'use client';

<<<<<<< HEAD
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
=======
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
>>>>>>> cebc24a3c4fa7a0a1e05caca260ee28e01a99992

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function ProfileCard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    fetch(`${API_URL}/api/profile`, {
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Accept': 'application/json' 
      }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(res => {
        if (res?.success) setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  const logout = async () => {
    setExiting(true);
    const token = localStorage.getItem('token');
    
    try {
      await fetch(`${API_URL}/api/logout`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Accept': 'application/json' 
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  if (loading) return (
    <div className="flex justify-center py-12">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
    </div>
  );

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200/60 bg-white p-6 text-center shadow-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-xl font-bold text-white">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <h2 className="text-lg font-bold text-slate-900">Profile</h2>
      </div>

      <div className="my-5 border-t border-b border-slate-100 py-4 text-left space-y-3 text-sm">
        {['name', 'email'].map((field) => (
          <div key={field}>
            <span className="block text-xs text-slate-400 font-medium capitalize">{field}</span>
            <span className="font-semibold text-slate-800">{user?.[field]}</span>
          </div>
        ))}
        
        {user?.role && (
          <div>
            <span className="block text-xs text-slate-400 font-medium">Role</span>
            <span className="mt-1 inline-block rounded bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 capitalize">
              {user.role}
            </span>
          </div>
        )}
      </div>

      <button 
        onClick={logout} 
        disabled={exiting}
        className="w-full rounded-xl bg-rose-50 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 active:scale-95 disabled:opacity-50 cursor-pointer"
      >
        {exiting ? 'Logging out...' : 'Log out'}
      </button>
    </div>
  );
}