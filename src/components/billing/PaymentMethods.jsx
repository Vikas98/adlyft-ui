import React from 'react';
import { CreditCard, Plus } from 'lucide-react';
import Button from '../common/Button';

const mockCards = [
  { id: 1, type: 'Visa', last4: '4242', expiry: '12/26', isDefault: true },
  { id: 2, type: 'Mastercard', last4: '5555', expiry: '09/25', isDefault: false },
];

export default function PaymentMethods() {
  return (
    <div className="space-y-3">
      {mockCards.map((card) => (
        <div key={card.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{card.type} •••• {card.last4}</p>
              <p className="text-xs text-gray-400">Expires {card.expiry}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {card.isDefault && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Default</span>}
            <button className="text-xs text-gray-400 hover:text-red-500 transition-colors">Remove</button>
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-full" size="sm">
        <Plus className="h-4 w-4" />
        Add Payment Method
      </Button>
    </div>
  );
}
