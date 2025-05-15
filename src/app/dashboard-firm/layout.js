'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, User, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [collapsed, setCollapsed] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (error || !session) {
                router.replace('/login-firm');
            } else {
                setUser(session.user);
            }
        };

        fetchSession();
    }, [router]);

    const toggleSidebar = () => setCollapsed(!collapsed);

    return (
        <div className="flex font-sans bg-white overflow-auto min-h-screen">
            {/* Sidebar for medium and larger screens */}
            <aside
                className={`${collapsed ? 'w-20' : 'w-40'} hidden md:flex border-r bg-white p-4 flex-col items-start transition-all duration-300 ease-in-out`}
            >
                <div className="w-full">
                    <div className="mb-6 flex justify-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSidebar}
                            className="mx-auto"
                        >
                            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        </Button>
                    </div>

                    <nav className="space-y-4 w-full flex flex-col items-start">
                        <Link href="/dashboard-firm" passHref>
                            <Button variant="ghost" className="w-full justify-start gap-2">
                                <Home className="w-5 h-5 mx-auto" />
                                {!collapsed && 'Home'}
                            </Button>
                        </Link>
                        <Link href="/dashboard-firm/profile" passHref>
                            <Button variant="ghost" className="w-full justify-start gap-2">
                                <User className="w-5 h-5 mx-auto" />
                                {!collapsed && 'Profile'}
                            </Button>
                        </Link>
                        {/* <Link href="/dashboard/jobs" passHref>
                            <Button variant="ghost" className="w-full justify-start gap-2">
                                <Briefcase className="w-5 h-5 mx-auto" />
                                {!collapsed && 'Jobs'}
                            </Button>
                        </Link> */}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 sm:p-10">{children}</main>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-md flex justify-around items-center p-2 md:hidden">
                <Link href="/dashboard-firm">
                    <Button variant="ghost" size="icon">
                        <Home className="w-5 h-5" />
                    </Button>
                </Link>
                <Link href="/dashboard-firm/profile">
                    <Button variant="ghost" size="icon">
                        <User className="w-5 h-5" />
                    </Button>
                </Link>
                {/* <Link href="/dashboard/jobs">
                    <Button variant="ghost" size="icon">
                        <Briefcase className="w-5 h-5" />
                    </Button>
                </Link> */}
            </nav>
        </div>
    );
}
