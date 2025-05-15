'use client';

import { useState } from 'react';
import { CreditCard, CheckCircle, BadgeDollarSign } from 'lucide-react';

const options = [
    { id: 1, reveals: 10, price: 1000 },
    { id: 2, reveals: 25, price: 2000 },
    { id: 3, reveals: 40, price: 3000 },
    { id: 4, reveals: 55, price: 4000 },
];

export default function RevealTopUpPage() {
    const [selected, setSelected] = useState(null);

    const handleProceed = () => {
        if (selected) {
            alert(`Proceeding to payment for ₹${selected.price}...`);
            // Payment integration goes here
        } else {
            alert('Please select a reveal package.');
        }
    };

    return (
        <div className="w-full p-4">
            <h1 className="text-lg font-semibold text-gray-800 mb-1 flex items-center gap-1">
                <BadgeDollarSign className="text-green-600 w-4 h-4" /> Buy Reveal Credits
            </h1>
            <p className="text-xs text-gray-600 mb-4">
                Reveals are used when a client unlocks your contact details.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {options.map((option) => (
                    <div
                        key={option.id}
                        onClick={() => setSelected(option)}
                        className={`border rounded-lg p-3 cursor-pointer transition hover:shadow-sm text-sm ${selected?.id === option.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-800">{option.reveals} Reveals</span>
                            {selected?.id === option.id && <CheckCircle className="text-green-600 w-4 h-4" />}
                        </div>
                        <span className="text-gray-600 text-xs">₹{option.price}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={handleProceed}
                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition"
            >
                <CreditCard size={16} /> Proceed to Payment
            </button>
        </div>
    );
}
