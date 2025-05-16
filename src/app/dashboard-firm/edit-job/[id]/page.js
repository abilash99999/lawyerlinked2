'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../../lib/supabaseClient';

export default function EditJobPage() {
    const { id } = useParams();
    const router = useRouter();

    const [form, setForm] = useState({
        name: '',
        experience: '',
        type: '',
        about: '',
    });

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchJob = async () => {
            const { data: jobData, error: jobError } = await supabase
                .from('job')
                .select('*')
                .eq('id', id)
                .single();

            if (jobError) {
                console.error('Error fetching job:', jobError.message);
                setError('Failed to load job.');
            } else if (jobData) {
                setForm({
                    name: jobData.name || '',
                    experience: jobData.experience || '',
                    type: jobData.type || '',
                    about: jobData.about || '',
                });
            }

            setLoading(false);
        };

        if (id) fetchJob();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError('');
        setSuccess('');

        const { error: updateError } = await supabase
            .from('job')
            .update({
                name: form.name,
                experience: parseInt(form.experience),
                type: form.type,
                about: form.about,
            })
            .eq('id', id);

        if (updateError) {
            setError('Failed to update job.');
            console.error(updateError.message);
        } else {
            setSuccess('Job updated successfully!');
            setTimeout(() => router.push(`/dashboard-firm/jobs/${id}`), 1000);
        }

        setUpdating(false);
    };

    if (loading) return <div>Loading job details...</div>;

    return (
        <div className="max-w-xl  p-6">
            <h2 className="text-2xl font-bold mb-6">Edit Job</h2>

            {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}
            {success && <div className="mb-4 text-green-600 font-medium">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Job Title</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
                    <input
                        type="number"
                        name="experience"
                        value={form.experience}
                        onChange={handleChange}
                        required
                        min="0"
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <input
                        type="text"
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">About</label>
                    <textarea
                        name="about"
                        value={form.about}
                        onChange={handleChange}
                        required
                        rows="5"
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={updating}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold"
                >
                    {updating ? 'Updating...' : 'Update Job'}
                </button>
            </form>
        </div>
    );
}
