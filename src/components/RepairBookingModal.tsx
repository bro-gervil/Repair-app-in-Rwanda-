import React, { useState } from 'react';
import { DeviceCategory, RepairQuote, TechnicianPro } from '../types';
import { INITIAL_TECHNICIANS } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  Wrench, 
  Smartphone, 
  Laptop, 
  Tablet, 
  Headphones, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  CheckCircle, 
  X, 
  Camera, 
  ArrowRight, 
  Sparkles, 
  DollarSign, 
  AlertCircle,
  Bike
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RepairBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitOrder: (orderData: any) => void;
  initialClient?: {
    name: string;
    phone: string;
    neighborhood: string;
  };
}

const CATEGORIES: { id: DeviceCategory; label: string; icon: any }[] = [
  { id: 'smartphone', label: 'Smartphone', icon: Smartphone },
  { id: 'laptop', label: 'Ordinateur / MacBook', icon: Laptop },
  { id: 'tablet', label: 'Tablette / iPad', icon: Tablet },
  { id: 'accessory', label: 'Écouteurs / Accessoire', icon: Headphones },
];

const COMMON_ISSUES = [
  { id: 'screen', label: 'Écran OLED / Vitre Fissurée', costEst: 85000 },
  { id: 'battery', label: 'Batterie Usée / Gonflée', costEst: 45000 },
  { id: 'charging', label: 'Connecteur de Charge / Port USB-C', costEst: 35000 },
  { id: 'water', label: 'Chute dans l\'Eau / Désoxydation', costEst: 65000 },
  { id: 'motherboard', label: 'Micro-Soudure Carte Mère / Court-circuit', costEst: 110000 },
  { id: 'camera', label: 'Appareil Photo / Lentille Cassée', costEst: 50000 },
];

const KIGALI_NEIGHBORHOODS = [
  'Remera (Stade Amahoro / Giporoso)',
  'Kacyiru (Zone Ambassades / Norrsken)',
  'Nyarugenge (Downtown / City Center)',
  'Kimironko (Marché / Prison Road)',
  'Gikondo (Zone Industrielle)',
  'Nyamirambo (Biryogo)',
  'Kicukiro (Centre / Sonatubes)',
  'Kagugu / Gisozi',
];

export const RepairBookingModal: React.FC<RepairBookingModalProps> = ({
  isOpen,
  onClose,
  onSubmitOrder,
  initialClient,
}) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Step 1: Device & Issue
  const [category, setCategory] = useState<DeviceCategory>('smartphone');
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('iPhone 14 Pro');
  const [selectedIssues, setSelectedIssues] = useState<string[]>(['screen']);
  const [customDescription, setCustomDescription] = useState('Écran noir suite à une chute, le vibreur fonctionne toujours.');
  const [urgency, setUrgency] = useState<'standard' | 'express_1h'>('express_1h');
  
  // Step 2: Client Details in Kigali
  const [clientName, setClientName] = useState(initialClient?.name || 'Patrick Habimana');
  const [clientPhone, setClientPhone] = useState(initialClient?.phone || '+250 788 654 321');
  const [neighborhood, setNeighborhood] = useState(initialClient?.neighborhood || 'Remera (Stade Amahoro / Giporoso)');
  const [exactAddress, setExactAddress] = useState('KG 11 Ave, Immeuble Horizon');
  const [paymentMethod, setPaymentMethod] = useState<'mtn_momo' | 'airtel_money' | 'paypack'>('mtn_momo');

  React.useEffect(() => {
    if (initialClient) {
      if (initialClient.name) setClientName(initialClient.name);
      if (initialClient.phone) setClientPhone(initialClient.phone);
      if (initialClient.neighborhood) setNeighborhood(initialClient.neighborhood);
    }
  }, [initialClient, isOpen]);

  // Step 3: Quotes Selection
  const [selectedQuoteIndex, setSelectedQuoteIndex] = useState(0);

  const getCategoryLabel = (catId: string) => {
    switch (catId) {
      case 'smartphone': return t('cat_smartphone');
      case 'laptop': return t('cat_laptop');
      case 'tablet': return t('cat_tablet');
      case 'accessory': return t('cat_accessory');
      default: return catId;
    }
  };

  const getIssueLabel = (issueId: string) => {
    switch (issueId) {
      case 'screen': return t('issue_screen');
      case 'battery': return t('issue_battery');
      case 'charging': return t('issue_charging');
      case 'water': return t('issue_water');
      case 'motherboard': return t('issue_motherboard');
      case 'camera': return t('issue_camera');
      default: return issueId;
    }
  };

  if (!isOpen) return null;

  // Calculate estimated price based on selections
  const baseCost = selectedIssues.reduce((acc, issueId) => {
    const found = COMMON_ISSUES.find((i) => i.id === issueId);
    return acc + (found ? found.costEst : 50000);
  }, 0);

  const multiplier = category === 'laptop' ? 1.6 : category === 'tablet' ? 1.2 : 1.0;
  const estimatedTotal = Math.round((baseCost * multiplier) / 1000) * 1000;

  // Generate dynamic quotes from the 3 certified technicians in Kigali
  const quotes: RepairQuote[] = INITIAL_TECHNICIANS.map((tech, idx) => {
    const variance = idx === 0 ? 0 : idx === 1 ? -5000 : 10000;
    const finalPrice = Math.max(25000, estimatedTotal + variance);
    return {
      id: `quote-${tech.id}-${Date.now()}`,
      technicianId: tech.id,
      technicianName: tech.name,
      technicianPhoto: tech.photo,
      workshopName: tech.workshopName,
      neighborhood: tech.neighborhood,
      rating: tech.rating,
      priceRWF: finalPrice,
      partsQuality: idx === 0 ? t('quote_part_oem') : idx === 1 ? t('quote_part_grade_a') : t('quote_part_eco'),
      warrantyMonths: 6,
      estimatedHours: urgency === 'express_1h' ? 1.5 : 3,
      message: `${tech.workshopName} (${tech.neighborhood}): ${t('quote_tech_message')}`,
    };
  });

  const toggleIssue = (issueId: string) => {
    if (selectedIssues.includes(issueId)) {
      if (selectedIssues.length > 1) {
        setSelectedIssues(selectedIssues.filter((id) => id !== issueId));
      }
    } else {
      setSelectedIssues([...selectedIssues, issueId]);
    }
  };

  const handleFinalSubmit = () => {
    const chosenQuote = quotes[selectedQuoteIndex] || quotes[0];
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `GT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: t('order_created_just_now'),
      clientName,
      clientPhone,
      clientNeighborhood: neighborhood.split(' ')[0],
      clientAddress: exactAddress,
      deviceCategory: category,
      deviceBrand: brand,
      deviceModel: model,
      reportedIssue: customDescription,
      issueTags: selectedIssues.map(
        (id) => COMMON_ISSUES.find((i) => i.id === id)?.label || id
      ),
      devicePhotos: [
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&auto=format&fit=crop&q=80',
      ],
      status: 'courier_assigned' as const,
      urgency,
      serviceType: 'courier_pickup' as const,
      quotes: quotes,
      selectedQuote: chosenQuote,
      assignedTechnician: INITIAL_TECHNICIANS.find((t) => t.id === chosenQuote.technicianId) || INITIAL_TECHNICIANS[0],
      otpCode: `${Math.floor(1000 + Math.random() * 9000)}`,
      qrToken: `GT-SECURE-${Math.floor(1000 + Math.random() * 9000)}-KGL-RW`,
      escrowAmountRWF: chosenQuote.priceRWF,
      platformFeeRWF: Math.round(chosenQuote.priceRWF * 0.05),
      paymentMethod,
      momoPhoneNumber: clientPhone,
      escrowStatus: 'held_in_escrow' as const,
      transitStep: 1,
      courierGps: {
        lat: -1.9542,
        lng: 30.1044,
        currentArea: `${neighborhood.split(' ')[0]}: ${t('courier_assigned_enroute')}`,
        etaMinutes: 12,
      },
    };

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    onSubmitOrder(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-[28px] bg-slate-950/80 border border-white/15 backdrop-blur-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Ambient Glows */}
        <div className="absolute right-[-40px] top-[-40px] w-64 h-64 bg-indigo-600/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute left-[-40px] bottom-[-40px] w-64 h-64 bg-purple-600/15 rounded-full blur-[90px] pointer-events-none" />

        {/* Modal Top Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/15 text-white">
              <Wrench className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                {t('booking_modal_title')}
              </h3>
              <p className="text-xs text-slate-300">
                {t('booking_modal_desc')}
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

        {/* Multi-step progress indicator */}
        <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex items-center justify-between text-xs backdrop-blur-md relative z-10">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-white font-bold' : 'text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-white text-slate-950 font-bold' : 'bg-white/10 text-slate-400'}`}>1</span>
            <span>{t('book_step_1')}</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-white font-bold' : 'text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-white text-slate-950 font-bold' : 'bg-white/10 text-slate-400'}`}>2</span>
            <span>{t('book_step_2')}</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-white font-bold' : 'text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-white text-slate-950 font-bold' : 'bg-white/10 text-slate-400'}`}>3</span>
            <span>{t('book_step_3')}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6 max-h-[68vh] overflow-y-auto relative z-10">
          
          {/* STEP 1: Device & Issue */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2.5">
                  {t('device_type_label')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`p-4 rounded-2xl border text-left flex flex-col items-center justify-center gap-2 transition backdrop-blur-md ${
                          category === cat.id
                            ? 'bg-white/15 border-white/40 text-white shadow-lg'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="text-xs font-semibold text-center">{getCategoryLabel(cat.id)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">{t('brand_label')}</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Ex: Apple, Samsung, Dell, HP..."
                    className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-400 focus:bg-white/10 backdrop-blur-md"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">{t('model_label')}</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Ex: iPhone 14 Pro, MacBook M2, S24..."
                    className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-400 focus:bg-white/10 backdrop-blur-md"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2.5">
                  {t('common_issues_label')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {COMMON_ISSUES.map((issue) => {
                    const isSelected = selectedIssues.includes(issue.id);
                    return (
                      <button
                        key={issue.id}
                        type="button"
                        onClick={() => toggleIssue(issue.id)}
                        className={`p-3.5 rounded-2xl border text-left flex items-center justify-between text-xs transition backdrop-blur-md ${
                          isSelected
                            ? 'bg-white/15 border-white/40 text-white font-medium shadow-md'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                        }`}
                      >
                        <span>{getIssueLabel(issue.id)}</span>
                        <span className="text-[11px] font-mono-code text-indigo-300">
                          ~{issue.costEst.toLocaleString('fr-FR')} RWF
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {t('issue_desc_label')}
                </label>
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-white/5 border border-white/15 rounded-2xl p-3.5 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-400 focus:bg-white/10 backdrop-blur-md"
                  placeholder={t('issue_desc_placeholder')}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2.5">
                  {t('urgency_label')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUrgency('express_1h')}
                    className={`p-4 rounded-2xl border text-left transition backdrop-blur-md ${
                      urgency === 'express_1h'
                        ? 'bg-white/15 border-white/40 text-white shadow-lg'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-amber-300">
                      <Clock className="w-4 h-4" />
                      <span>{t('urgency_express')}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">
                      {t('urgency_express_desc')}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUrgency('standard')}
                    className={`p-4 rounded-2xl border text-left transition backdrop-blur-md ${
                      urgency === 'standard'
                        ? 'bg-white/15 border-white/40 text-white shadow-lg'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span>{t('urgency_standard')}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">
                      {t('urgency_standard_desc')}
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Location & Payment */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3 backdrop-blur-md">
                <Bike className="w-5 h-5 text-indigo-400 shrink-0" />
                <p className="text-xs text-slate-200">
                  {t('sec_pillar_2_desc')}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">{t('client_name_label')}</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white focus:outline-hidden focus:border-indigo-400 focus:bg-white/10 backdrop-blur-md"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">{t('client_phone_label')}</label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white font-mono-code focus:outline-hidden focus:border-indigo-400 focus:bg-white/10 backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">{t('neighborhood_label')}</label>
                  <select
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full bg-slate-900 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white focus:outline-hidden focus:border-indigo-400 backdrop-blur-md"
                  >
                    {KIGALI_NEIGHBORHOODS.map((q) => (
                      <option key={q} value={q} className="bg-slate-900 text-white">{q}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">{t('exact_address_label')}</label>
                <input
                  type="text"
                  value={exactAddress}
                  onChange={(e) => setExactAddress(e.target.value)}
                  placeholder={t('address_placeholder')}
                  className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-400 focus:bg-white/10 backdrop-blur-md"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2.5">
                  {t('payment_mode_label')}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mtn_momo')}
                    className={`p-3.5 rounded-2xl border text-center transition backdrop-blur-md ${
                      paymentMethod === 'mtn_momo'
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold">{t('payment_momo')}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">MTN MoMo Escrow</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('airtel_money')}
                    className={`p-3.5 rounded-2xl border text-center transition backdrop-blur-md ${
                      paymentMethod === 'airtel_money'
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 font-bold'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold">{t('payment_airtel')}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Airtel Escrow</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypack')}
                    className={`p-3.5 rounded-2xl border text-center transition backdrop-blur-md ${
                      paymentMethod === 'paypack'
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 font-bold'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold">{t('payment_paypack')}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Paypack Rwanda</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Quotes & Escrow Confirmation */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {t('quotes_received_label')} ({quotes.length})
                </span>
                <span className="text-[11px] text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-medium">
                  {t('oem_guarantee_pill')}
                </span>
              </div>

              <div className="space-y-3">
                {quotes.map((quote, idx) => {
                  const isSelected = selectedQuoteIndex === idx;
                  return (
                    <div
                      key={quote.id}
                      onClick={() => setSelectedQuoteIndex(idx)}
                      className={`p-4 rounded-2xl border transition cursor-pointer backdrop-blur-md ${
                        isSelected
                          ? 'bg-white/15 border-white/40 shadow-xl ring-1 ring-white/30'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={quote.technicianPhoto}
                            alt={quote.technicianName}
                            className="w-12 h-12 rounded-2xl object-cover border border-white/20"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-white text-sm">{quote.technicianName}</h4>
                              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-semibold border border-indigo-500/30">
                                ★ {quote.rating}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300">{quote.workshopName} • {quote.neighborhood}</p>
                            <span className="text-[11px] text-emerald-300 font-medium">
                              ✓ {quote.partsQuality}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-base font-black text-white font-mono-code">
                            {quote.priceRWF.toLocaleString('fr-FR')} <span className="text-xs font-normal text-emerald-400">RWF</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {t('warranty_label')}: {quote.warrantyMonths} {t('months_unit')}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 mt-2.5 bg-white/5 p-2.5 rounded-xl border border-white/5 italic">
                        "{quote.message}"
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Escrow guarantee banner */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/15 space-y-2 backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  {t('escrow_guarantee_title')}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t('escrow_guarantee_body')}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 bg-white/5 border-t border-white/10 flex items-center justify-between backdrop-blur-xl relative z-10">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition border border-white/10"
            >
              {t('prev_btn')}
            </button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as any)}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs rounded-2xl transition flex items-center gap-1.5 shadow-xl shadow-white/10 active:scale-95"
            >
              <span>{t('next_btn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              id="confirm-repair-order-btn"
              onClick={handleFinalSubmit}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-950 font-black text-xs rounded-2xl transition flex items-center gap-2 shadow-xl shadow-white/10 active:scale-95 animate-pulse"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>{t('confirm_lock_escrow_btn')}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
