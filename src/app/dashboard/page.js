'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const [isLawyer, setIsLawyer] = useState(null);
    const [revealCount, setRevealCount] = useState(null);


    useEffect(() => {
        const fetchUserAndCheckLawyer = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            const currentUser = session?.user;
            setUser(currentUser);

            if (currentUser?.email) {
                const { data: lawyerEntry, error } = await supabase
                    .from('lawyer')
                    .select('reveal')
                    .eq('email', currentUser.email)
                    .single();

                if (error || !lawyerEntry) {
                    setIsLawyer(false);
                } else {
                    setIsLawyer(true);
                    setRevealCount(lawyerEntry.reveal || 0);
                }
            }
        };

        fetchUserAndCheckLawyer();
    }, []);

    const revealStatusColor =
        revealCount !== null && revealCount < 5 ? 'text-red-600' : 'text-green-600';

    return (
        <div>

            {isLawyer === false && (
                <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                    You have not yet completed your lawyer profile.{' '}
                    <Link href="/dashboard/profile" className="underline font-semibold text-red-800">
                        Click here to update your profile
                    </Link>{' '}
                    and get listed as a lawyer.
                </div>
            )}

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-200 max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-700">Main Content</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    This is your dashboard area. Customize it with charts, widgets, or any other data as needed.
                </p>

                {isLawyer && revealCount !== null && (
                    <div className="mt-6">
                        <h4 className="text-md font-semibold text-gray-800 mb-2">Reveal Credits</h4>
                        <p className={`text-sm font-medium ${revealStatusColor}`}>
                            You have {revealCount} reveal{revealCount === 1 ? '' : 's'} left.
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            A reveal is used each time a client reveals your contact details. When this happens, your
                            reveal count decreases by 1.
                        </p>
                        <Link
                            href="/dashboard/reveal"
                            className="inline-block mt-3 text-sm text-blue-600 underline font-semibold"
                        >
                            Top up reveal credits
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
