'use client';

import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="min-h-screen px-6 py-12 text-gray-800 dark:text-white">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-left">Contact Us</h1>

                <div className="space-y-6 text-lg">
                    <div className="flex items-start gap-4">
                        <Mail className="w-6 h-6 mt-1 text-gray-500" />
                        <div>
                            <p>Email us at:</p>
                            <a
                                href="mailto:contact@lawyerlinked.com"
                                className="text-blue-600 underline"
                            >
                                contact@lawyerlinked.com
                            </a>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <Phone className="w-6 h-6 mt-1 text-gray-500" />
                        <div>
                            <p>Call us:</p>
                            <p className="font-semibold">+91 8157848524</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <MapPin className="w-6 h-6 mt-1 text-gray-500" />
                        <div>
                            <p>Visit our office:</p>
                            <address className="not-italic">
                                LawyerLinked HQ<br />
                                Dummy Office Address,<br />
                                Kakkanad, Ernakulam,<br />
                                Kerala, India
                            </address>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}