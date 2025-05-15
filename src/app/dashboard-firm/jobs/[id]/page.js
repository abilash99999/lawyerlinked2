'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../../../lib/supabaseClient';

export default function JobDetailsPage() {
    const params = useParams();
    const jobId = params?.id;
    const [job, setJob] = useState(null);
    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobAndLawyers = async () => {
            setLoading(true);

            const { data: jobData, error: jobError } = await supabase
                .from('job')
                .select('*')
                .eq('id', jobId)
                .single();

            if (jobError) {
                console.error('Error fetching job:', jobError.message);
                setLoading(false);
                return;
            }

            setJob(jobData);

            const candidateEmails = jobData?.candidate || [];

            if (candidateEmails.length > 0) {
                const { data: lawyerData, error: lawyerError } = await supabase
                    .from('lawyer')
                    .select('name, description, experience, state, city, street, email, mobile_number, case_types')
                    .in('email', candidateEmails);

                if (lawyerError) {
                    console.error('Error fetching lawyers:', lawyerError.message);
                } else {
                    setLawyers(lawyerData);
                }
            }

            setLoading(false);
        };

        if (jobId) {
            fetchJobAndLawyers();
        }
    }, [jobId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!job) {
        return <div>Job not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 mb-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{job.name}</h2>
                        <p className="mt-1 text-sm text-gray-600">{job.about}</p>
                        <div className="mt-2 text-sm text-gray-500 space-x-4">
                            <span>Type: {job.type}</span>
                            <span>Experience: {job.experience}</span>
                        </div>
                    </div>
                    <Link
                        href={`/dashboard-firm/edit-job/${job.id}`}
                        className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold"
                    >
                        Edit
                    </Link>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Applied Lawyers</h3>
                {lawyers.length === 0 ? (
                    <p className="text-sm text-gray-500">No lawyers have applied to this job yet.</p>
                ) : (
                    <ul className="space-y-6">
                        {lawyers.map((lawyer, idx) => (
                            <li key={idx} className="p-4 border rounded-xl">
                                <h4 className="text-md font-semibold text-gray-800">{lawyer.name}</h4>
                                <p className="text-sm text-gray-600 mt-1">{lawyer.description}</p>
                                <div className="mt-2 text-sm text-gray-500 space-x-4">
                                    <span>Experience: {lawyer.experience}</span>
                                    <span>Location: {lawyer.street}, {lawyer.city}, {lawyer.state}</span>
                                </div>
                                <div className="mt-2 text-sm text-gray-500 space-x-4">
                                    <span>Email: {lawyer.email}</span>
                                    <span>Mobile: {lawyer.mobile_number}</span>
                                </div>
                                <div className="mt-2 text-sm text-gray-600">
                                    <span className="font-medium text-gray-700">Case Types:</span>{' '}
                                    {(lawyer.case_types || []).join(', ')}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
