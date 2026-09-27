import React, { useState } from 'react';
import { BottleSize, BottleStyle, BusinessType } from '../../types';
import { store } from '../../services/store';
import { showToast } from '../../utils/toast';
import { X, Users, ArrowRight } from 'lucide-react';

interface QuickNewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickNewLeadModal: React.FC<QuickNewLeadModalProps> = ({ isOpen, onClose }) => {
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [businessType, setBusinessType] = useState<BusinessType>('Luxury Hotel');
  const [bottleSize, setBottleSize] = useState<BottleSize>('500ml');
  const [bottleStyle, setBottleStyle] = useState<BottleStyle>('Heritage Square Ribbed');
  const [quantity, setQuantity] = useState(2500);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !contactName || !phone) {
      showToast('Please enter required details (business, contact name, and phone).', 'error');
      return;
    }

    store.createLead({
      businessName,
      contactName,
      phone,
      email: email || `${phone}@lead.com`,
      city,
      businessType,
      bottleSize,
      bottleStyle,
      quantity,
      deliveryLocation: city,
      source: 'Direct Sales',
      notes,
    });

    showToast(`Lead for "${businessName}" created and added to the pipeline!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-[#E5DDD0] overflow-hidden">
        <div className="px-6 py-4 bg-[#FAF7F2] border-b border-[#E5DDD0] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#D92365]" />
            <h3 className="font-serif font-bold text-lg text-[#1A1817]">
              Create New Hospitality Lead
            </h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Hotel / Venue Name *</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Oberoi Udaivilas"
                className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Contact Person *</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Rajesh Sharma"
                className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Phone / WhatsApp *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 88272 75367"
                className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="fb@hotel.com"
                className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Destination City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Business Category</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
              >
                <option value="Luxury Hotel">Luxury Hotel / Resort</option>
                <option value="Boutique Cafe">Boutique Café / Roaster</option>
                <option value="Destination Wedding">Destination Wedding</option>
                <option value="Corporate Office">Corporate Office / Boardroom</option>
                <option value="Fine Dining Restaurant">Fine Dining Restaurant</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Bottle Spec</label>
              <select
                value={bottleSize}
                onChange={(e) => setBottleSize(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
              >
                <option value="250ml">250ml (Boardroom & Café)</option>
                <option value="500ml">500ml (Dining & Weddings)</option>
                <option value="750ml">750ml (Nordic Executive)</option>
                <option value="1000ml">1000ml (Grand Reserve)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Target Quantity</label>
              <input
                type="number"
                min="300"
                step="100"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 500)}
                className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Requirement Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Design preferences, delivery timeline..."
              className="w-full px-3 py-2 rounded-lg border border-[#D8CEBE]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-[#E5DDD0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#D8CEBE]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#D92365] hover:bg-[#C2185B] text-white font-semibold flex items-center gap-1.5"
            >
              <span>Create Lead</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
