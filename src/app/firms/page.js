'use client';


import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ReactSelect from 'react-select';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";


// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function FirmsPage() {
    const [firms, setFirms] = useState([]);
    const [filteredFirms, setFilteredFirms] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [filters, setFilters] = useState({
        city: '',
        state: ''
    });

    // Fetch firms once on mount
    useEffect(() => {
        async function fetchFirms() {
            const { data, error } = await supabase
                .from('firm')
                .select('id, name, image, city, state')
                .gt('reveal', 0);

            if (error) {
                console.error('Error fetching firms:', error);
                setFirms([]);
                setFilteredFirms([]);
            } else {
                setFirms(data || []);
                setFilteredFirms(data || []);
            }

            setLoading(false);
        }

        fetchFirms();
    }, []);

    // Filter firms when filters or firms change
    useEffect(() => {
        const filtered = firms.filter(firm => {
            const matchCity = !filters.city || (firm.city?.toLowerCase().includes(filters.city));
            const matchState = !filters.state || (firm.state?.toLowerCase().includes(filters.state));
            return matchCity && matchState;
        });
        setFilteredFirms(filtered);
    }, [filters, firms]);

    // Helper to generate select options from firm data
    const getOptions = (items) =>
        Array.from(new Set(items.filter(Boolean).map(i => i.toLowerCase())))
            .map(i => ({ value: i, label: i.charAt(0).toUpperCase() + i.slice(1) }));

    return (
        <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white flex flex-col">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 px-6 py-4 bg-gray-100 dark:bg-gray-800 rounded">
                <div className="w-full sm:w-auto sm:min-w-[180px]">
                    <ReactSelect
                        options={[{ value: '', label: 'All Cities' }, ...getOptions(firms.map(f => f.city))]}
                        value={{
                            value: filters.city,
                            label: filters.city ? filters.city.charAt(0).toUpperCase() + filters.city.slice(1) : 'All Cities'
                        }}
                        onChange={(selected) => setFilters(prev => ({ ...prev, city: selected?.value || '' }))}
                        placeholder="City"
                        isClearable
                    />
                </div>

                <div className="w-full sm:w-auto sm:min-w-[180px]">
                    <ReactSelect
                        options={[{ value: '', label: 'All States' }, ...getOptions(firms.map(f => f.state))]}
                        value={{
                            value: filters.state,
                            label: filters.state ? filters.state.charAt(0).toUpperCase() + filters.state.slice(1) : 'All States'
                        }}
                        onChange={(selected) => setFilters(prev => ({ ...prev, state: selected?.value || '' }))}
                        placeholder="State"
                        isClearable
                    />
                </div>
            </div>

            {/* Results */}
            <main className="flex-1 px-6 py-6">
                <h2 className="text-2xl font-semibold mb-6 text-center">Find a Firm Near You</h2>

                {loading ? (
                    <p className="text-center">Loading firms...</p>
                ) : filteredFirms.length === 0 ? (
                    <p className="text-center">No firms match the filters.</p>
                ) : (
                    <div className="flex flex-wrap gap-6 justify-start pb-4">
                        {filteredFirms.map((firm) => (
                            <div
                                key={firm.id}
                                className="min-w-[300px] max-w-[300px] bg-[#f9f9f9] dark:bg-[#2d2d2d] dark:text-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => router.push(`/firms/${firm.id}`)}
                            >
                                <div className="flex flex-col items-center">
                                    <Avatar className="w-24 h-24 mb-4 rounded-md ">
                                        <AvatarImage
                                            src={firm.image || '/corporation.png'}
                                            alt={firm.name}
                                            className="object-cover"
                                        />
                                        <AvatarFallback>
                                            {firm.name?.charAt(0).toUpperCase() || "F"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <h3 className="text-lg font-semibold text-center mb-1 truncate w-full">{firm.name}</h3>
                                    <p className="text-sm text-gray-600 text-center mb-2 truncate w-full">
                                        {firm.city}, {firm.state}
                                    </p>
                                </div>
                            </div>

                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
