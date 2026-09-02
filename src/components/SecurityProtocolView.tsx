import React from 'react';
import { 
  Home,
  ShieldCheck, 
  KeyRound, 
  FileCheck2, 
  Smartphone, 
  CheckCircle2, 
  Lock, 
  AlertTriangle, 
  Scale, 
  Sparkles, 
  Bike, 
  QrCode, 
  Camera, 
  ExternalLink 
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface SecurityProtocolViewProps {
  onOpenBookingModal?: () => void;
  onOpenBadgePreview?: () => void;
  onReturnHome?: () => void;
}

export const SecurityProtocolView: React.FC<SecurityProtocolViewProps> = ({
  onOpenBookingModal,
  onOpenBadgePreview,
  onReturnHome,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      {onReturnHome && (
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onReturnHome}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition px-2.5 py-1 rounded-lg hover:bg-white/5"
          >
            <Home className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('tab_home')}</span>
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-teal-300 font-semibold px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20">
            {t('tab_security')}
          </span>
        </div>
      )}
      
      {/* Hero Header */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-[28px] relative overflow-hidden shadow-2xl">
        <div className="absolute right-[-60px] top-[-60px] w-72 h-72 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute left-[20%] bottom-[-50px] w-64 h-64 bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30 backdrop-blur-md flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('sec_view_badge')}
            </span>
            <span className="text-xs text-slate-400">• {t('sec_view_guarantee')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            {t('sec_view_title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            {t('sec_view_desc')}
          </p>
        </div>
      </div>

      {/* The 3 Pillars Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Pillar 1: MoMo Escrow */}
        <div className="bg-white/5 border border-emerald-500/30 hover:border-emerald-500/60 backdrop-blur-xl rounded-[28px] p-6 shadow-2xl transition flex flex-col justify-between space-y-4 relative group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-lg">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              {t('sec_pillar_1_tag')}
            </span>
            <h3 className="text-lg font-bold text-white font-display">
              {t('sec_pillar_1_title')}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t('sec_pillar_1_desc')}
            </p>
          </div>

          <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('sec_pillar_1_feat1')}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('sec_pillar_1_feat2')}</span>
            </div>
          </div>
        </div>

        {/* Pillar 2: Dynamic Anti-Impersonation Badge */}
        <div className="bg-white/5 border border-indigo-500/30 hover:border-indigo-500/60 backdrop-blur-xl rounded-[28px] p-6 shadow-2xl transition flex flex-col justify-between space-y-4 relative group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
              {t('sec_pillar_2_tag')}
            </span>
            <h3 className="text-lg font-bold text-white font-display">
              {t('sec_pillar_2_title')}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t('sec_pillar_2_desc')}
            </p>
          </div>

          <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400 space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('sec_pillar_2_feat1')}</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('sec_pillar_2_feat2')}</span>
            </div>
          </div>
        </div>

        {/* Pillar 3: 3-Photo Checklist & Physical Handover */}
        <div className="bg-white/5 border border-purple-500/30 hover:border-purple-500/60 backdrop-blur-xl rounded-[28px] p-6 shadow-2xl transition flex flex-col justify-between space-y-4 relative group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-lg">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
              {t('sec_pillar_3_tag')}
            </span>
            <h3 className="text-lg font-bold text-white font-display">
              {t('sec_pillar_3_title')}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t('sec_pillar_3_desc')}
            </p>
          </div>

          <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400 space-y-1.5">
            <div className="flex items-center gap-2 text-purple-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('sec_pillar_3_feat1')}</span>
            </div>
            <div className="flex items-center gap-2 text-purple-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('sec_pillar_3_feat2')}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Dispute Resolution & Kigali Context Banner */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-display">
              {t('arbitration_title')}
            </h3>
            <p className="text-xs text-slate-300">
              {t('arbitration_sub')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <strong className="text-white block">{t('arbitration_box1_title')}</strong>
            <p>{t('arbitration_box1_desc')}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <strong className="text-white block">{t('arbitration_box2_title')}</strong>
            <p>{t('arbitration_box2_desc')}</p>
          </div>
        </div>
      </div>

    </div>
  );
};
