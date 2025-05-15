'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabaseClient';

export default function FirmProfilePage() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        city: '',
        state: '',
        street: '',
        image: '',
        case_types: [],
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState('');

    const caseTypeOptions = ['Criminal', 'Civil', 'Family', 'Corporate'];

    useEffect(() => {
        const fetchFirmProfile = async () => {
            const { data: userData, error: userError } = await supabase.auth.getUser();

            if (userError || !userData?.user) {
                setMessage('Error fetching user. Please log in again.');
                return;
            }

            const userEmail = userData.user.email;
            setEmail(userEmail);

            const { data, error } = await supabase
                .from('firm')
                .select('*')
                .eq('email', userEmail)
                .single();

            if (error && error.code !== 'PGRST116') {
                setMessage(`Error fetching firm profile: ${error.message}`);
                return;
            }

            if (data) {
                setFormData({
                    name: data.name || '',
                    description: data.description || '',
                    city: data.city || '',
                    state: data.state || '',
                    street: data.street || '',
                    image: data.image || '',
                    case_types: data.case_types || [],
                });
            }
        };

        fetchFirmProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleMultiSelectChange = (e) => {
        const selected = Array.from(e.target.selectedOptions, (option) => option.value);
        setFormData((prev) => ({ ...prev, case_types: selected }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name) errors.name = 'Name is required';
        if (!formData.city) errors.city = 'City is required';
        if (!formData.state) errors.state = 'State is required';
        if (!formData.street) errors.street = 'Street is required';
        if (!formData.case_types.length) errors.case_types = 'Select at least one case type';
        return errors;
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

        const newFirmData = {
            ...formData,
            email,
        };

        try {
            const { error } = await supabase
                .from('firm')
                .upsert([newFirmData], { onConflict: ['email'] });

            if (error) {
                setMessage(`Error: ${error.message}`);
            } else {
                setMessage('Firm profile updated successfully!');
            }
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="text-foreground p-4 font-[family-name:var(--font-geist-sans)]">
            <h3 className="text-4xl font-bold mb-4">Firm Profile</h3>

            {message && (
                <p className={`text-sm mb-4 ${message.includes('Error') ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                    {message}
                </p>
            )}

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-3xl bg-white dark:bg-black shadow-xl rounded-2xl p-8 flex flex-col gap-6 border border-gray-300 dark:border-gray-700"
            >
                <Input label="Firm Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} />
                <Input label="State" name="state" value={formData.state} onChange={handleChange} error={errors.state} />
                <Input label="City" name="city" value={formData.city} onChange={handleChange} error={errors.city} />
                <Input label="Street" name="street" value={formData.street} onChange={handleChange} error={errors.street} />
                <Input label="Image URL" name="image" value={formData.image} onChange={handleChange} />

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Case Types</label>
                    <select
                        multiple
                        value={formData.case_types}
                        onChange={handleMultiSelectChange}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-foreground"
                    >
                        {caseTypeOptions.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    {errors.case_types && <p className="text-red-500 text-sm">{errors.case_types}</p>}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Firm Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Describe your firm’s expertise, values, and team..."
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-foreground"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] rounded-full px-6 py-3 text-sm font-medium transition disabled:opacity-60"
                >
                    {isSubmitting ? 'Submitting...' : 'Save Firm Profile'}
                </button>
            </form>
        </div>
    );
}

function Input({ label, name, value, onChange, error }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{label}</label>
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={`Enter ${label.toLowerCase()}`}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-foreground"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
}
