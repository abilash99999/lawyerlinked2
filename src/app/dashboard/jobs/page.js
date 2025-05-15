'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabaseClient';

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobsWithFirmDetails = async () => {
            const { data: jobsData, error: jobsError } = await supabase
                .from('job')
                .select('*');

            if (jobsError) {
                console.error('Error fetching jobs:', jobsError);
                setLoading(false);
                return;
            }

            const jobsWithFirm = await Promise.all(
                jobsData.map(async (job) => {
                    const { data: firmData, error: firmError } = await supabase
                        .from('firm')
                        .select('name, city, logo_url')  // Assuming logo_url is the image field
                        .eq('email', job.email)
                        .single();

                    return {
                        ...job,
                        firm: firmData || { name: 'Unknown Firm', city: 'Unknown City', logo_url: '/corporation.png' },  // Default image
                    };
                })
            );

            setJobs(jobsWithFirm);
            setLoading(false);
        };

        fetchJobsWithFirmDetails();
    }, []);

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Job Listings</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-gray-600">Loading jobs...</p>
                ) : jobs.length === 0 ? (
                    <p className="text-gray-600">No job listings available.</p>
                ) : (
                    jobs.map((job) => (
                        <Link key={job.id} href={`/dashboard/jobs/${job.id}`}>
                            <div className="flex flex-col space-y-4 p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={job.firm.logo_url}
                                        alt={job.firm.name}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">{job.name}</h3>
                                        <div className="flex justify-between items-center text-sm text-gray-600 gap-2">
                                            <p>
                                                <span className="font-medium text-gray-700">Experience:</span> {job.experience}
                                            </p>
                                            <p>
                                                <span className="font-medium text-gray-700">Type:</span> {job.type}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 text-sm text-gray-500">
                                    <span className="font-semibold text-gray-700">Firm:</span> {job.firm_name}, {job.city}
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
