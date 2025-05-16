'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import {
    Briefcase,
    Info,
    BadgeCheck,
    LoaderCircle,
    MailCheck,
} from 'lucide-react';

export default function JobDetailPage() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [userEmail, setUserEmail] = useState('');
    const [lawyerId, setLawyerId] = useState(null);
    const [alreadyApplied, setAlreadyApplied] = useState(false);
    const [applying, setApplying] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobDetails = async () => {
            setLoading(true);

            // Fetch job data first
            const { data: jobData, error: jobError } = await supabase
                .from('job')
                .select('*')
                .eq('id', id)
                .single();

            if (jobError || !jobData) {
                console.error('Error fetching job:', jobError);
                setLoading(false);
                return;
            }

            let candidates = [];

            try {
                if (typeof jobData.candidate === 'string') {
                    candidates = JSON.parse(jobData.candidate);
                } else if (Array.isArray(jobData.candidate)) {
                    candidates = jobData.candidate;
                }
            } catch (e) {
                console.error('Error parsing candidate field:', e);
            }

            setJob({ ...jobData, candidate: candidates });

            // Then try to get user (optional)
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                const email = user.email;
                setUserEmail(email);

                const { data: lawyerData, error: lawyerError } = await supabase
                    .from('lawyer')
                    .select('id')
                    .eq('email', email)
                    .single();

                if (!lawyerError && lawyerData) {
                    setLawyerId(lawyerData.id);
                    setAlreadyApplied(candidates.includes(lawyerData.id));
                }
            }

            setLoading(false);
        };

        fetchJobDetails();
    }, [id]);

    const handleApply = async () => {
        setApplying(true);

        // Check auth
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            alert('Please log in to apply.');
            setApplying(false);
            return;
        }

        const email = user.email;
        setUserEmail(email);

        // Check if user is a lawyer
        const { data: lawyerData, error: lawyerError } = await supabase
            .from('lawyer')
            .select('id')
            .eq('email', email)
            .single();

        if (lawyerError || !lawyerData) {
            alert('Please complete your lawyer profile before applying.');
            setApplying(false);
            return;
        }

        const lawyerId = lawyerData.id;
        const currentCandidates = Array.isArray(job.candidate) ? job.candidate : [];

        if (currentCandidates.includes(lawyerId)) {
            setAlreadyApplied(true);
            setApplying(false);
            return;
        }

        const updatedCandidates = [...currentCandidates, lawyerId];

        const { error: updateError } = await supabase
            .from('job')
            .update({ candidate: updatedCandidates })
            .eq('id', id);

        if (updateError) {
            console.error('❌ Error updating candidates:', updateError.message);
            alert('Something went wrong while applying.');
            setApplying(false);
            return;
        }

        setAlreadyApplied(true);
        setJob(prev => ({ ...prev, candidate: updatedCandidates }));
        setApplying(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh] text-gray-600">
                <LoaderCircle className="animate-spin mr-2" />
                <p>Loading job details...</p>
            </div>
        );
    }

    if (!job) {
        return <p className="text-red-600 mt-6">Job not found.</p>;
    }

    return (
        <div className="max-w-3xl ml-7 mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-200 space-y-4">
            <div className="flex items-center gap-2">
                <Briefcase className="text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">{job.name}</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium text-gray-700">Firm:</span> {job.firm_name}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium text-gray-700">City:</span> {job.city}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium text-gray-700">About:</span> {job.about}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium text-gray-700">Experience:</span> {job.experience}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium text-gray-700">Type:</span> {job.type}
            </div>

            <div className="mt-6">
                {alreadyApplied ? (
                    <div className="flex items-center text-green-600 font-medium gap-2">
                        <MailCheck className="text-green-600" />
                        <p>You have applied for this job.</p>
                    </div>
                ) : (
                    <button
                        onClick={handleApply}
                        disabled={applying}
                        className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-150 ${applying ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {applying ? (
                            <>
                                <LoaderCircle className="animate-spin" />
                                Applying...
                            </>
                        ) : (
                            <>
                                <BadgeCheck />
                                Apply
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
