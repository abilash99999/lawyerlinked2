'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import { Loader } from 'lucide-react';


export default function Login() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);

    // Check if user is already logged in on mount
    useEffect(() => {
        const checkSession = async () => {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (session) {
                router.replace('/dashboard');
            } else if (error) {
                console.error('OAuth login error:', error.message);
            }
            setCheckingSession(false);
        };

        checkSession();
    }, [router]);

    // Listen for real-time auth changes (optional but useful)
    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                router.replace('/dashboard');
            }
        });

        return () => {
            listener?.subscription.unsubscribe();
        };
    }, [router]);

    const handleGoogleLogin = async () => {
        setIsLoading(true);

        // Add 'prompt' parameter to the OAuth request to force account selection
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'http://localhost:3000/dashboard', // Use your domain in production
                queryParams: {
                    prompt: 'select_account',  // Forces Google to always ask for account selection
                },
            },
        });

        if (error) {
            setError('Google login failed');
            console.error('Google login error:', error.message);
        }
        setIsLoading(false);
    };


    if (checkingSession) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="animate-spin h-8 w-8 text-black" />
            </div>
        );
    }


    return (
        <div className="mt-30 flex flex-col md:flex-row items-center justify-center bg-white ">
            {/* Left Side: Branding */}
            <div className="w-full md:w-1/2 p-8 text-center md:text-left flex items-center justify-center md:justify-start">
                <div>
                    <Link href="/" className="text-5xl font-bold mb-4 text-black">
                        LawyerLinked
                    </Link>
                    <p className="text-lg text-black">Lawyer access to the LawyerLinked platform</p>
                </div>
            </div>

            {/* Right Side: Google Login */}
            <div className="w-full md:w-1/4 p-8 text-black">
                <h1 className="text-3xl font-bold mb-6 text-left">Lawyer Login</h1>

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <button
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className={`mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 border border-black rounded-md hover:bg-gray-100 ${isLoading ? 'bg-gray-400' : ''}`}
                >
                    <Image src="/google.png" alt="Google logo" width={20} height={20} />
                    <span className="text-sm text-black">{isLoading ? 'Logging in...' : 'Sign in with Google'}</span>
                </button>

                <div className="mt-6 text-center text-sm">
                    <a href="/signup" className="text-black hover:text-gray-800 hover:underline">
                        Don't have a lawyer account? Sign up
                    </a>

                </div>
            </div>
        </div>
    );
}
