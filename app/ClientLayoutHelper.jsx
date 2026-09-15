'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth, isStaff } from '../lib/auth';

const PUBLIC_ROUTES = ['/', '/login', '/register'];

export default function ClientLayoutHelper({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading } = useAuth();

    const isPublic = PUBLIC_ROUTES.includes(pathname);
    const staff = isStaff(user);

    useEffect(() => {
        if (loading) return;

        if (!user && !isPublic) {
            router.push('/login');
            return;
        }

        if (user && !staff && pathname.startsWith('/admin')) {
            router.push('/Course');
        }
    }, [loading, user, staff, pathname, isPublic, router]);

    if (loading && !isPublic) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
            {user && !isPublic && (
                <header className="sticky top-0 z-50 flex h-[60px] items-center justify-between bg-slate-900 px-[5%] text-white">
                    <div
                        className="cursor-pointer text-base font-bold tracking-wider"
                        onClick={() => router.push('/Course')}
                    >
                        DASHBOARD
                    </div>

                    <nav className="flex h-full items-center gap-5">
                        <NavBtn onClick={() => router.push('/Course')}>Shop</NavBtn>
                        <NavBtn onClick={() => router.push('/addCourse')}>Add Course</NavBtn>
                        <NavBtn onClick={() => router.push('/like')}>Likes</NavBtn>
                        <NavBtn onClick={() => router.push('/profile')}>Profile</NavBtn>

                        {staff && (
                            <button
                                onClick={() => router.push('/admin')}
                                className="cursor-pointer rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-indigo-500"
                            >
                                Settings
                            </button>
                        )}
                    </nav>
                </header>
            )}
            <main className={isPublic ? 'w-full' : 'mx-auto w-full max-w-[1400px] p-6 sm:p-10'}>
                {children}
            </main>
        </div>
    );
}

function NavBtn({ onClick, children }) {
    return (
        <button
            onClick={onClick}
            className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white max-sm:px-2"
        >
            {children}
        </button>
    );
}
