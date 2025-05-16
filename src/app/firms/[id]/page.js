'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { MapPin, Building2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function FirmDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [firm, setFirm] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFirm = async () => {
            const { data, error } = await supabase
                .from('firm')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching firm:', error);
                router.push('/');
            } else {
                setFirm(data);
            }

            setLoading(false);
        };

        if (id) fetchFirm();
    }, [id]);

    if (loading) {
        return <p className="text-center py-10">Loading firm details...</p>;
    }

    if (!firm) {
        return <p className="text-center py-10">Firm not found.</p>;
    }

    return (
        <div className="px-4 py-10 min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white flex flex-col">
            <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24">
                    <AvatarImage
                        src={firm.image || '/corporation.png'}
                        alt={firm.name}
                    />
                    <AvatarFallback>
                        {firm.name?.charAt(0) || 'F'}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl font-semibold">{firm.name}</h1>
                    <p className="text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {firm.city}, {firm.state}
                    </p>
                    {firm.size && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            Firm Size: {firm.size}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-6 space-y-3 text-sm">
                {firm.description && (
                    <p><strong>Description:</strong> {firm.description}</p>
                )}
                {firm.street && (
                    <p><strong>Street:</strong> {firm.street}</p>
                )}
                {firm.case_types?.length > 0 && (
                    <p><strong>Specialties:</strong> {firm.case_types.join(', ')}</p>
                )}
            </div>
        </div>
    );
}
