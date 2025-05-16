'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ReactSelect from 'react-select';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function LawyersPage() {
    const [lawyers, setLawyers] = useState([]);
    const [filteredLawyers, setFilteredLawyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [filters, setFilters] = useState({
        city: '',
        gender: '',
        state: '',
        court: '',
        specialty: '',
        experience: ''
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const fetchLawyers = async () => {
            const { data, error } = await supabase
                .from('lawyer')
                .select(`id, name, image, city, state, street, courts, college, dob, case_types, experience, description, gender`)
                .gt('reveal', 0);

            if (error) {
                console.error('Error fetching lawyers:', error);
            } else {
                setLawyers(data || []);
                setFilteredLawyers(data || []);
            }

            setLoading(false);
        };

        fetchLawyers();
    }, []);

    useEffect(() => {
        const applyFilters = () => {
            const filtered = lawyers.filter(lawyer => {
                const matchCity = filters.city === '' || lawyer.city?.toLowerCase().includes(filters.city);
                const matchState = filters.state === '' || lawyer.state?.toLowerCase().includes(filters.state);
                const matchGender = filters.gender === '' || lawyer.gender?.toLowerCase() === filters.gender;
                const matchCourt = filters.court === '' || (lawyer.courts || []).some(c => c.toLowerCase().includes(filters.court));
                const matchSpecialty = filters.specialty === '' || (lawyer.case_types || []).some(c => c.toLowerCase().includes(filters.specialty));
                const matchExperience = filters.experience === '' || lawyer.experience >= parseInt(filters.experience);

                return matchCity && matchState && matchGender && matchCourt && matchSpecialty && matchExperience;
            });

            setFilteredLawyers(filtered);
        };

        applyFilters();
    }, [filters, lawyers]);

    const getOptions = (items) => {
        return Array.from(new Set(items.map(i => i?.toLowerCase()).filter(Boolean)))
            .map(i => ({ value: i, label: i.charAt(0).toUpperCase() + i.slice(1) }));
    };

    return (
        <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white flex flex-col">
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-4 px-6 py-4 bg-gray-100 dark:bg-gray-800 rounded">
                <div className="w-full sm:w-auto sm:min-w-[180px]">
                    <ReactSelect
                        options={[{ value: '', label: 'All Cities' }, ...getOptions(lawyers.map(l => l.city))]}
                        value={{ value: filters.city, label: filters.city ? filters.city.charAt(0).toUpperCase() + filters.city.slice(1) : 'All Cities' }}
                        onChange={(selected) => setFilters(prev => ({ ...prev, city: selected?.value || '' }))}
                        placeholder="City"
                        isClearable
                    />
                </div>

                <div className="w-full sm:w-auto sm:min-w-[180px]">
                    <ReactSelect
                        options={[{ value: '', label: 'All States' }, ...getOptions(lawyers.map(l => l.state))]}
                        value={{ value: filters.state, label: filters.state ? filters.state.charAt(0).toUpperCase() + filters.state.slice(1) : 'All States' }}
                        onChange={(selected) => setFilters(prev => ({ ...prev, state: selected?.value || '' }))}
                        placeholder="State"
                        isClearable
                    />
                </div>

                <div className="w-full sm:w-auto sm:min-w-[130px]">
                    <ReactSelect
                        options={[{ value: '', label: 'All Genders' }, ...getOptions(lawyers.map(l => l.gender))]}
                        value={{ value: filters.gender, label: filters.gender ? filters.gender.charAt(0).toUpperCase() + filters.gender.slice(1) : 'All Genders' }}
                        onChange={(selected) => setFilters(prev => ({ ...prev, gender: selected?.value || '' }))}
                        placeholder="Gender"
                        isClearable
                    />
                </div>

                <div className="w-full sm:w-auto sm:min-w-[150px]">
                    <ReactSelect
                        options={[{ value: '', label: 'All Specialties' }, ...getOptions(lawyers.flatMap(l => l.case_types || []))]}
                        value={{ value: filters.specialty, label: filters.specialty ? filters.specialty.charAt(0).toUpperCase() + filters.specialty.slice(1) : 'All Specialties' }}
                        onChange={(selected) => setFilters(prev => ({ ...prev, specialty: selected?.value || '' }))}
                        placeholder="Specialty"
                        isClearable
                    />
                </div>

                <div className="w-full sm:w-auto sm:min-w-[150px]">
                    <ReactSelect
                        options={[{ value: '', label: 'All Courts' }, ...getOptions(lawyers.flatMap(l => l.courts || []))]}
                        value={{ value: filters.court, label: filters.court ? filters.court.charAt(0).toUpperCase() + filters.court.slice(1) : 'All Courts' }}
                        onChange={(selected) => setFilters(prev => ({ ...prev, court: selected?.value || '' }))}
                        placeholder="Court"
                        isClearable
                    />
                </div>

                <div className="w-full sm:w-auto sm:min-w-[120px]">
                    <input
                        type="number"
                        name="experience"
                        value={filters.experience}
                        onChange={handleFilterChange}
                        placeholder="Min Exp"
                        className="w-full sm:w-[120px] px-3 py-2 rounded border text-sm dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>
            </div>

            {/* Results */}
            <main className="flex-1 px-6 py-6">
                <h2 className="text-2xl font-semibold mb-6 text-center">Find a Lawyer Near You</h2>

                {loading ? (
                    <p className="text-center">Loading lawyers...</p>
                ) : filteredLawyers.length === 0 ? (
                    <p className="text-center">No lawyers match the filters.</p>
                ) : (
                    <div className="flex flex-wrap gap-6 pb-4 justify-start">
                        {filteredLawyers.map((lawyer) => (
                            <div
                                key={lawyer.id}
                                className="min-w-[300px] max-w-[300px] bg-[#f9f9f9] dark:bg-[#2d2d2d] dark:text-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => router.push(`/lawyers/${lawyer.id}`)}
                            >
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 mb-4">
                                        <Image
                                            src={lawyer.image || '/default-avatar.png'}
                                            alt={lawyer.name}
                                            width={96}
                                            height={96}
                                            className="object-cover"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold text-center mb-1 truncate w-full">{lawyer.name}</h3>
                                    <p className="text-sm text-gray-600 text-center mb-2 truncate w-full">
                                        {lawyer.city}, {lawyer.state}
                                    </p>

                                    <div className="text-xs text-gray-700 mb-2 text-center truncate w-full">
                                        <strong>Experience:</strong> {lawyer.experience || 0} years
                                    </div>

                                    <div className="text-xs text-gray-700 mb-2 text-center truncate w-full">
                                        <strong>Education:</strong> {lawyer.college}
                                    </div>

                                    <div className="text-xs text-gray-700 text-center w-full">
                                        <strong>Specialties:</strong>
                                        <ul className="list-disc list-inside max-h-[60px] overflow-hidden">
                                            {(lawyer.case_types || []).slice(0, 3).map((type, i) => (
                                                <li key={i} className="truncate">{type}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
