'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function LawyerProfilePage() {
    const { id } = useParams();
    const [lawyer, setLawyer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [contactInfo, setContactInfo] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchLawyer = async () => {
            const { data, error } = await supabase
                .from('lawyer')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching lawyer:', error);
                router.push('/');
            } else {
                setLawyer(data);
            }

            setLoading(false);
        };

        if (id) fetchLawyer();
    }, [id]);

    const handleRevealContact = async () => {
        if (!lawyer || !lawyer.id || lawyer.reveal <= 0) {
            alert('Cannot reveal contact information.');
            return;
        }

        const { data, error } = await supabase
            .from('lawyer')
            .update({ reveal: lawyer.reveal - 1 })
            .eq('id', lawyer.id)
            .select();

        if (error) {
            console.error('Failed to reveal contact:', error);
            alert('Something went wrong while revealing contact.');
            return;
        }

        setContactInfo({
            email: lawyer.email,
            mobile_number: lawyer.mobile_number,
        });

        setShowModal(true);
        setLawyer((prev) => ({ ...prev, reveal: prev.reveal - 1 }));
    };

    if (loading) {
        return <p className="text-center py-10">Loading lawyer details...</p>;
    }

    if (!lawyer) {
        return <p className="text-center py-10">Lawyer not found.</p>;
    }

    return (
        <div className="px-4 py-10 min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white flex flex-col">
            <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24">
                    <AvatarImage
                        src={lawyer.image || '/default-avatar.png'}
                        alt={lawyer.name}
                    />
                    <AvatarFallback>{lawyer.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl font-semibold">{lawyer.name}</h1>
                    <p className="text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {lawyer.city}, {lawyer.state}
                    </p>
                    <p className="text-sm text-gray-600">
                        {lawyer.experience} years experience
                    </p>
                </div>
            </div>

            <div className="mt-6 space-y-3 text-sm">
                <p><strong>Description:</strong> {lawyer.description}</p>
                <p><strong>Street:</strong> {lawyer.street}</p>
                <p><strong>Gender:</strong> {lawyer.gender}</p>
                <p><strong>Date of Birth:</strong> {lawyer.dob}</p>
                <p><strong>Education:</strong> {lawyer.college}</p>
                <p><strong>Courts:</strong> {(lawyer.courts || []).join(', ')}</p>
                <p><strong>Specialties:</strong> {(lawyer.case_types || []).join(', ')}</p>
            </div>

            <div className="mt-8">
                <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={handleRevealContact}
                            disabled={lawyer.reveal <= 0}
                        >
                            Reveal Contact Info
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle className="text-center">
                                Contact Information
                            </DialogTitle>
                        </DialogHeader>
                        {contactInfo && (
                            <div className="space-y-2 text-center">
                                <p className="flex items-center justify-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {contactInfo.email}
                                </p>
                                <p className="flex items-center justify-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    {contactInfo.mobile_number}
                                </p>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
