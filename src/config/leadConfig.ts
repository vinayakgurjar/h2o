/**
 * H2O Energy Fuel - Lead Generation & Squad Drop Configuration
 * Central single-point configuration for squad supply drops, WhatsApp messaging,
 * compliance credentials, and direct fulfillment.
 */

export const LEAD_CONFIG = {
  // Configured submission endpoint (Formspree, Webhook, Google Apps Script, or EmailJS)
  apiEndpoint: 'https://formspree.io/f/xbjnkyvl', 

  // Direct contact details
  companyName: 'H2O Energy',
  brandName: 'H2O Next-Gen Bio-Adaptive Energy Fuel',
  city: 'Indore',
  state: 'Madhya Pradesh',
  phone: '8827275367',
  formattedPhone: '+91 8827275367',
  email: 'vinayakgurjar05@gmail.com',
  facilityAddress: 'H2O Cleanroom Lab, Sector C, Sanwer Road Industrial Area, Indore, MP 452015',
  operatingHours: '24/7 Creator & Squad Support • Mon - Sat Factory Dispatch',

  // Trust Strip & Compliance
  fssaiNumber: '11424850000312',
  bisStandard: 'IS 14543 & ISO 22000',
  moqBottles: 300,
  moqLiters: 500,
  deliveryTurnaround: '48 Hours Express Dispatch',
  activeClientsCount: '150+ Esports Clans, Clubs, Gyms & Festivals',

  // WhatsApp Pre-filled Messages
  whatsappNumber: '918827275367',
  defaultWhatsAppMessage: 'Yo H2O crew! I want to order bulk squad supply or inquire about a custom-branded energy drink drop. Please share wholesale slab pricing.',
  
  getWhatsAppUrl(customMessage?: string) {
    const text = encodeURIComponent(customMessage || this.defaultWhatsAppMessage);
    return `https://wa.me/${this.whatsappNumber}?text=${text}`;
  },

  getLeadFollowupWhatsAppUrl(leadName: string, businessName: string, volume: string) {
    const text = encodeURIComponent(
      `Hey H2O, I just submitted a squad drop enquiry for ${businessName} (${volume}) under ${leadName}. Let's get our cans locked in!`
    );
    return `https://wa.me/${this.whatsappNumber}?text=${text}`;
  }
};
