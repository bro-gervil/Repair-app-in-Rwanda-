import React from 'react';
import { 
  AppTab, 
  RepairOrder, 
  TechnicianPro, 
  MarketplaceItem, 
  UserEcoProfile 
} from '../types';
import { 
  Wrench, 
  ShoppingBag, 
  Recycle, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Bike, 
  Lock, 
  KeyRound, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Award, 
  Cpu, 
  Smartphone, 
  Laptop, 
  UserCheck, 
  Zap,
  ChevronRight,
  Shield,
  Eye,
  Check
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface HomeViewProps {
  orders: RepairOrder[];
  technicians: TechnicianPro[];
  marketplaceItems: MarketplaceItem[];
  userEcoProfile: UserEcoProfile;
  onNavigateTab: (tab: AppTab) => void;
  onOpenBookingModal: () => void;
  onOpenDiagnosticModal: () => void;
  onOpenBadgeModal: (tech: TechnicianPro) => void;
  onOpenOtpModal: (order: RepairOrder) => void;
  onOpenChecklistModal: (order: RepairOrder) => void;
  onSwitchToTechPortal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  orders,
  technicians,
  marketplaceItems,
  userEcoProfile,
  onNavigateTab,
  onOpenBookingModal,
  onOpenDiagnosticModal,
  onOpenBadgeModal,
  onOpenOtpModal,
  onOpenChecklistModal,
  onSwitchToTechPortal,
}) => {
  const { t } = useLanguage();

  const activeOrder = orders.find(
    (o) => o.status !== 'completed_released' && o.status !== 'disputed'
  ) || orders[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Main Welcome Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-emerald-950/40 border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('home_welcome_badge')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight font-display mb-4">
            {t('home_hero_title')}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
            {t('home_hero_desc')}
          </p>

          {/* Primary Action Hub Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="home-order-repair-btn"
              onClick={onOpenBookingModal}
              className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Wrench className="w-4 h-4 text-slate-950" />
              <span>{t('home_quick_repairs')}</span>
              <ArrowRight className="w-4 h-4 text-slate-950 ml-0.5" />
            </button>

            <button
              id="home-ai-diagnostic-btn"
              onClick={onOpenDiagnosticModal}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>{t('home_quick_diagnostic')}</span>
            </button>

            <button
              id="home-go-marketplace-btn"
              onClick={() => onNavigateTab('marketplace')}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 font-medium text-sm border border-white/10 transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>{t('home_explore_market')}</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-2">
            <div className="text-xl sm:text-2xl font-black text-white font-mono-code">4,820+</div>
            <div className="text-xs text-slate-400 font-medium">{t('home_stat_repairs')}</div>
          </div>
          <div className="p-2">
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono-code">100%</div>
            <div className="text-xs text-slate-400 font-medium">{t('home_stat_escrow')}</div>
          </div>
          <div className="p-2">
            <div className="text-xl sm:text-2xl font-black text-sky-400 font-mono-code">38+</div>
            <div className="text-xs text-slate-400 font-medium">{t('home_stat_labs')}</div>
          </div>
          <div className="p-2">
            <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono-code">12.8 T</div>
            <div className="text-xs text-slate-400 font-medium">{t('home_stat_ewaste')}</div>
          </div>
        </div>
      </section>

      {/* 2. Active Ongoing Order Tracker Widget (if exists) */}
      {activeOrder && (
        <section className="bg-slate-900/80 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Bike className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  {t('home_active_order_title')}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>{activeOrder.deviceBrand} {activeOrder.deviceModel}</span>
                  <span className="text-xs font-normal text-slate-400">({activeOrder.orderNumber})</span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenOtpModal(activeOrder)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{t('otp_code_label')} {activeOrder.otpCode}</span>
              </button>
              <button
                onClick={() => onNavigateTab('repairs')}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 transition"
              >
                <span>{t('view_all')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('home_client_neighborhood')} <strong className="text-white">{activeOrder.clientNeighborhood}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>MoMo Escrow : <strong className="text-white">{activeOrder.escrowAmountRWF.toLocaleString()} RWF</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <UserCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{t('home_assigned_tech')} <strong className="text-white">{activeOrder.assignedTechnician?.name || 'Lab Kigali'}</strong></span>
            </div>
          </div>
        </section>
      )}

      {/* 3. Core Features Interactive Quick Access Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Express Repairs */}
        <div 
          onClick={() => onNavigateTab('repairs')}
          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.01] group relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 mb-4 group-hover:scale-110 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              {t('tab_repairs')}
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {t('home_card_repairs_desc')}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <span>{t('home_card_repairs_btn')}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Certified Marketplace */}
        <div 
          onClick={() => onNavigateTab('marketplace')}
          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.01] group relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 mb-4 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              {t('tab_marketplace')}
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {t('home_card_market_desc')}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <span>{t('home_card_market_btn')}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Recycling & Points */}
        <div 
          onClick={() => onNavigateTab('recycling')}
          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.01] group relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 mb-4 group-hover:scale-110 transition-transform">
              <Recycle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              {t('tab_recycling')}
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {t('home_card_recycle_desc')}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <span>{t('home_card_recycle_btn')}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: 3-Pillar Security */}
        <div 
          onClick={() => onNavigateTab('security')}
          className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.01] group relative overflow-hidden flex flex-col justify-between"
        >
          <div>
            <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300 mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
              {t('tab_security')}
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {t('home_card_security_desc')}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-teal-400">
            <span>{t('home_card_security_btn')}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* 4. Certified Kigali Workshops Preview */}
      <section className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              <span>{t('home_certified_workshops_title')}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {t('home_workshops_desc')}
            </p>
          </div>

          <button
            id="home-open-tech-portal-btn"
            onClick={onSwitchToTechPortal}
            className="px-4 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition flex items-center gap-2 self-start sm:self-auto"
          >
            <UserCheck className="w-4 h-4" />
            <span>{t('home_join_as_tech')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {technicians.map((tech) => (
            <div
              key={tech.id}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <img
                  src={tech.photo}
                  alt={tech.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl object-cover border border-white/20 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-white truncate">{tech.name}</h4>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Online" />
                  </div>
                  <p className="text-xs text-indigo-300 font-semibold truncate">{tech.workshopName}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{tech.neighborhood}</span>
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {tech.specialties.slice(0, 2).map((sp, idx) => (
                    <span key={idx} className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md text-slate-300">
                      {sp}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => onOpenBadgeModal(tech)}
                  className="text-[11px] text-emerald-400 font-bold hover:underline flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('badge_label')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Second-hand Certified Marketplace Sneak Peek */}
      <section className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <span>{t('home_market_preview_title')}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {t('home_market_preview_desc')}
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('marketplace')}
            className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{t('home_view_all_market')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketplaceItems.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigateTab('marketplace')}
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-black/40">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-emerald-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {item.conditionGrade}
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{item.specsSummary}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-sm font-black text-white font-mono-code">
                  {item.priceRWF.toLocaleString()} RWF
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{item.location}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Why Gira-Tech in Kigali - Guarantee Banner */}
      <section className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-indigo-950/40 border border-white/10 backdrop-blur-xl">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span>{t('home_why_giratech_title')}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <Check className="w-4 h-4" />
              <span>{t('home_why_1_title')}</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {t('home_why_1_desc')}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-sky-300 font-bold text-sm">
              <Check className="w-4 h-4" />
              <span>{t('home_why_2_title')}</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {t('home_why_2_desc')}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Check className="w-4 h-4" />
              <span>{t('home_why_3_title')}</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {t('home_why_3_desc')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
