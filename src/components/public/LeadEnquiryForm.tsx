import React, { useState } from 'react';
import { LEAD_CONFIG } from '../../config/leadConfig';
import { trackEvent } from '../../utils/analytics';
import { store } from '../../services/store';
import { addLeadToFirestore } from '../../services/firebase';
import { showToast } from '../../utils/toast';
import { BusinessType } from '../../types';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  MessageSquare,
  ShieldCheck,
  Zap,
  Phone,
  Building,
  User,
  Package,
  MapPin,
} from 'lucide-react';

export interface LeadFormProps {
  id?: string;
  variant?: 'full' | 'compact';
  title?: string;
  subtitle?: string;
  onSuccess?: () => void;
  className?: string;
}

interface FormState {
  name: string;
  businessName: string;
  phone: string;
  businessType: string;
  monthlyVolume: string;
  city: string;
  message: string;
}

interface FormErrors {
  name?: string;
  businessName?: string;
  phone?: string;
  businessType?: string;
  monthlyVolume?: string;
  city?: string;
}

const BUSINESS_TYPES = [
  'Esports Clan / Gaming Lounge',
  'Nightclub / Lounge / Bar',
  'Music Festival / Event Organizer',
  'Boutique Café / Artisan Roaster',
  'Streetwear / Fashion Pop-up',
  'Gym Chain / Combat Sports Box',
  'University Fest / Tech Conclave',
  'Distributor / Wholesale Partner',
];

const VOLUME_RANGES = [
  '300 – 1,000 cans/month',
  '1,000 – 2,500 cans/month',
  '2,500 – 5,000 cans/month',
  '5,000 – 10,000 cans/month',
  '10,000+ cans/month (Festival / Enterprise)',
];

export const LeadEnquiryForm: React.FC<LeadFormProps> = ({
  id = 'lead-enquiry-form',
  variant = 'full',
  title = 'Request Wholesale Squad Pricing',
  subtitle = 'Get instant volume slab breakdown, custom can mockups, and wholesale carton rates.',
  onSuccess,
  className = '',
}) => {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    businessName: '',
    phone: '',
    businessType: 'Esports Clan / Gaming Lounge',
    monthlyVolume: '1,000 – 2,500 cans/month',
    city: 'Indore',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const validateField = (fieldName: keyof FormState, value: string): string | undefined => {
    switch (fieldName) {
      case 'name':
        if (!value.trim()) return 'Please enter your name or handle';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return undefined;

      case 'businessName':
        if (!value.trim()) return 'Please enter your business, squad, or clan name';
        return undefined;

      case 'phone': {
        const cleanPhone = value.replace(/\D/g, '');
        if (!cleanPhone) return 'Phone number is required';
        if (cleanPhone.length !== 10) return 'Enter a valid 10-digit mobile number';
        if (!/^[6-9]\d{9}$/.test(cleanPhone)) return 'Must start with 6, 7, 8, or 9';
        return undefined;
      }

      case 'businessType':
        if (!value) return 'Please select your organization type';
        return undefined;

      case 'monthlyVolume':
        if (!value) return 'Please choose approximate monthly can volume';
        return undefined;

      case 'city':
        if (!value.trim()) return 'City is required';
        return undefined;

      default:
        return undefined;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (!hasStarted) {
      setHasStarted(true);
      trackEvent('form_start', { formId: id, firstField: name });
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const err = validateField(name as keyof FormState, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name as keyof FormState, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate all required fields
    const newErrors: FormErrors = {};
    newErrors.name = validateField('name', formData.name);
    newErrors.businessName = validateField('businessName', formData.businessName);
    newErrors.phone = validateField('phone', formData.phone);
    if (variant === 'full') {
      newErrors.businessType = validateField('businessType', formData.businessType);
      newErrors.monthlyVolume = validateField('monthlyVolume', formData.monthlyVolume);
      newErrors.city = validateField('city', formData.city);
    }

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) {
      setErrors(newErrors);
      setTouched({
        name: true,
        businessName: true,
        phone: true,
        businessType: true,
        monthlyVolume: true,
        city: true,
      });
      return;
    }

    setIsSubmitting(true);
    trackEvent('form_submit_attempt', {
      formId: id,
      businessType: formData.businessType,
      monthlyVolume: formData.monthlyVolume,
      city: formData.city,
    });

    try {
      // 1. Save into internal store CRM state
      const cleanPhone = formData.phone.replace(/\D/g, '');
      const approxQty = formData.monthlyVolume.includes('300') ? 300 : 2000;

      const mapToBusinessType = (type: string): BusinessType => {
        if (type.includes('Café') || type.includes('Roaster')) return 'Café';
        if (type.includes('Bar') || type.includes('Nightclub') || type.includes('Restaurant')) return 'Restaurant';
        if (type.includes('Festival') || type.includes('Event')) return 'Event / Festival';
        if (type.includes('Gym') || type.includes('Fitness') || type.includes('Combat')) return 'Gym / Fitness';
        if (type.includes('Hotel')) return 'Luxury Hotel';
        if (type.includes('Corporate') || type.includes('Conclave')) return 'Corporate Office';
        return 'Other';
      };

      const resolvedBusinessType = mapToBusinessType(formData.businessType);

      store.createLead({
        contactName: formData.name.trim(),
        businessName: formData.businessName.trim(),
        phone: cleanPhone,
        email: `${cleanPhone}@lead.h2oenergy.com`,
        city: formData.city.trim() || 'Indore',
        businessType: resolvedBusinessType,
        bottleSize: '500ml',
        bottleStyle: 'Square',
        quantity: approxQty,
        notes: `[H2O Drop Form: ${variant.toUpperCase()}] Category: ${formData.businessType}. Volume requirement: ${formData.monthlyVolume}. Message: ${formData.message || 'None'}`,
      });

      // 2. Persist directly to Firebase Firestore
      try {
        await addLeadToFirestore({
          contactName: formData.name.trim(),
          businessName: formData.businessName.trim(),
          phone: cleanPhone,
          email: `${cleanPhone}@lead.h2oenergy.com`,
          city: formData.city.trim() || 'Indore',
          businessType: resolvedBusinessType,
          bottleSize: '500ml',
          bottleStyle: 'Square',
          quantity: approxQty,
          notes: `[H2O Drop Form: ${variant.toUpperCase()}] Category: ${formData.businessType}. Volume: ${formData.monthlyVolume}`,
        });
      } catch (fireErr) {
        console.warn('[Firestore Lead Persistence Fallback]', fireErr);
      }

      showToast('Enquiry received! Custom 3D bottle preview will be sent via WhatsApp.', 'success');

      // 2. Post to configured remote endpoint
      if (LEAD_CONFIG.apiEndpoint) {
        try {
          await fetch(LEAD_CONFIG.apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              form: id,
              brand: 'H2O Energy',
              name: formData.name,
              businessName: formData.businessName,
              phone: cleanPhone,
              businessType: formData.businessType,
              monthlyVolume: formData.monthlyVolume,
              city: formData.city,
              message: formData.message,
              submittedAt: new Date().toISOString(),
            }),
          });
        } catch (netErr) {
          console.warn('[H2O Lead Dispatch Warning]', netErr);
        }
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      trackEvent('form_submit_success', {
        formId: id,
        name: formData.name,
        businessName: formData.businessName,
        phone: cleanPhone,
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setIsSubmitting(false);
      const errorMsg =
        err?.message || 'Unable to submit enquiry right now. Please try via WhatsApp directly.';
      setSubmitError(errorMsg);
      trackEvent('form_submit_error', { formId: id, error: errorMsg });
    }
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setSubmitError(null);
    setFormData({
      name: '',
      businessName: '',
      phone: '',
      businessType: 'Esports Clan / Gaming Lounge',
      monthlyVolume: '1,000 – 2,500 cans/month',
      city: 'Indore',
      message: '',
    });
    setErrors({});
    setTouched({});
  };

  // SUCCESS SCREEN
  if (isSuccess) {
    return (
      <div
        id={id}
        className={`glass-cyber rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-2xl space-y-6 text-center text-white ${className}`}
      >
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl font-black font-syne uppercase text-white tracking-tight">
            Squad Drop Request Received!
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Thank you, <strong className="text-white">{formData.name}</strong>. Our H2O team will call you within <strong className="text-white">24 hours</strong> with wholesale slab pricing and your complimentary 3D can design proof.
          </p>
        </div>

        {/* WhatsApp Immediate Connection */}
        <div className="p-4 rounded-2xl bg-[#070A10] border border-white/10 space-y-3">
          <p className="text-xs text-slate-300">
            Need urgent turnaround for an upcoming tournament, fest, or weekend drop? Connect instantly on WhatsApp:
          </p>

          <a
            href={LEAD_CONFIG.getLeadFollowupWhatsAppUrl(
              formData.name,
              formData.businessName,
              formData.monthlyVolume
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', { source: 'form_success_screen' })}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#05070B] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all min-h-[44px] font-space"
          >
            <MessageSquare className="w-4 h-4 fill-[#05070B]" />
            <span>Connect on WhatsApp Now</span>
          </a>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleResetForm}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer font-space"
          >
            ← Submit another squad enquiry
          </button>
        </div>
      </div>
    );
  }

  // STANDARD FORM VIEW
  return (
    <div
      id={id}
      className={`glass-cyber rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-5 text-white relative ${className}`}
    >
      {/* Form Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#00F0FF] fill-[#00F0FF]" />
          <h3 className="text-xl sm:text-2xl font-black font-syne uppercase text-white tracking-tight">
            {title}
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          {subtitle}
        </p>
      </div>

      {/* Global Error Banner */}
      {submitError && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block font-bold">Submission Failed</strong>
            <p>{submitError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        
        {/* Row 1: Name & Business Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Field: Name */}
          <div>
            <label
              htmlFor={`${id}-name`}
              className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 font-space"
            >
              Your Name / Gamer Tag <span className="text-[#00F0FF]">*</span>
            </label>
            <div className="relative">
              <input
                id={`${id}-name`}
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Alex Drake or KAI_FPS"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#070A10] text-xs font-semibold text-white placeholder-slate-500 border transition-all focus:outline-none min-h-[44px] ${
                  touched.name && errors.name
                    ? 'border-rose-500 ring-1 ring-rose-500'
                    : 'border-white/10 focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]'
                }`}
              />
            </div>
            {touched.name && errors.name && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Field: Business Name */}
          <div>
            <label
              htmlFor={`${id}-businessName`}
              className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 font-space"
            >
              Organization / Clan / Brand <span className="text-[#00F0FF]">*</span>
            </label>
            <div className="relative">
              <input
                id={`${id}-businessName`}
                name="businessName"
                type="text"
                autoComplete="organization"
                value={formData.businessName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Apex Esports, Void Club"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#070A10] text-xs font-semibold text-white placeholder-slate-500 border transition-all focus:outline-none min-h-[44px] ${
                  touched.businessName && errors.businessName
                    ? 'border-rose-500 ring-1 ring-rose-500'
                    : 'border-white/10 focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]'
                }`}
              />
            </div>
            {touched.businessName && errors.businessName && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.businessName}</span>
              </p>
            )}
          </div>

        </div>

        {/* Row 2: Phone & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Field: Phone (10 digit validation) */}
          <div>
            <label
              htmlFor={`${id}-phone`}
              className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 font-space"
            >
              Mobile / WhatsApp Number <span className="text-[#00F0FF]">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-bold text-slate-400 select-none font-space">
                +91
              </span>
              <input
                id={`${id}-phone`}
                name="phone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="98260XXXXX"
                className={`w-full pl-12 pr-3.5 py-2.5 rounded-xl bg-[#070A10] text-xs font-semibold text-white placeholder-slate-500 border transition-all focus:outline-none min-h-[44px] ${
                  touched.phone && errors.phone
                    ? 'border-rose-500 ring-1 ring-rose-500'
                    : 'border-white/10 focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]'
                }`}
              />
            </div>
            {touched.phone && errors.phone && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.phone}</span>
              </p>
            )}
          </div>

          {/* Field: City */}
          <div>
            <label
              htmlFor={`${id}-city`}
              className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 font-space"
            >
              Delivery City <span className="text-[#00F0FF]">*</span>
            </label>
            <div className="relative">
              <input
                id={`${id}-city`}
                name="city"
                type="text"
                autoComplete="address-level2"
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Indore, Bhopal, Mumbai"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#070A10] text-xs font-semibold text-white placeholder-slate-500 border transition-all focus:outline-none min-h-[44px] ${
                  touched.city && errors.city
                    ? 'border-rose-500 ring-1 ring-rose-500'
                    : 'border-white/10 focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]'
                }`}
              />
            </div>
            {touched.city && errors.city && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.city}</span>
              </p>
            )}
          </div>

        </div>

        {/* Row 3 (Full Variant): Business Type & Monthly Volume */}
        {variant === 'full' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Field: Business Type */}
            <div>
              <label
                htmlFor={`${id}-businessType`}
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 font-space"
              >
                Sector / Squad Type <span className="text-[#00F0FF]">*</span>
              </label>
              <select
                id={`${id}-businessType`}
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070A10] text-xs font-semibold text-white border border-white/10 focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] focus:outline-none transition-all min-h-[44px]"
              >
                {BUSINESS_TYPES.map((bt) => (
                  <option key={bt} value={bt} className="bg-[#0C1019] text-white">
                    {bt}
                  </option>
                ))}
              </select>
            </div>

            {/* Field: Monthly Volume */}
            <div>
              <label
                htmlFor={`${id}-monthlyVolume`}
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 font-space"
              >
                Batch / Monthly Can Volume <span className="text-[#00F0FF]">*</span>
              </label>
              <select
                id={`${id}-monthlyVolume`}
                name="monthlyVolume"
                value={formData.monthlyVolume}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070A10] text-xs font-semibold text-white border border-white/10 focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] focus:outline-none transition-all min-h-[44px]"
              >
                {VOLUME_RANGES.map((vr) => (
                  <option key={vr} value={vr} className="bg-[#0C1019] text-white">
                    {vr}
                  </option>
                ))}
              </select>
            </div>

          </div>
        )}

        {/* Field: Optional Message */}
        <div>
          <label
            htmlFor={`${id}-message`}
            className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-space"
          >
            Special Requirements / Target Date (Optional)
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={2}
            value={formData.message}
            onChange={handleChange}
            placeholder="e.g. Need custom logo foil cans for an upcoming LAN tournament or club launch on the 15th."
            className="w-full px-3.5 py-2 rounded-xl bg-[#070A10] text-xs font-medium text-white placeholder-slate-500 border border-white/10 focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] focus:outline-none transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-[#00F0FF] hover:bg-[#38BDF8] disabled:bg-[#00F0FF]/50 text-[#05070B] font-black text-xs uppercase tracking-wider shadow-lg glow-cyan flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[48px] active:scale-98 font-space"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#05070B]" />
                <span>Reserving Squad Batch...</span>
              </>
            ) : (
              <>
                <span>Lock In Wholesale Slabs</span>
                <Send className="w-4 h-4 text-[#05070B]" />
              </>
            )}
          </button>
        </div>

        {/* Privacy & Speed Guarantee Note */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-space">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#39FF14]" />
            <span>Zero Spam • Direct Factory Pricing</span>
          </span>
          <span>48h Turnaround</span>
        </div>

      </form>
    </div>
  );
};
