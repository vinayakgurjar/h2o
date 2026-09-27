import React, { useState, useEffect } from 'react';
import { UserRole, CompanySettings } from '../../types';
import { store } from '../../services/store';
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  DollarSign,
  Package,
  Palette,
  Factory,
  CreditCard,
  Truck,
  Boxes,
  CheckSquare,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  History,
  Settings,
  Search,
  Bell,
  Globe,
  Plus,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onNavigateToPublic: () => void;
  onOpenQuickNewLead: () => void;
  onOpenQuickNewQuote: () => void;
  onOpenCommandPalette: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onNavigateToPublic,
  onOpenQuickNewLead,
  onOpenQuickNewQuote,
  onOpenCommandPalette,
  children,
}) => {
  const [currentUser, setCurrentUser] = useState(store.getState().currentUser);
  const [companySettings, setCompanySettings] = useState(store.getState().companySettings);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    return store.subscribe(() => {
      setCurrentUser(store.getState().currentUser);
      setCompanySettings(store.getState().companySettings);
    });
  }, []);

  const ROLES: UserRole[] = [
    'SUPER_ADMIN',
    'ADMIN',
    'SALES_MANAGER',
    'SALES_EXECUTIVE',
    'DESIGNER',
    'PRODUCTION_MANAGER',
    'ACCOUNTS',
    'DELIVERY_MANAGER',
    'VIEWER',
  ];

  const NAV_ITEMS = [
    { id: 'admin-dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'crm-leads', label: 'CRM Leads & Pipeline', icon: Users, badge: store.getState().leads.length },
    { id: 'customers', label: 'Client Directory (360)', icon: Building2 },
    { id: 'quotes', label: 'Quotation Engine', icon: FileText, badge: store.getState().quotes.length },
    { id: 'pricing-master', label: 'Pricing & Cost Rules', icon: DollarSign },
    { id: 'orders', label: 'Orders & Fulfillment', icon: Package, badge: store.getState().orders.length },
    { id: 'design-management', label: 'Design & Proofs', icon: Palette },
    { id: 'production', label: 'Cleanroom Production', icon: Factory },
    { id: 'payments', label: 'Payments & Receivables', icon: CreditCard },
    { id: 'logistics', label: 'Dispatch & Logistics', icon: Truck },
    { id: 'inventory', label: 'Raw Materials & Caps', icon: Boxes },
    { id: 'tasks', label: 'Tasks & Follow-ups', icon: CheckSquare, badge: store.getState().tasks.filter(t => t.status === 'TODO').length },
    { id: 'compliance-admin', label: 'FSSAI & BIS Standards', icon: ShieldCheck },
    { id: 'whatsapp-automation', label: 'WhatsApp Automation', icon: MessageSquare },
    { id: 'ai-copilot', label: 'AI Sales Copilot', icon: Sparkles, highlight: true },
    { id: 'audit-logs', label: 'Audit Trail', icon: History },
    { id: 'settings-admin', label: 'Company & Database', icon: Settings },
  ];

  const handleRoleSwitch = (newRole: UserRole) => {
    store.setCurrentUserRole(newRole);
    setRoleDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E5DDD0] px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-xs">
        {/* Left: Mobile Menu Toggle & App Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 rounded-lg text-stone-600 hover:bg-[#F4EFE6]"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-extrabold text-base text-[#1A1817]">
                  MLUE
                </span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 rounded font-mono font-semibold">
                  ADMIN OS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Command Palette / Search Trigger */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <button
            onClick={onOpenCommandPalette}
            className="w-full px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#E5DDD0] text-xs text-[#7A6E5E] flex items-center justify-between transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-stone-400" />
              <span>Search MLUE leads, orders, quotes, customers...</span>
            </div>
            <kbd className="font-mono text-[10px] bg-white border border-[#D8CEBE] px-1.5 py-0.5 rounded text-stone-500">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions: Quick New, Role Switcher, Public link */}
        <div className="flex items-center gap-2.5">
          {/* Quick Create Dropdown / Buttons */}
          <button
            onClick={onOpenQuickNewLead}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#1A1817] border border-[#D8CEBE] text-xs font-semibold shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-600" />
            <span>+ Lead</span>
          </button>

          <button
            onClick={onOpenQuickNewQuote}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#1A1817] border border-[#D8CEBE] text-xs font-semibold shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-600" />
            <span>+ Quote</span>
          </button>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-[#D8CEBE] text-xs font-medium text-[#1A1817] hover:bg-[#FAF7F2] shadow-2xs"
              title="Test permissions by switching staff role"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-mono text-[11px] font-bold text-indigo-600">
                {currentUser.role}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-1 w-56 rounded-xl bg-white border border-[#E5DDD0] shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-[#F4EFE6] text-[10px] text-stone-400 uppercase font-semibold">
                  Switch Active Role (RBAC Demo)
                </div>
                {ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleSwitch(r)}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between transition-colors ${
                      currentUser.role === r
                        ? 'bg-indigo-50 text-indigo-600 font-bold'
                        : 'hover:bg-[#FAF7F2] text-stone-700'
                    }`}
                  >
                    <span>{r}</span>
                    {currentUser.role === r && <span className="text-[10px] font-bold">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Live Website Link */}
          <button
            onClick={onNavigateToPublic}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">View MLUE Storefront</span>
          </button>
        </div>
      </header>

      {/* Main OS Body: Sidebar + Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-[#E5DDD0] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0 top-12' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Nav List */}
          <div className="p-3 space-y-0.5 overflow-y-auto flex-1">
            <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-stone-400">
              Operations & Pipeline
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold border-l-3 border-indigo-600'
                      : item.highlight
                      ? 'text-indigo-600 hover:bg-indigo-50'
                      : 'text-[#4A443F] hover:bg-[#FAF7F2] hover:text-[#1A1817]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : item.highlight ? 'text-indigo-600' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-semibold ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-[#F4EFE6] text-stone-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* User Profile Footer */}
          <div className="p-3 border-t border-[#E5DDD0] bg-[#FAF7F2]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                VP
              </div>
              <div className="overflow-hidden flex-1 text-left">
                <div className="text-xs font-bold text-[#1A1817] truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-stone-500 font-mono truncate">
                  {currentUser.email}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FAF7F2]">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
};
