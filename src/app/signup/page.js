'use client';

import { useState } from 'react';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Basic validation
        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            // Simulate an API call for signup (replace with real API)
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Signup successful!');
                // Redirect or clear form
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-white">
            {/* Left Side: LawyerLinked Text */}
            <div className="w-full md:w-1/2 p-8 text-center md:text-left flex items-center justify-center md:justify-start">
                <div className="text-center md:text-left">
                    <h1 className="text-5xl font-bold mb-4 text-black">LawyerLinked</h1>
                    <p className="text-lg text-black">Join the legal connection platform</p>
                </div>
            </div>

            {/* Right Side: Signup Form */}
            <div className="w-full md:w-1/4 p-8 text-black">
                <h1 className="text-3xl font-bold mb-6 text-left">Sign Up</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Input */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-black">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border border-black rounded-md focus:outline-none"
                            required
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-black">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border border-black rounded-md focus:outline-none"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-black">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border border-black rounded-md focus:outline-none"
                            required
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-black">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border border-black rounded-md focus:outline-none"
                            required
                        />
                    </div>

                    {/* Error message */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 px-4 rounded-md text-white ${isLoading ? 'bg-black' : 'bg-black hover:bg-gray-700'} focus:outline-none`}
                    >
                        {isLoading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="mt-6 text-center text-sm">
                    <a href="/login" className="text-black hover:text-gray-800 hover:underline">
                        Already have an account? Login
                    </a>
                </div>
            </div>
        </div>
    );
}
