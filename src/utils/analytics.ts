/**
 * Unified Analytics & Event Tracking Helper
 * Fires distinct events for lead interactions, WhatsApp triggers, and conversion steps.
 */

export type AnalyticsEventName =
  | 'hero_cta_click'
  | 'form_start'
  | 'form_submit_attempt'
  | 'form_submit_success'
  | 'form_submit_error'
  | 'whatsapp_click'
  | 'phone_click'
  | 'pricing_slab_click'
  | 'pricing_slab_select'
  | 'flavor_select'
  | 'quote_generated'
  | 'faq_expand'
  | 'use_case_view'
  | 'before_after_slider_drag'
  | 'customizer_size_change'
  | 'customizer_style_change'
  | 'customizer_design_saved'
  | 'hero_style_toggle';

export interface AnalyticsPayload {
  [key: string]: unknown;
}

export function trackEvent(eventName: AnalyticsEventName, payload?: AnalyticsPayload) {
  const timestamp = new Date().toISOString();
  const eventData = {
    event: eventName,
    timestamp,
    ...payload,
  };

  // Safe console log for development inspection & auditing
  console.log(`[MLUE Analytics] ${eventName}:`, eventData);

  if (typeof window !== 'undefined') {
    const w = window as any;

    // Push to Google Tag Manager dataLayer if available
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push(eventData);
    }

    // Google Analytics 4 (gtag.js)
    if (typeof w.gtag === 'function') {
      w.gtag('event', eventName, payload);
    }
  }
}
