'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';

export default function PostJobPage() {
    const [jobName, setJobName] = useState('');
    const [experience, setExperience] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('full-time');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (error || !user) {
                alert('You must be logged in to post a job.');
                router.push('/login');
            } else {
                setUserEmail(user.email);
            }
        };

        fetchUser();
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        // Step 1: Check if firm exists for the logged-in user
        const { data: firmData, error: firmError } = await supabase
            .from('firm')
            .select('name, city')
            .eq('email', userEmail)
            .single();

        if (firmError || !firmData) {
            setLoading(false);
            setErrorMessage('Please complete your firm profile before posting a job.');
            return;
        }

        // Step 2: Insert job with firm_name and city
        const { error: jobError } = await supabase.from('job').insert([
            {
                name: jobName,
                experience: parseInt(experience),
                about: description,
                email: userEmail,
                type,
                firm_name: firmData.name,
                city: firmData.city,
            },
        ]);

        setLoading(false);

        if (jobError) {
            setErrorMessage('Failed to post job: ' + jobError.message);
        } else {
            setSuccess(true);
            setTimeout(() => router.push('/dashboard-firm'), 2000);
        }
    };

    return (
        <div className="text-foreground p-4 flex flex-col font-[family-name:var(--font-geist-sans)]">
            <h3 className="text-4xl font-bold mb-4">Post a Job for a Lawyer</h3>
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-xl bg-white dark:bg-black shadow-xl rounded-2xl p-8 flex flex-col gap-6 border border-gray-300 dark:border-gray-700"
            >
                <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Job Name</span>
                    <input
                        type="text"
                        required
                        value={jobName}
                        onChange={(e) => setJobName(e.target.value)}
                        placeholder="e.g., Corporate Lawyer"
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-foreground"
                    />
                </label>

                <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Experience Required (in years)</span>
                    <input
                        type="number"
                        required
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="e.g., 3"
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-foreground"
                    />
                </label>

                <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Job Type</span>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-foreground"
                    >
                        <option value="full-time">Full-time</option>
                        <option value="contract">Contract</option>
                        <option value="part-time">Part-time</option>
                        <option value="internship">Internship</option>
                        <option value="remote">Remote</option>
                    </select>
                </label>

                <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium">About the Job</span>
                    <textarea
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the responsibilities, expectations, and legal domain..."
                        rows={5}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-foreground"
                    ></textarea>
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] rounded-full px-6 py-3 text-sm font-medium transition disabled:opacity-60"
                >
                    {loading ? 'Submitting...' : 'Post Job'}
                </button>

                {errorMessage && (
                    <p className="text-red-600 dark:text-red-400 text-sm">{errorMessage}</p>
                )}

                {success && (
                    <p className="text-green-600 dark:text-green-400 text-sm">
                        Job posted successfully! Redirecting...
                    </p>
                )}
            </form>
        </div>
    );
}
