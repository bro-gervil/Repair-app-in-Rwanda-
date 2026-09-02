import React, { useState } from 'react';
import { RepairOrder, TechnicianPro } from '../types';
import { 
  Home,
  Wrench, 
  ShieldCheck, 
  KeyRound, 
  FileCheck2, 
  UserCheck, 
  MapPin, 
  Clock, 
  Phone, 
  CheckCircle2, 
  Bike, 
  Sparkles, 
  Plus,
  AlertCircle,
  Eye,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../i18n/LanguageContext';

interface RepairTrackingViewProps {
  orders: RepairOrder[];
  onOpenBookingModal: () => void;
  onOpenOtpModal: (order: RepairOrder) => void;
  onOpenBadgeModal: (technician: TechnicianPro) => void;
  onOpenChecklistModal: (order: RepairOrder) => void;
  onReleaseEscrow: (orderId: string) => void;
  onReturnHome?: () => void;
}

export const RepairTrackingView: React.FC<RepairTrackingViewProps> = ({
  orders,
  onOpenBookingModal,
  onOpenOtpModal,
  onOpenBadgeModal,
  onOpenChecklistModal,
  onReleaseEscrow,
  onReturnHome,
}) => {
  const { t } = useLanguage();
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'courier_assigned':
        return {
          label: t('status_courier_assigned'),
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          step: 2,
        };
      case 'pickup_verified':
      case 'in_transit_lab':
        return {
          label: t('status_in_transit'),
          color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          step: 3,
        };
      case 'under_repair':
        return {
          label: t('status_under_repair'),
          color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          step: 4,
        };
      case 'ready_delivery':
      case 'quality_testing':
        return {
          label: t('status_ready_delivery'),
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          step: 5,
        };
      case 'completed_released':
        return {
          label: t('status_completed'),
          color: 'bg-emerald-600/30 text-emerald-200 border-emerald-500',
          step: 6,
        };
      default:
        return {
          label: t('step_escrow_locked'),
          color: 'bg-slate-800 text-slate-300 border-slate-700',
          step: 1,
        };
    }
  };

  const currentStatusInfo = activeOrder ? getStatusBadge(activeOrder.status) : null;

  const handleApproveAndRelease = (orderId: string) => {
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (e) {}
    onReleaseEscrow(orderId);
  };

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
          <span className="text-emerald-300 font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
            {t('tab_repairs')}
          </span>
        </div>
      )}
      
      {/* Top Hero Banner & Quick Actions */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-[28px] relative overflow-hidden shadow-2xl">
        <div className="absolute right-[-80px] top-[-80px] w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute left-[30%] bottom-[-50px] w-60 h-60 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/15 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/30">
                {t('repair_hero_badge')}
              </span>
              <span className="text-xs text-slate-400">• {t('warranty_pill')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
              {t('repair_hero_title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {t('repair_hero_desc')}
            </p>
          </div>

          <button
            id="open-booking-modal-btn"
            onClick={onOpenBookingModal}
            className="shrink-0 bg-white hover:bg-slate-100 text-slate-950 font-bold px-6 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-white/10 hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5 font-bold text-slate-950" />
            <span>{t('btn_order_repair')}</span>
          </button>
        </div>
      </div>

      {/* Orders Selector if multiple orders exist */}
      {orders.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white/[0.03] backdrop-blur-md p-2 rounded-2xl border border-white/5">
          <span className="text-xs font-semibold text-slate-400 shrink-0 px-2">{t('your_orders')}</span>
          {orders.map((ord) => {
            const isSelected = ord.id === activeOrder?.id;
            return (
              <button
                key={ord.id}
                onClick={() => setSelectedOrderId(ord.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition shrink-0 flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-white text-slate-950 font-bold border-white shadow-md shadow-white/10'
                    : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border-white/5'
                }`}
              >
                <span>{ord.deviceBrand} {ord.deviceModel}</span>
                <span className="font-mono-code text-[11px] opacity-80">({ord.orderNumber})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Active Order Details Screen */}
      {activeOrder ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Columns: Live Tracking, Status & Security Protocol Handlers */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Live Tracking Card */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[28px] p-6 sm:p-7 shadow-2xl space-y-6">
              
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-bold text-white font-display">
                      {activeOrder.deviceBrand} {activeOrder.deviceModel}
                    </h2>
                    <span className="text-xs font-mono-code text-slate-300 bg-white/5 px-2.5 py-0.5 rounded-md border border-white/10">
                      {activeOrder.orderNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {t('reported_issue')} : <span className="text-slate-200 font-medium">{activeOrder.reportedIssue}</span>
                  </p>
                </div>

                <div className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 backdrop-blur-md ${currentStatusInfo?.color}`}>
                  <span className="w-2 h-2 rounded-full bg-current animate-ping"></span>
                  <span>{currentStatusInfo?.label}</span>
                </div>
              </div>

              {/* Kigali Transit Map Simulation */}
              <div className="relative h-52 rounded-2xl overflow-hidden bg-slate-950/80 border border-white/10 flex items-center justify-center shadow-inner">
                {/* Simulated Street Map Background */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Simulated route line in Kigali */}
                <svg className="absolute inset-0 w-full h-full stroke-emerald-400/50 stroke-2 stroke-dasharray-4">
                  <path d="M 60 130 Q 200 50 380 100 T 580 90" fill="none" />
                </svg>

                {/* Client point */}
                <div className="absolute left-16 top-24 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg border-2 border-slate-950">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-200 bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded-full mt-1 border border-white/10">
                    {t('client_address_tag')} ({activeOrder.clientNeighborhood})
                  </span>
                </div>

                {/* Moving Courier Moto */}
                <div className="absolute left-1/2 top-14 -translate-x-1/2 flex flex-col items-center animate-bounce">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shadow-xl border-2 border-white pulse-ring">
                      <Bike className="w-5 h-5 font-black" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-300 bg-slate-950/95 backdrop-blur-md px-2.5 py-0.5 rounded-full mt-1 border border-emerald-500/40 shadow-md">
                    {t('courier_moto_tag')} (~{activeOrder.courierGps.etaMinutes} min)
                  </span>
                </div>

                {/* Workshop Destination */}
                <div className="absolute right-16 top-16 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-lg border-2 border-slate-950">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-200 bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded-full mt-1 border border-white/10">
                    {t('workshop_tag')}
                  </span>
                </div>

                {/* Live GPS Area bar */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-950/80 backdrop-blur-xl px-3.5 py-2 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {activeOrder.courierGps.currentArea}
                  </span>
                  <span className="text-emerald-400 font-bold font-mono-code text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    GPS Live
                  </span>
                </div>
              </div>

              {/* Progress Stepper with Frosted Glass Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
                <div className={`p-3.5 rounded-2xl border backdrop-blur-md ${activeOrder.status !== 'quote_requested' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-white/5 border-white/5 text-slate-400'}`}>
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    1. {t('step_escrow_locked')}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{t('step_escrow_sub')}</div>
                </div>

                <div className={`p-3.5 rounded-2xl border backdrop-blur-md ${['pickup_verified', 'in_transit_lab', 'under_repair', 'ready_delivery', 'completed_released'].includes(activeOrder.status) ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'}`}>
                  <div className="font-bold flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    2. {t('step_otp_pickup')}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{t('step_otp_sub')}</div>
                </div>

                <div className={`p-3.5 rounded-2xl border backdrop-blur-md ${['under_repair', 'ready_delivery', 'completed_released'].includes(activeOrder.status) ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-white/5 border-white/5 text-slate-400'}`}>
                  <div className="font-bold flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" />
                    3. {t('step_workshop')}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{t('step_workshop_sub')}</div>
                </div>

                <div className={`p-3.5 rounded-2xl border backdrop-blur-md ${activeOrder.status === 'completed_released' ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300' : 'bg-white/5 border-white/5 text-slate-400'}`}>
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    4. {t('step_tested_release')}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{t('step_tested_sub')}</div>
                </div>
              </div>

              {/* The 3 Crucial Security Action Buttons for Kigali */}
              <div className="pt-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  {t('security_protocol_heading')} :
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Button 1: OTP Code */}
                  <button
                    id="view-otp-code-btn"
                    onClick={() => onOpenOtpModal(activeOrder)}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-emerald-500/40 hover:border-emerald-400 backdrop-blur-md text-left transition-all group shadow-md"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                      <span className="flex items-center gap-1.5 text-emerald-300">
                        <KeyRound className="w-4 h-4" /> {t('btn_otp_title')}
                      </span>
                      <span className="font-mono-code text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">
                        {activeOrder.otpCode}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 group-hover:text-slate-200 transition">
                      {t('btn_otp_desc')}
                    </p>
                  </button>

                  {/* Button 2: Dynamic Badge */}
                  {activeOrder.assignedTechnician && (
                    <button
                      id="view-dynamic-badge-btn"
                      onClick={() => onOpenBadgeModal(activeOrder.assignedTechnician!)}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-blue-500/40 hover:border-blue-400 backdrop-blur-md text-left transition-all group shadow-md"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                        <span className="flex items-center gap-1.5 text-blue-300">
                          <UserCheck className="w-4 h-4" /> {t('btn_badge_title')}
                        </span>
                        <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/40">
                          Live
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 group-hover:text-slate-200 transition">
                        {t('btn_badge_desc')}
                      </p>
                    </button>
                  )}

                  {/* Button 3: Inventory Checklist */}
                  <button
                    id="view-inventory-sheet-btn"
                    onClick={() => onOpenChecklistModal(activeOrder)}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-purple-500/40 hover:border-purple-400 backdrop-blur-md text-left transition-all group shadow-md"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-white mb-1.5">
                      <span className="flex items-center gap-1.5 text-purple-300">
                        <FileCheck2 className="w-4 h-4" /> {t('btn_checklist_title')}
                      </span>
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/40">
                        GPS
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 group-hover:text-slate-200 transition">
                      {t('btn_checklist_desc')}
                    </p>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Escrow Lock, Assigned Tech & Release Button */}
          <div className="space-y-6">
            
            {/* Escrow Protection Box */}
            <div className="bg-white/5 border border-emerald-500/40 backdrop-blur-xl rounded-[28px] p-6 shadow-2xl space-y-4 relative overflow-hidden">
              <div className="absolute right-[-40px] top-[-40px] w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> {t('momo_escrow_title')}
                </span>
                <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 backdrop-blur-md">
                  {t('escrow_locked_badge')}
                </span>
              </div>

              <div className="relative z-10">
                <div className="text-3xl font-black text-white font-mono-code">
                  {activeOrder.escrowAmountRWF.toLocaleString('fr-FR')} RWF
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {t('paid_via')} {activeOrder.paymentMethod === 'mtn_momo' ? 'MTN Mobile Money' : 'Paypack / Airtel'}
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-xs text-slate-300 leading-relaxed backdrop-blur-md relative z-10">
                🛡️ <strong>{t('escrow_guarantee_title')} :</strong> {t('escrow_guarantee_body')}
              </div>

              {/* Escrow Release Button */}
              {activeOrder.status !== 'completed_released' ? (
                <button
                  id="release-escrow-btn"
                  onClick={() => handleApproveAndRelease(activeOrder.id)}
                  className="w-full py-3.5 px-4 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <Check className="w-4 h-4 font-black" />
                  <span>{t('btn_validate_repair')}</span>
                </button>
              ) : (
                <div className="p-3.5 bg-emerald-500/15 border border-emerald-400 rounded-2xl text-center text-xs font-bold text-emerald-300 backdrop-blur-md">
                  ✓ {t('funds_released_success')}
                </div>
              )}
            </div>

            {/* Assigned Pro Card */}
            {activeOrder.assignedTechnician && (
              <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[28px] p-6 shadow-2xl space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t('assigned_technician_title')} :
                </div>

                <div className="flex items-center gap-3.5">
                  <img
                    src={activeOrder.assignedTechnician.photo}
                    alt={activeOrder.assignedTechnician.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20 shadow-md"
                  />
                  <div>
                    <h4 className="font-bold text-white text-base">
                      {activeOrder.assignedTechnician.name}
                    </h4>
                    <p className="text-xs text-emerald-300 font-medium">
                      {activeOrder.assignedTechnician.workshopName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-amber-300 font-bold bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-400/20">
                        ★ {activeOrder.assignedTechnician.rating}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        ({activeOrder.assignedTechnician.reviewsCount} {t('reviews_count')})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-white/10 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{t('plate_number')} :</span>
                    <span className="font-mono-code font-bold text-white bg-white/5 px-2.5 py-0.5 rounded-md border border-white/10">
                      {activeOrder.assignedTechnician.vehiclePlate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{t('direct_phone')} :</span>
                    <a href={`tel:${activeOrder.assignedTechnician.phone}`} className="font-mono-code font-bold text-emerald-400 hover:underline">
                      {activeOrder.assignedTechnician.phone}
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => onOpenBadgeModal(activeOrder.assignedTechnician!)}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl border border-white/10 transition flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t('btn_show_official_badge')}</span>
                </button>
              </div>
            )}

          </div>

        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[28px] p-12 text-center space-y-4 shadow-2xl">
          <Wrench className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white font-display">{t('no_active_repair')}</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {t('no_active_repair_desc')}
          </p>
          <button
            onClick={onOpenBookingModal}
            className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-white/10"
          >
            {t('btn_order_repair')}
          </button>
        </div>
      )}

    </div>
  );
};

