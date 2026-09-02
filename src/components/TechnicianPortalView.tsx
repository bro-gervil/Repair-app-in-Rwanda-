import React, { useState } from 'react';
import { TechnicianPro, RepairOrder } from '../types';
import { 
  Home,
  Wrench, 
  ShieldCheck, 
  KeyRound, 
  Camera, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  DollarSign, 
  Award, 
  Sparkles, 
  Smartphone, 
  Bike, 
  Check, 
  AlertCircle,
  FileCheck2,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../i18n/LanguageContext';

interface TechnicianPortalViewProps {
  technician: TechnicianPro;
  orders: RepairOrder[];
  onVerifyClientOtp: (orderId: string, enteredOtp: string) => boolean;
  onUpdateOrderStatus: (orderId: string, nextStatus: any) => void;
  onOpenBadgePreview: () => void;
  onReturnHome?: () => void;
}

export const TechnicianPortalView: React.FC<TechnicianPortalViewProps> = ({
  technician,
  orders,
  onVerifyClientOtp,
  onUpdateOrderStatus,
  onOpenBadgePreview,
  onReturnHome,
}) => {
  const { t } = useLanguage();
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);

  // Pro Subscription plan tier selection
  const [selectedPlan, setSelectedPlan] = useState<'Standard' | 'Pro Atelier' | 'Elite Micro-Soudure'>('Pro Atelier');

  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    const isValid = onVerifyClientOtp(activeOrder.id, enteredOtp);
    if (isValid) {
      setOtpSuccess(true);
      setOtpError(false);
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
      setTimeout(() => {
        setOtpSuccess(false);
        setEnteredOtp('');
      }, 2500);
    } else {
      setOtpError(true);
      setOtpSuccess(false);
    }
  };

  const handleFastTrackStatus = (nextStatus: string) => {
    if (!activeOrder) return;
    onUpdateOrderStatus(activeOrder.id, nextStatus);
  };

  return (
    <div className="space-y-6">
      {/* Return to Home Banner for Pro Technician */}
      {onReturnHome && (
        <div className="flex items-center justify-between bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md">
          <button
            id="tech-back-to-home-btn"
            onClick={onReturnHome}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-bold transition shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>← {t('back_to_home')}</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">{t('role_tech')}</span>
            <span className="text-slate-500">•</span>
            <span className="text-indigo-300 font-mono-code">{technician.workshopName}</span>
          </div>
        </div>
      )}
      
      {/* Pro Technician Dashboard Header */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-[28px] shadow-2xl relative overflow-hidden">
        <div className="absolute right-[-80px] top-[-80px] w-80 h-80 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute left-[30%] bottom-[-50px] w-60 h-60 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={technician.photo}
                alt={technician.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
              />
              <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1 rounded-full shadow-md border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white font-display">
                  {technician.name}
                </h1>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                  {selectedPlan}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {technician.workshopName} • {technician.neighborhood}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-xs">
                <span className="text-amber-300 font-bold">★ {technician.rating} ({technician.reviewsCount} {t('reviews_label')})</span>
                <span className="text-slate-400">• {t('moto_label')} : <strong className="text-white font-mono-code">{technician.vehiclePlate}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenBadgePreview}
              className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/15 font-bold text-xs rounded-2xl transition flex items-center gap-2 backdrop-blur-md shadow-md active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>{t('btn_test_badge')}</span>
            </button>

            <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-right">
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">{t('secured_earnings_month')}</span>
              <div className="text-lg font-black text-white font-mono-code">
                485 000 <span className="text-xs font-normal text-emerald-400">RWF</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Working Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column 2 spans: Active Handover Terminal & OTP Validation */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Job Handover Terminal */}
          {activeOrder ? (
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 shadow-2xl space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10">
                <div>
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                    {t('current_job_banner')} • {t('order_label')} {activeOrder.orderNumber}
                  </span>
                  <h3 className="text-xl font-bold text-white font-display mt-0.5">
                    {activeOrder.deviceBrand} {activeOrder.deviceModel}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    {t('client_label')} : <strong className="text-white">{activeOrder.clientName}</strong> ({activeOrder.clientNeighborhood} - {activeOrder.clientAddress})
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">{t('escrow_amount_label')} :</span>
                  <div className="text-xl font-black text-white font-mono-code">
                    {activeOrder.escrowAmountRWF.toLocaleString('fr-FR')} <span className="text-xs font-normal text-emerald-400">RWF</span>
                  </div>
                </div>
              </div>

              {/* Step 1: Physical Pickup OTP Entry Terminal */}
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-[24px] border border-white/15 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-indigo-400" />
                    <h4 className="text-sm font-bold text-white">
                      {t('otp_pickup_terminal_title')}
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {t('otp_secret_hint')}
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  {t('otp_pickup_instruction')}
                </p>

                <form onSubmit={handleOtpSubmit} className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    maxLength={4}
                    value={enteredOtp}
                    onChange={(e) => {
                      setEnteredOtp(e.target.value);
                      setOtpError(false);
                    }}
                    placeholder="Ex: 8492"
                    className="w-full sm:w-48 text-center bg-white/5 border border-white/20 rounded-2xl py-3 px-4 text-2xl font-mono-code font-black text-white tracking-widest focus:outline-hidden focus:border-indigo-400 focus:bg-white/10 backdrop-blur-md"
                  />

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2 shadow-xl shadow-white/10 active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>{t('btn_validate_pickup')}</span>
                  </button>
                </form>

                {otpSuccess && (
                  <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-300 flex items-center gap-2 animate-in fade-in backdrop-blur-md">
                    <Check className="w-4 h-4" />
                    <span>{t('otp_pickup_success')}</span>
                  </div>
                )}

                {otpError && (
                  <div className="p-3.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs font-bold text-rose-300 flex items-center gap-2 animate-in fade-in backdrop-blur-md">
                    <AlertCircle className="w-4 h-4" />
                    <span>{t('otp_pickup_error')} : {activeOrder.otpCode}</span>
                  </div>
                )}
              </div>

              {/* Status Update Quick Toggles */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {t('repair_progress_heading')} :
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleFastTrackStatus('under_repair')}
                    className={`p-4 rounded-2xl border text-left text-xs transition backdrop-blur-md ${
                      activeOrder.status === 'under_repair'
                        ? 'bg-white/10 border-white/30 text-white font-bold shadow-lg'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold text-white">1. {t('tech_step_microsoldering')}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{t('tech_step_oem_desc')}</div>
                  </button>

                  <button
                    onClick={() => handleFastTrackStatus('ready_delivery')}
                    className={`p-4 rounded-2xl border text-left text-xs transition backdrop-blur-md ${
                      activeOrder.status === 'ready_delivery'
                        ? 'bg-white/10 border-white/30 text-white font-bold shadow-lg'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold text-white">2. {t('tech_step_ready')}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{t('tech_step_tests_desc')}</div>
                  </button>

                  <button
                    onClick={() => handleFastTrackStatus('completed_released')}
                    className={`p-4 rounded-2xl border text-left text-xs transition backdrop-blur-md ${
                      activeOrder.status === 'completed_released'
                        ? 'bg-white/10 border-white/30 text-white font-bold shadow-lg'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold text-white">3. {t('tech_step_closed')}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{t('tech_step_momo_desc')}</div>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[28px] p-8 text-center text-slate-400 text-xs">
              {t('no_active_order')}
            </div>
          )}

        </div>

        {/* Right Column: Pro SaaS Subscription (5k / 10k RWF model) & Reviews */}
        <div className="space-y-6">
          
          {/* SaaS Plan Selector (Image 3 requirement) */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[28px] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-400" /> {t('pro_subscription_title')}
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {t('active_status')}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {t('pro_subscription_desc')}
            </p>

            <div className="space-y-2.5">
              {[
                { name: t('plan_starter_name'), price: t('plan_starter_price'), desc: t('plan_starter_desc') },
                { name: t('plan_pro_name'), price: t('plan_pro_price'), desc: t('plan_pro_desc') },
                { name: t('plan_elite_name'), price: t('plan_elite_price'), desc: t('plan_elite_desc') },
              ].map((plan) => (
                <div
                  key={plan.name}
                  onClick={() => setSelectedPlan(plan.name as any)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer text-xs backdrop-blur-md ${
                    selectedPlan === plan.name
                      ? 'bg-white/10 border-white/30 text-white font-bold shadow-lg'
                      : 'bg-white/5 border-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{plan.name}</span>
                    <span className="text-white font-mono-code">{plan.price}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{plan.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance & Quality Metrics */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[28px] p-6 shadow-2xl space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('performance_metrics_title')} :
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400">{t('avg_repair_time_label')} :</span>
                <span className="font-bold text-white font-mono-code">1h 45min</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400">{t('satisfaction_rate_label')} :</span>
                <span className="font-bold text-emerald-300 font-mono-code">99.2%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400">{t('devices_saved_label')} :</span>
                <span className="font-bold text-teal-300 font-mono-code">218 {t('units_label')}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

