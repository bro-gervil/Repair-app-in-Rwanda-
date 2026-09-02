import React, { useState } from 'react';
import { 
  UserEcoProfile, 
  EWasteCollectionPoint, 
  EcoRewardVoucher 
} from '../types';
import { 
  Home,
  Recycle, 
  Sparkles, 
  MapPin, 
  Gift, 
  Award, 
  CheckCircle2, 
  Plus, 
  BatteryMedium, 
  Cpu, 
  Smartphone, 
  QrCode, 
  Clock, 
  Phone,
  Leaf,
  Droplets,
  TreePine,
  ArrowRight,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../i18n/LanguageContext';

interface RecyclingViewProps {
  userProfile: UserEcoProfile;
  collectionPoints: EWasteCollectionPoint[];
  rewards: EcoRewardVoucher[];
  onRedeemReward: (reward: EcoRewardVoucher) => void;
  onRecordDeposit: (deposit: any) => void;
  onReturnHome?: () => void;
}

export const RecyclingView: React.FC<RecyclingViewProps> = ({
  userProfile,
  collectionPoints,
  rewards,
  onRedeemReward,
  onRecordDeposit,
  onReturnHome,
}) => {
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<'rewards' | 'deposit' | 'points_map' | 'history'>('rewards');
  const [selectedPointId, setSelectedPointId] = useState<string>(collectionPoints[0]?.id || '');

  const ewasteItems = [
    { id: 'battery', name: t('ewaste_item_battery'), pointsPerUnit: 80, co2Kg: 4.2 },
    { id: 'motherboard', name: t('ewaste_item_motherboard'), pointsPerUnit: 120, co2Kg: 6.5 },
    { id: 'phone_dead', name: t('ewaste_item_phone'), pointsPerUnit: 100, co2Kg: 5.0 },
    { id: 'cables', name: t('ewaste_item_cables'), pointsPerUnit: 60, co2Kg: 3.1 },
    { id: 'screen_broken', name: t('ewaste_item_screen'), pointsPerUnit: 70, co2Kg: 3.8 },
  ];
  
  // Deposit simulator state
  const [depositItem, setDepositItem] = useState(ewasteItems[0].id);
  const [depositQuantity, setDepositQuantity] = useState<number>(2);
  const [depositPoint, setDepositPoint] = useState<string>(collectionPoints[0]?.name || '');
  const [depositTicketCode, setDepositTicketCode] = useState<string | null>(null);

  const selectedItemData = ewasteItems.find((i) => i.id === depositItem) || ewasteItems[0];
  const calculatedPoints = selectedItemData.pointsPerUnit * depositQuantity;
  const calculatedCo2 = (selectedItemData.co2Kg * depositQuantity).toFixed(1);

  const handleGenerateDepositTicket = () => {
    const ticket = `GT-ECO-${Math.floor(1000 + Math.random() * 9000)}-KGL`;
    setDepositTicketCode(ticket);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  };

  const handleClaimReward = (reward: EcoRewardVoucher) => {
    if (userProfile.giraPoints < reward.pointsCost) {
      return;
    }
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (e) {}
    onRedeemReward(reward);
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
            {t('tab_recycling')}
          </span>
        </div>
      )}
      
      {/* Top Banner: Eco-Impact Kigali */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-[28px] shadow-2xl relative overflow-hidden">
        <div className="absolute right-[-80px] top-[-80px] w-80 h-80 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute left-[30%] bottom-[-50px] w-60 h-60 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/15 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                {t('eco_hero_badge')}
              </span>
              <span className="text-xs text-slate-400">• {t('eco_hero_sub')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
              {t('eco_hero_title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {t('eco_hero_desc')}
            </p>
          </div>

          {/* Eco Wallet Widget */}
          <div className="bg-white/5 backdrop-blur-xl p-5 rounded-[24px] border border-white/15 shrink-0 flex items-center gap-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t('eco_wallet_title')}
              </span>
              <div className="text-2xl font-black text-white font-mono-code">
                {userProfile.giraPoints} <span className="text-xs font-normal text-emerald-400">pts</span>
              </div>
              <span className="text-[10px] text-slate-400">
                ≈ {(userProfile.giraPoints * 20).toLocaleString('fr-FR')} {t('eco_reduction_approx')}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Impact counters */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/10 text-center">
          <div className="bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/5">
            <div className="text-lg font-black text-white font-mono-code flex items-center justify-center gap-1.5">
              <Recycle className="w-4 h-4 text-emerald-400" />
              {userProfile.totalEwasteKg} kg
            </div>
            <span className="text-[10px] text-slate-400 font-medium">{t('stat_ewaste')}</span>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/5">
            <div className="text-lg font-black text-white font-mono-code flex items-center justify-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-400" />
              {userProfile.co2AvoidedKg} kg
            </div>
            <span className="text-[10px] text-slate-400 font-medium">{t('stat_co2')}</span>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/5">
            <div className="text-lg font-black text-white font-mono-code flex items-center justify-center gap-1.5">
              <TreePine className="w-4 h-4 text-emerald-400" />
              {userProfile.devicesRepairedCount}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">{t('stat_repaired')}</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        <button
          onClick={() => setSelectedTab('rewards')}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 border ${
            selectedTab === 'rewards'
              ? 'bg-white text-slate-950 font-bold border-white shadow-md shadow-white/10'
              : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border-white/5'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>{t('tab_rewards')}</span>
        </button>

        <button
          onClick={() => setSelectedTab('deposit')}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 border ${
            selectedTab === 'deposit'
              ? 'bg-white text-slate-950 font-bold border-white shadow-md shadow-white/10'
              : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border-white/5'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{t('tab_declare_deposit')}</span>
        </button>

        <button
          onClick={() => setSelectedTab('points_map')}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 border ${
            selectedTab === 'points_map'
              ? 'bg-white text-slate-950 font-bold border-white shadow-md shadow-white/10'
              : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border-white/5'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>{t('tab_kigali_points')} ({collectionPoints.length})</span>
        </button>

        <button
          onClick={() => setSelectedTab('history')}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 border ${
            selectedTab === 'history'
              ? 'bg-white text-slate-950 font-bold border-white shadow-md shadow-white/10'
              : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border-white/5'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{t('tab_badges_history')}</span>
        </button>
      </div>

      {/* TAB 1: Rewards Store */}
      {selectedTab === 'rewards' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('rewards_heading')} :
            </h3>
            <span className="text-xs text-emerald-400 font-semibold">
              {t('rewards_balance')} : {userProfile.giraPoints} pts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {rewards.map((reward) => {
              const canAfford = userProfile.giraPoints >= reward.pointsCost;
              return (
                <div
                  key={reward.id}
                  className="bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-white/20 backdrop-blur-xl rounded-[28px] p-6 flex flex-col justify-between transition-all shadow-2xl space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-bold text-white text-base leading-snug">
                        {reward.title}
                      </h4>
                      <span className="text-xs font-black text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/40 font-mono-code shrink-0">
                        {reward.pointsCost} pts
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {reward.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      {t('saving_label')} : <strong className="text-emerald-300 font-mono-code">{reward.discountRWF.toLocaleString('fr-FR')} RWF</strong>
                    </div>

                    <button
                      onClick={() => handleClaimReward(reward)}
                      disabled={!canAfford}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 ${
                        canAfford
                          ? 'bg-white hover:bg-slate-100 text-slate-950 shadow-lg shadow-white/10 active:scale-95'
                          : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                      }`}
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>{canAfford ? t('btn_unlock_voucher') : `${t('btn_need_more_pts')} ${reward.pointsCost - userProfile.giraPoints} pts`}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Vouchers Box */}
          {userProfile.activeVouchers.length > 0 && (
            <div className="mt-6 bg-white/5 backdrop-blur-xl p-6 rounded-[28px] border border-emerald-500/40 space-y-3 shadow-2xl">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {t('active_vouchers_title')} :
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {userProfile.activeVouchers.map((v, i) => (
                  <div key={i} className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">{v.voucher.title}</div>
                      <div className="text-[10px] text-slate-400">{t('expires_label')} {v.expiresAt}</div>
                    </div>
                    <div className="bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/40 text-xs font-mono-code font-bold text-emerald-300">
                      {v.code}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Deposit Simulator & Ticket Generation */}
      {selectedTab === 'deposit' && (
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="max-w-xl space-y-5">
            <div>
              <h3 className="text-xl font-bold text-white font-display">
                {t('deposit_form_title')}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {t('deposit_form_desc')}
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2.5">
                1. {t('deposit_type_label')} :
              </label>
              <div className="space-y-2">
                {ewasteItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDepositItem(item.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between text-xs transition backdrop-blur-md ${
                      depositItem === item.id
                        ? 'bg-white/10 border-white/30 text-white font-bold shadow-lg'
                        : 'bg-white/5 border-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <span>{item.name}</span>
                    <span className="font-mono-code text-emerald-300 font-bold">
                      +{item.pointsPerUnit} pts/{t('unit_label')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">{t('deposit_qty_label')} :</label>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white backdrop-blur-md">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={depositQuantity}
                    onChange={(e) => setDepositQuantity(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-bold text-emerald-300 focus:outline-hidden"
                  />
                  <span className="text-slate-400 text-xs">{t('units_label')}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">{t('deposit_point_label')} :</label>
                <select
                  value={depositPoint}
                  onChange={(e) => setDepositPoint(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-indigo-400 backdrop-blur-md"
                >
                  {collectionPoints.map((cp) => (
                    <option key={cp.id} value={cp.name} className="bg-slate-900 text-white">{cp.name} ({cp.neighborhood})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Estimated gain preview */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between text-xs backdrop-blur-md">
              <div>
                <span className="text-slate-400">{t('estimated_gain_label')} :</span>
                <div className="text-xl font-black text-white font-mono-code mt-0.5">
                  +{calculatedPoints} <span className="text-xs font-normal text-emerald-400">Gira-Points</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-400">{t('eco_impact_label')} :</span>
                <div className="text-sm font-bold text-teal-300 font-mono-code mt-0.5">
                  ~{calculatedCo2} kg CO2 {t('co2_avoided')}
                </div>
              </div>
            </div>

            {/* Generate Ticket Button */}
            {!depositTicketCode ? (
              <button
                type="button"
                id="generate-deposit-ticket-btn"
                onClick={handleGenerateDepositTicket}
                className="w-full py-3.5 bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-white/10 active:scale-95"
              >
                <QrCode className="w-4 h-4 text-slate-950" />
                <span>{t('btn_generate_pass')}</span>
              </button>
            ) : (
              <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[28px] border border-emerald-500/50 text-center space-y-4 shadow-2xl">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                  {t('pass_active_banner')}
                </span>
                <div className="bg-white p-4 rounded-2xl w-40 h-40 mx-auto flex items-center justify-center shadow-lg">
                  <QrCode className="w-32 h-32 text-slate-950" />
                </div>
                <div className="text-base font-mono-code font-black text-white">
                  {depositTicketCode}
                </div>
                <p className="text-[11px] text-slate-400">
                  {t('pass_agent_note')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Kigali Collection Points Map */}
      {selectedTab === 'points_map' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('map_approved_points')} :
            </h3>

            {collectionPoints.map((point) => {
              const isSelected = point.id === selectedPointId;
              return (
                <div
                  key={point.id}
                  onClick={() => setSelectedPointId(point.id)}
                  className={`p-5 rounded-[24px] border transition cursor-pointer space-y-2 backdrop-blur-xl ${
                    isSelected
                      ? 'bg-white/10 border-white/30 shadow-2xl'
                      : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-white text-base">{point.name}</h4>
                      <p className="text-xs text-emerald-300 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {point.address} ({point.neighborhood})
                      </p>
                    </div>
                    <span className="text-[10px] font-bold bg-white/10 text-white px-2.5 py-0.5 rounded-full border border-white/15">
                      {point.partnerType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/10">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {point.openingHours}
                    </span>
                    <span className="font-mono-code text-slate-300">
                      {t('total_recycled_label')} : {point.totalCollectedKg} kg
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Preview Simulation */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[28px] p-6 flex flex-col justify-between space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {t('sat_location_title')}
              </span>
              <span className="text-xs text-emerald-300 font-mono-code font-bold bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {collectionPoints.length} {t('active_hubs_pill')}
              </span>
            </div>

            <div className="h-64 rounded-2xl bg-slate-950/60 border border-white/10 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {collectionPoints.map((cp, idx) => {
                const isCurrent = cp.id === selectedPointId;
                const pos = [
                  { top: '35%', left: '60%' },
                  { top: '25%', left: '45%' },
                  { top: '55%', left: '30%' },
                  { top: '30%', left: '75%' },
                ][idx] || { top: '50%', left: '50%' };

                return (
                  <div
                    key={cp.id}
                    onClick={() => setSelectedPointId(cp.id)}
                    style={{ top: pos.top, left: pos.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group flex flex-col items-center"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                      isCurrent ? 'bg-white text-slate-950 scale-125 ring-4 ring-white/20 font-bold' : 'bg-slate-800 text-emerald-300 group-hover:scale-110 border border-white/10'
                    }`}>
                      <Recycle className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-white bg-slate-950/90 px-1.5 py-0.5 rounded-md mt-1 border border-white/10 whitespace-nowrap shadow-md">
                      {cp.neighborhood}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
              💡 <strong>{t('pro_tip_title')} :</strong> {t('pro_tip_desc')}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Badges & History */}
      {selectedTab === 'history' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              {t('badges_heading')} :
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {userProfile.earnedBadges.map((badge) => (
                <div key={badge.id} className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 rounded-[24px] flex items-start gap-3.5 shadow-xl">
                  <div className="text-3xl">{badge.icon}</div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{badge.name}</h4>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              {t('history_heading')} :
            </h3>
            <div className="space-y-2.5">
              {userProfile.dropoffHistory.map((rec) => (
                <div key={rec.id} className="bg-white/5 border border-white/10 backdrop-blur-xl p-4 rounded-2xl flex items-center justify-between text-xs shadow-md">
                  <div>
                    <div className="font-bold text-white">{rec.itemType}</div>
                    <div className="text-[11px] text-slate-400">{rec.collectionPointName} • {rec.date}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono-code text-emerald-300 font-bold">+{rec.pointsEarned} pts</span>
                    <div className="text-[10px] text-slate-400">{rec.estimatedWeightKg} kg</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

