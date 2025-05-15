'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';

export default function FirmDashboardPage() {
    const [user, setUser] = useState(null);
    const [isFirm, setIsFirm] = useState(null);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchUserAndJobs = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            const currentUser = session?.user;
            setUser(currentUser);

            if (currentUser?.email) {
                const { data: firmEntry, error: firmError } = await supabase
                    .from('firm')
                    .select('*')
                    .eq('email', currentUser.email)
                    .single();

                if (firmError || !firmEntry) {
                    setIsFirm(false);
                } else {
                    setIsFirm(true);
                }

                // Fetch jobs
                const { data: jobData, error: jobError } = await supabase
                    .from('job')
                    .select('id, name, about, type, experience')
                    .eq('email', currentUser.email);

                if (!jobError) {
                    setJobs(jobData || []);
                } else {
                    console.error('Error fetching jobs:', jobError.message);
                }
            }
        };

        fetchUserAndJobs();
    }, []);

    return (
        <div>
            <div className="text-sm text-gray-500 mb-2">Welcome back,</div>
            <h2 className="text-2xl font-medium text-gray-800 mb-6">
                {user?.user_metadata?.full_name || 'Firm'} 👋
            </h2>

            {isFirm === false && (
                <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                    You have not yet completed your firm profile.{' '}
                    <Link href="/dashboard-firm/profile" className="underline font-semibold text-red-800">
                        Click here to update your profile
                    </Link>{' '}
                    and get listed as a verified firm.
                </div>
            )}

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-200 max-w-2xl mb-8">
                <h3 className="text-lg font-semibold text-gray-700">Main Content</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    This is your firm dashboard area. Use it to manage your job postings and track candidate activity.
                </p>

                {isFirm && (
                    <div className="mt-6">
                        <h4 className="text-md font-semibold text-gray-800 mb-2">Post a Job</h4>
                        <p className="text-sm text-gray-600">
                            You can post a new job opening to attract potential lawyers.
                        </p>
                        <Link
                            href="/dashboard-firm/post-job"
                            className="inline-block mt-3 text-sm text-white bg-blue-600 hover:bg-blue-700 font-semibold py-2 px-4 rounded-xl"
                        >
                            Post a Job
                        </Link>
                    </div>
                )}
            </div>

            {isFirm && (
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-200 max-w-2xl">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Active Jobs</h3>
                    {jobs.length === 0 ? (
                        <p className="text-sm text-gray-500">No active jobs found.</p>
                    ) : (
                        <ul className="space-y-4">
                            {jobs.map((job) => (
                                <li key={job.id}>
                                    <Link href={`/dashboard-firm/jobs/${job.id}`}>
                                        <div className="p-4 border rounded-xl hover:shadow-md transition cursor-pointer">
                                            <h4 className="text-md font-semibold text-gray-800">{job.name}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{job.about}</p>
                                            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                                                <span>Type: {job.type}</span>
                                                <span>Experience: {job.experience}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
