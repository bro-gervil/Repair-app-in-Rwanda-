import React from 'react';
import { PickupInventoryChecklist } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  FileCheck2, 
  Camera, 
  Check, 
  X, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Smartphone,
  CheckCircle2,
  XCircle,
  FileSignature
} from 'lucide-react';

interface InventoryChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  checklist?: PickupInventoryChecklist;
  deviceTitle: string;
  orderNumber: string;
}

export const InventoryChecklistModal: React.FC<InventoryChecklistModalProps> = ({
  isOpen,
  onClose,
  checklist,
  deviceTitle,
  orderNumber,
}) => {
  const { t } = useLanguage();
  if (!isOpen || !checklist) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-[28px] bg-slate-950/80 border border-white/15 backdrop-blur-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Certificate Header */}
        <div className="p-6 border-b border-white/10 flex items-start justify-between relative z-10">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/15 text-white">
              <FileCheck2 className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-display">
                  {t('inventory_modal_title')}
                </h3>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {t('inventory_digital_seal')}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {t('inventory_sub')} • {t('order_label')} <span className="font-mono-code text-white">{orderNumber}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 max-h-[72vh] overflow-y-auto relative z-10">
          
          {/* Device & Location Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 text-xs backdrop-blur-md">
            <div className="space-y-1">
              <span className="text-slate-400">{t('device_handled')}</span>
              <p className="font-bold text-white text-sm flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                {deviceTitle}
              </p>
              <p className="text-slate-400 font-mono-code">
                {t('serial_imei')} <span className="text-slate-200">{checklist.serialOrImei || 'C02G99A0MD6R'}</span>
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400">{t('timestamp_gps')}</span>
              <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                {checklist.timestamp}
              </p>
              <p className="text-slate-400 flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                {checklist.gpsPickupLocation}
              </p>
            </div>
          </div>

          {/* 3 Photos taken during physical handover */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-400" />
                {t('photos_3_angles')}
              </h4>
              <span className="text-[11px] text-emerald-300 font-medium bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {t('photos_certified')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <div className="aspect-video sm:aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 relative group">
                  <img
                    src={checklist.frontPhoto}
                    alt="Face avant"
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded-lg border border-white/10">
                    {t('photo_front')}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="aspect-video sm:aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 relative group">
                  <img
                    src={checklist.backPhoto}
                    alt="Face arrière"
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded-lg border border-white/10">
                    {t('photo_back')}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="aspect-video sm:aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 relative group">
                  <img
                    src={checklist.portsPhoto}
                    alt="Tranches et connecteurs"
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded-lg border border-white/10">
                    {t('photo_ports')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Checklist table */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">
              {t('tech_condition_title')}
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex flex-col justify-between backdrop-blur-md">
                <span className="text-[11px] text-slate-400">{t('screen_cracked')}</span>
                <div className="mt-1.5 flex items-center gap-1.5 font-bold text-xs">
                  {checklist.screenCracked ? (
                    <span className="text-rose-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {t('yes_label', 'Oui')}
                    </span>
                  ) : (
                    <span className="text-emerald-300 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> {t('no_label', 'Non')}
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex flex-col justify-between backdrop-blur-md">
                <span className="text-[11px] text-slate-400">{t('powers_on')}</span>
                <div className="mt-1.5 flex items-center gap-1.5 font-bold text-xs">
                  {checklist.powersOn ? (
                    <span className="text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {t('yes_label', 'Oui')}
                    </span>
                  ) : (
                    <span className="text-amber-300 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> {t('no_label', 'Non')}
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex flex-col justify-between backdrop-blur-md">
                <span className="text-[11px] text-slate-400">{t('touch_works')}</span>
                <div className="mt-1.5 flex items-center gap-1.5 font-bold text-xs">
                  {checklist.touchWorking ? (
                    <span className="text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {t('yes_label', 'Oui')}
                    </span>
                  ) : (
                    <span className="text-rose-300 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> {t('no_label', 'Non')}
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex flex-col justify-between backdrop-blur-md">
                <span className="text-[11px] text-slate-400">{t('biometrics_works')}</span>
                <div className="mt-1.5 flex items-center gap-1.5 font-bold text-xs">
                  {checklist.biometricsWorking ? (
                    <span className="text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {t('ok_label', 'OK')}
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> {t('no_label', 'HS')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {checklist.cosmeticNotes && (
              <div className="mt-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 text-xs backdrop-blur-md">
                <span className="text-slate-400 block mb-1 font-semibold">{t('cosmetic_notes')}</span>
                <p className="text-slate-300 italic">{checklist.cosmeticNotes}</p>
              </div>
            )}
          </div>

          {/* Digital Signatures Box */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/15 space-y-3 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
              <FileSignature className="w-4 h-4 text-indigo-400" /> {t('digital_signatures_title')}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                <span className="text-slate-400">{t('client_signer')}</span>
                <p className="font-bold text-white text-sm">{checklist.clientSignatureName}</p>
                <div className="text-[10px] text-emerald-300 font-mono-code">
                  ✓ {t('otp_pickup_success')}
                </div>
              </div>

              <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                <span className="text-slate-400">{t('tech_signer')}</span>
                <p className="font-bold text-white text-sm">{checklist.technicianSignatureName}</p>
                <div className="text-[10px] text-emerald-300 font-mono-code">
                  ✓ {t('certified_badge')}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              {t('cloud_archived_notice')}
            </span>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-2xl text-xs transition shadow-xl shadow-white/10 active:scale-95"
            >
              {t('close_continue_btn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
