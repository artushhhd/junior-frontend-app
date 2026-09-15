'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth';

export default function ProfileCard() {
    const router = useRouter();
    const { user, loading, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200/60 bg-white p-6 text-center shadow-sm">
            <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-xl font-bold text-white">
                    {user.name?.[0]?.toUpperCase()}
                </div>
                <h2 className="text-lg font-bold text-slate-900">Profile</h2>
            </div>

            <div className="my-5 border-t border-b border-slate-100 py-4 text-left space-y-3 text-sm">
                <div>
                    <span className="block text-xs text-slate-400 font-medium">Name</span>
                    <span className="font-semibold text-slate-800">{user.name}</span>
                </div>
                <div>
                    <span className="block text-xs text-slate-400 font-medium">Email</span>
                    <span className="font-semibold text-slate-800">{user.email}</span>
                </div>
                {user.role && (
                    <div>
                        <span className="block text-xs text-slate-400 font-medium">Role</span>
                        <span className="mt-1 inline-block rounded bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 capitalize">
                            {user.role}
                        </span>
                    </div>
                )}
            </div>

            <button
                onClick={handleLogout}
                className="w-full rounded-xl bg-rose-50 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 active:scale-95 cursor-pointer"
            >
                Log out
            </button>
        </div>
    );
}
