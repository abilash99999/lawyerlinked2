'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabaseClient'; // Adjust the import path as needed
import { DatePickerDemo } from '@/components/ui/datepicker';
import { Button } from '@/components/ui/button';
import Select from 'react-select'; // Import react-select

export default function ProfilePage() {
    const [formData, setFormData] = useState({
        name: '',
        state: '',
        city: '',
        street: '',
        college: '',
        gender: '',
        dob: '',
        mobile_number: '',
        case_types: [],
        courts: [],
        experience: '',
        description: '',
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState('');
    const [isClient, setIsClient] = useState(false); // Added to check if we're on the client

    const caseTypeOptions = [
        { value: 'Criminal', label: 'Criminal' },
        { value: 'Civil', label: 'Civil' },
        { value: 'Family', label: 'Family' },
        { value: 'Corporate', label: 'Corporate' },
    ];

    const courtOptions = [
        { value: 'Supreme Court', label: 'Supreme Court' },
        { value: 'High Court', label: 'High Court' },
        { value: 'District Court', label: 'District Court' },
    ];

    useEffect(() => {
        // Set isClient to true after the first render (client-side)
        setIsClient(true);
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: userData, error: userError } = await supabase.auth.getUser();

            if (userError || !userData?.user) {
                setMessage('Error fetching user. Please log in again.');
                return;
            }

            const userEmail = userData.user.email;
            setEmail(userEmail);

            const { data, error } = await supabase
                .from('lawyer')
                .select('*')
                .eq('email', userEmail)
                .single();

            if (error && error.code !== 'PGRST116') {
                setMessage(`Error fetching profile: ${error.message}`);
                return;
            }

            if (data) {
                setFormData({
                    name: data.name || '',
                    state: data.state || '',
                    city: data.city || '',
                    street: data.street || '',
                    college: data.college || '',
                    gender: data.gender || '',
                    dob: data.dob || '',
                    mobile_number: data.mobile_number || '',
                    case_types: data.case_types || [],
                    courts: data.courts || [],
                    experience: data.experience || '',
                    description: data.description || '',
                });
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleMultiSelectChange = (selected, name) => {
        setFormData((prev) => ({ ...prev, [name]: selected.map(option => option.value) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setMessage('');
            setIsSubmitting(false);
            return;
        }

        const newLawyerData = {
            ...formData,
            email,
        };

        try {
            const { data, error } = await supabase
                .from('lawyer')
                .upsert([newLawyerData], { onConflict: ['email'] });

            if (error) {
                setMessage(`Error: ${error.message}`);
            } else {
                setMessage('Profile updated successfully!');
            }
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name) errors.name = 'Name is required';
        if (!formData.state) errors.state = 'State is required';
        if (!formData.city) errors.city = 'City is required';
        if (!formData.mobile_number) errors.mobile_number = 'Mobile number is required';
        if (!formData.case_types.length) errors.case_types = 'At least one case type must be selected';
        if (!formData.courts.length) errors.courts = 'At least one court must be selected';
        if (!formData.experience) errors.experience = 'Experience is required';

        return errors;
    };

    return (
        <div className="mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Profile</h1>

            {message && (
                <div className={`text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-500'} mb-4`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input name="name" value={formData.name} onChange={handleChange} error={errors.name} />
                    <Input name="state" value={formData.state} onChange={handleChange} error={errors.state} />
                    <Input name="city" value={formData.city} onChange={handleChange} error={errors.city} />
                    <Input name="street" value={formData.street} onChange={handleChange} />
                    <Input name="college" value={formData.college} onChange={handleChange} />
                    <Input name="gender" value={formData.gender} onChange={handleChange} />
                    <div className="col-span-1">
                        <label className="block text-sm font-medium mb-1">Date of Birth</label>
                        <DatePickerDemo value={formData.dob} onChange={handleChange} />
                        {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
                    </div>

                    <Input
                        name="mobile_number"
                        type="number"
                        value={formData.mobile_number}
                        onChange={handleChange}
                        error={errors.mobile_number}
                    />

                    {/* Experience field in the 3-column grid */}
                    <Input
                        name="experience"
                        type="number"
                        value={formData.experience}
                        onChange={handleChange}
                        error={errors.experience}
                    />
                </div>

                {/* Render react-select only on client */}
                {isClient && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Courts (Multiple)</label>
                            <Select
                                isMulti
                                name="courts"
                                value={courtOptions.filter(option => formData.courts.includes(option.value))}
                                onChange={(selected) => handleMultiSelectChange(selected, 'courts')}
                                options={courtOptions}
                                placeholder="Select Courts"
                            />
                            {errors.courts && <p className="text-red-500 text-sm">{errors.courts}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Case Types (Multiple)</label>
                            <Select
                                isMulti
                                name="case_types"
                                value={caseTypeOptions.filter(option => formData.case_types.includes(option.value))}
                                onChange={(selected) => handleMultiSelectChange(selected, 'case_types')}
                                options={caseTypeOptions}
                                placeholder="Select Case Types"
                            />
                            {errors.case_types && <p className="text-red-500 text-sm">{errors.case_types}</p>}
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <Button
                    type="submit"
                    className={`bg-black text-white px-4 py-2 rounded hover:bg-gray-800 mx-auto block ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Save Profile'}
                </Button>
            </form>
        </div>
    );
}

function Input({ name, type = 'text', value, onChange, error }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1 capitalize">{name.replace('_', ' ')}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full border rounded px-3 py-2"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
}
