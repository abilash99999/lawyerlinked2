'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogIn, UserPlus, Building2, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient"; // Adjust path as needed

export default function Header() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState(null);

    const router = useRouter();

    useEffect(() => {
        setMounted(true);

        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        getUser();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            listener?.subscription?.unsubscribe();
        };
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push('/');
    };

    if (!mounted) return null;

    const isDark = theme === 'dark';
    const userInitial = user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

    return (
        <header className={`z-50 top-0 left-0 right-0 border-b flex justify-between items-center p-4 ${isDark ? "text-[#9FBEDC]" : "text-[#0F1C3F]"}`}>
            <div className="flex items-center gap-4 pl-4">
                <Link href="/" className="flex items-center gap-4">
                    <Image src="/legislation.png" width={50} height={50} alt="LawyerLinked Logo" />
                    <h1 className="text-2xl font-bold text-[#1A4D8F] hidden sm:block">LawyerLinked</h1>
                </Link>
            </div>

            <div className="flex gap-4 pr-4 items-center">
                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                    className="rounded-full"
                >
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>

                {user ? (
                    <>
                        {/* Unified User Dropdown for All Screens */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="rounded-full w-9 h-9 text-sm font-semibold p-0">
                                    {userInitial}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <div className="px-2 py-1 text-sm text-muted-foreground font-semibold">
                                    {user.user_metadata?.full_name || user.email}
                                </div>
                                <DropdownMenuItem onClick={logout}>
                                    <LogOut className="w-4 h-4 mr-2" /> Logout
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                                    <User className="w-4 h-4 mr-2" /> Lawyer Dashboard
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push("/dashboard-firm")}>
                                    <Building2 className="w-4 h-4 mr-2" /> Firm Dashboard
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                ) : (
                    <>
                        {/* Login/Signup Buttons (Desktop) */}
                        <div className="hidden sm:flex gap-4">
                            {/* Login Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`rounded-full ${isDark ? "border-[#9FBEDC]" : "border-[#0F1C3F]"} ${isDark ? "text-[#9FBEDC]" : "text-[#0F1C3F]"} ${isDark ? "hover:bg-[#1a1a1a]" : "hover:bg-[#f3f3f3]"}`}
                                    >
                                        <LogIn className="w-4 h-4 mr-2" /> Login
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => router.push("/login")}>
                                        <User className="w-4 h-4 mr-2" /> Login as Lawyer
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push("/login-firm")}>
                                        <Building2 className="w-4 h-4 mr-2" /> Login as Firm
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </div>

                        {/* Login/Signup Buttons (Mobile) */}
                        <div className="flex sm:hidden gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="rounded-full p-2">
                                        <LogIn className={`w-4 h-4 ${isDark ? "text-[#9FBEDC]" : "text-[#0F1C3F]"}`} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => router.push("/login")}>
                                        <User className="w-4 h-4 mr-2" /> Login as Lawyer
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push("/login-firm")}>
                                        <Building2 className="w-4 h-4 mr-2" /> Login as Firm
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </div>
                    </>
                )}
            </div>
        </header>
    );
}
