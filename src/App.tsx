import React, { useState, useEffect } from 'react';
import { store } from './services/store';
import { Lead, BottleCustomization } from './types';
import { Sparkles } from 'lucide-react';

// Core UI Sections
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { MarqueeSection } from './components/public/MarqueeSection';
import { ProductsSection } from './components/public/ProductsSection';
import { BottleCustomizerSection } from './components/public/BottleCustomizerSection';
import { BeforeAfterSection } from './components/public/BeforeAfterSection';
import { BrandingImpactSection } from './components/public/BrandingImpactSection';
import { HospitalityShowcaseSection } from './components/public/HospitalityShowcaseSection';
import { SolutionsSection } from './components/public/SolutionsSection';
import { PortfolioSection } from './components/public/PortfolioSection';
import { ComplianceSection } from './components/public/ComplianceSection';
import { LeadEnquiryForm } from './components/public/LeadEnquiryForm';
import { PricingTransparencySection } from './components/public/PricingTransparencySection';
import { SocialProofSection } from './components/public/SocialProofSection';
import { PublicOrderTracker } from './components/public/PublicOrderTracker';
import { FaqSection } from './components/public/FaqSection';
import { Footer } from './components/public/Footer';
import { MobileStickyBar } from './components/public/MobileStickyBar';

// Modals
import { BottleCustomizerModal } from './components/public/BottleCustomizerModal';
import { QuoteModal } from './components/public/QuoteModal';
import { VideoCommercialModal } from './components/public/VideoCommercialModal';

// Admin Operating System (Preserved via Discreet Footer Link)
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CrmKanban } from './components/admin/CrmKanban';
import { CustomersManagement } from './components/admin/CustomersManagement';
import { QuotesManagement } from './components/admin/QuotesManagement';
import { PricingMasterView } from './components/admin/PricingMasterView';
import { OrdersManagement } from './components/admin/OrdersManagement';
import { DesignManagement } from './components/admin/DesignManagement';
import { ProductionManagement } from './components/admin/ProductionManagement';
import { PaymentsManagement } from './components/admin/PaymentsManagement';
import { DeliveriesManagement } from './components/admin/DeliveriesManagement';
import { InventoryManagement } from './components/admin/InventoryManagement';
import { TasksManagement } from './components/admin/TasksManagement';
import { ComplianceAdmin } from './components/admin/ComplianceAdmin';
import { WhatsAppAutomation } from './components/admin/WhatsAppAutomation';
import { AiSalesCopilot } from './components/admin/AiSalesCopilot';
import { AuditLogView } from './components/admin/AuditLogView';
import { SettingsAdmin } from './components/admin/SettingsAdmin';
import { GlobalCommandPalette } from './components/admin/GlobalCommandPalette';
import { ToastContainer } from './components/common/ToastContainer';
import { QuickNewLeadModal } from './components/admin/QuickNewLeadModal';
import { QuickNewQuoteModal } from './components/admin/QuickNewQuoteModal';
import { AuthModal } from './components/auth/AuthModal';
import { testFirebaseConnection } from './services/firebase';

export default function App() {
  // View State: Public Storefront vs Admin Operating System
  const [activeView, setActiveView] = useState<'public' | 'admin'>('public');
  const [currentAdminTab, setCurrentAdminTab] = useState<string>('admin-dashboard');

  // Customization State for Live 3D Bottle
  const [bottleCustomization, setBottleCustomization] = useState<BottleCustomization>({
    bottleSize: '500ml',
    bottleStyle: 'Square',
    capColor: '#BD00FF',
    labelColor: '#BD00FF',
    labelStyle: 'Custom Full-Wrap',
    brandName: 'YOUR BRAND',
    tagline: 'ON EVERY TABLE.',
    finish: 'Gloss',
  });

  const [customizerModalOpen, setCustomizerModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Admin Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [quickNewLeadOpen, setQuickNewLeadOpen] = useState(false);
  const [quickNewQuoteOpen, setQuickNewQuoteOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [leadForQuote, setLeadForQuote] = useState<Lead | null>(null);

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const tabParam = params.get('tab');
    if (viewParam === 'admin' || (tabParam && tabParam.startsWith('admin-'))) {
      setActiveView('admin');
      if (tabParam) setCurrentAdminTab(tabParam);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenQuoteForLead = (lead: Lead) => {
    setLeadForQuote(lead);
    setQuickNewQuoteOpen(true);
  };

  const handleScrollToForm = () => {
    const el = document.getElementById('hero-lead-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      const input = document.getElementById('hero-lead-form-name');
      if (input) input.focus();
    }
  };

  const handleScrollToCustomizer = () => {
    const el = document.getElementById('customizer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E2E8F0] font-sans antialiased selection:bg-[#BD00FF] selection:text-white">
      {activeView === 'public' ? (
        <div className="flex flex-col min-h-screen relative">
          
          {/* Header */}
          <Navbar
            onScrollToForm={handleScrollToForm}
            onScrollToCustomizer={handleScrollToCustomizer}
          />

          {/* ========================================================================= */}
          {/* 1. CINEMATIC FULL-SCREEN HERO (MAKE THE BOTTLE THE STAR)                  */}
          {/* ========================================================================= */}
          <Hero
            customization={bottleCustomization}
            onChangeCustomization={setBottleCustomization}
            onScrollToCustomizer={handleScrollToCustomizer}
            onScrollToForm={handleScrollToForm}
          />

          {/* ========================================================================= */}
          {/* 2. ATTENTION-GRABBING CONTINUOUS MARQUEE                                  */}
          {/* ========================================================================= */}
          <MarqueeSection />

          {/* ========================================================================= */}
          {/* 3. PICK YOUR BOTTLE (MASSIVE 500ML & 1L COLLECTIBLE CARDS)               */}
          {/* ========================================================================= */}
          <ProductsSection
            onSelectProduct={(size, style) => {
              setBottleCustomization((prev) => ({
                ...prev,
                bottleSize: size,
                bottleStyle: style,
              }));
              handleScrollToCustomizer();
            }}
            onCustomizeSize={(size) => {
              setBottleCustomization((prev) => ({
                ...prev,
                bottleSize: size,
              }));
              handleScrollToCustomizer();
            }}
          />

          {/* ========================================================================= */}
          {/* 4. BOTTLE CUSTOMIZER — GAME-LIKE CHARACTER/LOADOUT EXPERIENCE             */}
          {/* ========================================================================= */}
          <BottleCustomizerSection
            customization={bottleCustomization}
            onChangeCustomization={setBottleCustomization}
            onRequestQuote={() => setQuoteModalOpen(true)}
          />

          {/* ========================================================================= */}
          {/* 5. BEFORE / AFTER INTERACTIVE DRAGGABLE SLIDER                            */}
          {/* ========================================================================= */}
          <BeforeAfterSection onMakeItYours={handleScrollToCustomizer} />

          {/* ========================================================================= */}
          {/* 6. BRANDING IMPACT & OVERSIZED TOUCHPOINTS                                */}
          {/* ========================================================================= */}
          <BrandingImpactSection />

          {/* ========================================================================= */}
          {/* 7. HOSPITALITY SHOWCASE (BUILT FOR THE EXPERIENCE)                        */}
          {/* ========================================================================= */}
          <HospitalityShowcaseSection
            onSelectSpace={(space) => {
              setBottleCustomization((prev) => ({
                ...prev,
                tagline: `${space.toUpperCase()} EXPERIENCE`,
              }));
              handleScrollToCustomizer();
            }}
          />

          {/* ========================================================================= */}
          {/* 8. GEN-Z SUBCULTURE SQUADS & LIFESTYLE (ESPORTS, FESTIVALS, STREETWEAR)   */}
          {/* ========================================================================= */}
          <SolutionsSection />

          {/* ========================================================================= */}
          {/* 9. LIMITED DROPS & CREATOR COLLABS (LOAD PRESET DIRECTLY INTO 3D LAB)     */}
          {/* ========================================================================= */}
          <PortfolioSection
            onLoadPresetTo3D={(preset) => {
              setBottleCustomization(preset);
              handleScrollToCustomizer();
            }}
          />

          {/* ========================================================================= */}
          {/* 10. COMPLIANCE & PURITY ADVANTAGE (BIO-MATRIX VS TRADITIONAL BEVERAGES)   */}
          {/* ========================================================================= */}
          <ComplianceSection />

          {/* ========================================================================= */}
          {/* 11. WHOLESALE & SQUAD SUPPLY DESK (FAST ENQUIRY & SLAB PRICING)          */}
          {/* ========================================================================= */}
          <div id="lead-generation-hub" className="relative bg-gradient-to-b from-[#050505] via-[#0B0E23] to-[#050505] border-t border-white/10 pt-16 pb-12">
            
            {/* Visual Transition Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#BD00FF]/15 border border-[#BD00FF]/40 text-xs font-space font-bold text-[#BD00FF] uppercase tracking-wider mb-3 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#BD00FF]" />
                <span>Indore Factory Direct Bottling & Wholesale Supply Desk</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-syne uppercase">
                Lock In Your Wholesale Slabs in 60 Seconds
              </h2>
              <p className="text-sm text-slate-300 max-w-2xl mx-auto mt-2 leading-relaxed">
                Direct factory bottling in Indore. Low 300-bottle MOQ, complimentary 3D label artwork proofing, and 48-hour express doorstep dispatch.
              </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-black font-syne uppercase text-white tracking-tight">
                    Every Table Deserves Your Identity.
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    Submit your estimated monthly consumption. Our studio will prepare your custom 3D vector proof, calculate volume tier savings, and coordinate sample tasting.
                  </p>
                  <div className="p-4 rounded-2xl glass-cyber border border-white/10 text-xs font-space text-slate-300 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Standard Turnaround:</span>
                      <span className="font-bold text-white">48–72 Hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Quality Standard:</span>
                      <span className="font-bold text-[#00F0FF]">FSSAI Lic. 11424850000312</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Delivery Scope:</span>
                      <span className="font-bold text-white">Indore & Greater MP</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <LeadEnquiryForm
                    id="hero-lead-form"
                    variant="full"
                    title="Request Indore Bulk Pricing"
                    subtitle="Get instant volume slab breakdown and free 3D bottle preview for your venue."
                  />
                </div>
              </div>
            </div>

            {/* Pricing Transparency & Slabs */}
            <PricingTransparencySection onSelectSlab={handleScrollToForm} />

            {/* Social Proof & Testimonials */}
            <SocialProofSection />

            {/* Can/Bottle Drop Tracker */}
            <PublicOrderTracker onNavigateToCustomizer={handleScrollToCustomizer} />

            {/* FAQ Accordion */}
            <FaqSection />
          </div>

          {/* Footer */}
          <Footer onOpenAdmin={() => setActiveView('admin')} />

          {/* Floating Mobile Sticky Action Bar */}
          <MobileStickyBar onScrollToForm={handleScrollToForm} />

        </div>
      ) : (
        /* ENTERPRISE ADMIN & CRM OS (Accessible via discreet footer link) */
        <AdminLayout
          currentTab={currentAdminTab}
          onSelectTab={(tab) => setCurrentAdminTab(tab)}
          onNavigateToPublic={() => setActiveView('public')}
          onOpenQuickNewLead={() => setQuickNewLeadOpen(true)}
          onOpenQuickNewQuote={() => {
            setLeadForQuote(null);
            setQuickNewQuoteOpen(true);
          }}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        >
          {currentAdminTab === 'admin-dashboard' && (
            <AdminDashboard
              onNavigateTab={(tab: string) => setCurrentAdminTab(tab)}
              onOpenQuickNewLead={() => setQuickNewLeadOpen(true)}
              onOpenQuickNewQuote={() => {
                setLeadForQuote(null);
                setQuickNewQuoteOpen(true);
              }}
            />
          )}

          {currentAdminTab === 'admin-crm' && (
            <CrmKanban
              onOpenNewLead={() => setQuickNewLeadOpen(true)}
              onOpenQuoteForLead={handleOpenQuoteForLead}
            />
          )}

          {currentAdminTab === 'admin-customers' && <CustomersManagement />}

          {currentAdminTab === 'admin-quotes' && (
            <QuotesManagement
              onOpenCreateQuote={() => {
                setLeadForQuote(null);
                setQuickNewQuoteOpen(true);
              }}
            />
          )}

          {currentAdminTab === 'admin-pricing' && <PricingMasterView />}
          {currentAdminTab === 'admin-orders' && <OrdersManagement />}
          {currentAdminTab === 'admin-designs' && <DesignManagement />}
          {currentAdminTab === 'admin-production' && <ProductionManagement />}
          {currentAdminTab === 'admin-payments' && <PaymentsManagement />}
          {currentAdminTab === 'admin-deliveries' && <DeliveriesManagement />}
          {currentAdminTab === 'admin-inventory' && <InventoryManagement />}
          {currentAdminTab === 'admin-tasks' && <TasksManagement />}
          {currentAdminTab === 'admin-compliance' && <ComplianceAdmin />}
          {currentAdminTab === 'admin-whatsapp' && <WhatsAppAutomation />}
          {currentAdminTab === 'admin-copilot' && <AiSalesCopilot />}
          {currentAdminTab === 'admin-audit' && <AuditLogView />}
          {currentAdminTab === 'admin-settings' && <SettingsAdmin />}
        </AdminLayout>
      )}

      {/* Public Interactive Modals */}
      <BottleCustomizerModal
        isOpen={customizerModalOpen}
        onClose={() => setCustomizerModalOpen(false)}
        onNavigateToAdmin={(tab) => {
          setCustomizerModalOpen(false);
          setActiveView('admin');
          if (tab) setCurrentAdminTab(tab);
        }}
      />

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        onNavigateToAdmin={(tab) => {
          setQuoteModalOpen(false);
          setActiveView('admin');
          if (tab) setCurrentAdminTab(tab);
        }}
      />

      <VideoCommercialModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        onOpenQuoteModal={() => {
          setVideoModalOpen(false);
          setQuoteModalOpen(true);
        }}
      />

      {/* Admin Modals */}
      <QuickNewLeadModal
        isOpen={quickNewLeadOpen}
        onClose={() => setQuickNewLeadOpen(false)}
      />

      <QuickNewQuoteModal
        isOpen={quickNewQuoteOpen}
        onClose={() => {
          setQuickNewQuoteOpen(false);
          setLeadForQuote(null);
        }}
        preselectedLead={leadForQuote}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <GlobalCommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigateTab={(tab: string) => {
          if (tab === 'public') setActiveView('public');
          else {
            setActiveView('admin');
            setCurrentAdminTab(tab);
          }
        }}
      />

      {/* Global Toast System */}
      <ToastContainer />
    </div>
  );
}
