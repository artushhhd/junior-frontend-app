'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const PUBLIC_ROUTES = ['/', '/login', '/register'];

export default function ClientLayoutHelper({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    
    const [user, setUser] = useState({ mounted: false, loggedIn: false, role: null });
    const isPublic = PUBLIC_ROUTES.includes(pathname);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

        if (!token) {
            setUser({ mounted: true, loggedIn: false, role: null });
            if (!isPublic) router.push('/login');
            return;
        }

        fetch(`${apiUrl}/api/profile`, {
            headers: { 
                'Authorization': `Bearer ${token}`, 
                'Accept': 'application/json' 
            }
        })
        .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then(result => {
            if (result.success) {
                const userData = result.data.user;
                const role = userData.role ? userData.role.toLowerCase().trim() : '';
                
                setUser({ mounted: true, loggedIn: true, role });
                const isAdmin = role !== 'user' && role !== '';
                if (pathname.startsWith('/admin') && !isAdmin) {
                    router.push('/dashboard'); 
                }
            }
        })
        .catch(() => {
            localStorage.removeItem('token');
            setUser({ mounted: true, loggedIn: false, role: null });
            if (!isPublic) router.push('/login');
        });
    }, [pathname, router]);
    if (!user.mounted) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
                Loading...
            </div>
        );
    }

    const showSettings = user.role !== 'user' && user.role !== '';

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
            {user.loggedIn && !isPublic && (
                <header className="sticky top-0 z-50 flex h-[60px] items-center justify-between bg-slate-900 px-[5%] text-white">
                    <div 
                        className="cursor-pointer text-base font-bold tracking-wider" 
                        onClick={() => router.push('/dashboard')}
                    >
                        DASHBOARD
                    </div>
                    
                    <nav className="flex h-full items-center gap-5">
                        <button onClick={() => router.push('/Course')} className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white max-sm:px-2">
                            Shop
                        </button>
                        <button onClick={() => router.push('/profile')} className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white max-sm:px-2">
                            Profile
                        </button>
                        
                        {showSettings && (
                            <button onClick={() => router.push('/admin')} className="cursor-pointer rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-indigo-500">
                                Settings
                            </button>
                        )}

                        <button onClick={() => router.push('/addCourse')} className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white max-sm:px-2">
                            add Course
                        </button>
                        <button onClick={() => router.push('/like')} className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white max-sm:px-2">
                            Likes
                        </button>
                    </nav>
                </header>
            )}
            <main className={isPublic ? 'w-full' : 'mx-auto w-full max-w-[1400px] p-6 sm:p-10'}>
                {children}
            </main>
        </div>
    );
}