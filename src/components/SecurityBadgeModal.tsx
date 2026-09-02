import React, { useState, useEffect } from 'react';
import { TechnicianPro } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  ShieldCheck, 
  CheckCircle, 
  Phone, 
  MapPin, 
  Clock, 
  X, 
  AlertTriangle,
  Award,
  Sparkles,
  Bike
} from 'lucide-react';

interface SecurityBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  technician: TechnicianPro;
  clientName: string;
}

export const SecurityBadgeModal: React.FC<SecurityBadgeModalProps> = ({
  isOpen,
  onClose,
  technician,
  clientName,
}) => {
  const { t } = useLanguage();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    const pulseTimer = setInterval(() => setPulseCount((prev) => (prev + 1) % 360), 50);
    return () => {
      clearInterval(timer);
      clearInterval(pulseTimer);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-[28px] bg-slate-950/80 border border-white/15 backdrop-blur-2xl shadow-2xl overflow-hidden">
        
        {/* Dynamic Animated Security Watermark Header */}
        <div 
          className="relative px-6 pt-6 pb-5 text-white overflow-hidden border-b border-white/10"
          style={{
            background: `linear-gradient(135deg, ${technician.accentColor}44, rgba(255,255,255,0.05))`
          }}
        >
          {/* Animated dynamic security watermark lines */}
          <div className="absolute inset-0 watermark-pattern opacity-20 pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                {t('badge_official_active')}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-4 relative z-10">
            <div className="relative">
              <img
                src={technician.photo}
                alt={technician.name}
                className="w-18 h-18 rounded-2xl object-cover border-2 border-white/30 shadow-xl"
              />
              <div className="absolute -bottom-1.5 -right-1.5 bg-indigo-600 text-white p-1 rounded-full shadow-md border border-white/20">
                <ShieldCheck className="w-4 h-4 font-black" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-bold text-white font-display leading-tight">{technician.name}</h3>
              </div>
              <p className="text-xs text-slate-300 font-medium">{technician.workshopName}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-white/10 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white border border-white/10">
                  ★ {technician.rating} / 5 ({technician.reviewsCount} {t('reviews_label')})
                </span>
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                  {technician.subscriptionPlan}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Dynamic Verification Stamp (Prevents Fake Couriers & Impersonators) */}
        <div className="bg-white/5 px-6 py-3.5 border-b border-white/10 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-xs text-slate-400">{t('live_clock_label')}</span>
            <span className="text-xs font-mono-code font-bold text-white">{currentTime}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 px-2.5 py-0.5 rounded-full text-[11px] font-mono-code text-white font-bold">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>{technician.activeWatermarkCode}</span>
          </div>
        </div>

        {/* Identification Details for Pickup */}
        <div className="p-6 space-y-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-3 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Bike className="w-4 h-4 text-indigo-400" /> {t('plate_number')} :
              </span>
              <span className="font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10 font-mono-code">
                {technician.vehiclePlate}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-indigo-400" /> {t('direct_phone')} :
              </span>
              <a 
                href={`tel:${technician.phone}`} 
                className="font-bold text-indigo-300 hover:underline font-mono-code"
              >
                {technician.phone}
              </a>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-400" /> {t('neighborhood_workshop')}
              </span>
              <span className="font-medium text-slate-200">
                {technician.neighborhood}
              </span>
            </div>
          </div>

          {/* Specialties / Expertise */}
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {t('specialties_certified')}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {technician.specialties.map((spec, i) => (
                <span 
                  key={i} 
                  className="text-[11px] bg-white/5 text-slate-300 border border-white/10 px-3 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm"
                >
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Security Instruction Box */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 backdrop-blur-md">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200/90 leading-relaxed">
              <strong className="text-amber-300 font-semibold block mb-0.5">
                {t('security_advice_title')}
              </strong>
              {t('security_advice_desc')}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-white hover:bg-slate-100 text-slate-950 font-bold py-3.5 rounded-2xl transition shadow-xl shadow-white/10 active:scale-95"
          >
            {t('close_continue_btn')}
          </button>
        </div>
      </div>
    </div>
  );
};
