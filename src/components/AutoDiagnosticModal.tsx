import React, { useState } from 'react';
import { DeviceCategory } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  Sparkles, 
  CheckCircle2, 
  Smartphone, 
  Laptop, 
  Tablet, 
  X, 
  Check, 
  AlertTriangle, 
  DollarSign, 
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AutoDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListDevice?: (item: any) => void;
}

export const AutoDiagnosticModal: React.FC<AutoDiagnosticModalProps> = ({
  isOpen,
  onClose,
  onListDevice,
}) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Diagnostic parameters
  const [category, setCategory] = useState<DeviceCategory>('smartphone');
  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('iPhone 13 Pro 128 Go');
  const [screenCondition, setScreenCondition] = useState<'perfect' | 'micro_scratches' | 'cracked'>('perfect');
  const [batteryHealth, setBatteryHealth] = useState<number>(88);
  const [faceIdWorking, setFaceIdWorking] = useState<boolean>(true);
  const [camerasWorking, setCamerasWorking] = useState<boolean>(true);
  const [cosmeticBody, setCosmeticBody] = useState<'mint' | 'good' | 'scratched'>('good');
  const [icloudClean, setIcloudClean] = useState<boolean>(true);

  if (!isOpen) return null;

  // Algorithmic Fair Price Calculation for Kigali Market (RWF)
  const calculateFairPrice = () => {
    let baseValue = 650000; // Base reference for iPhone 13 Pro in Kigali
    if (brand.toLowerCase().includes('samsung')) baseValue = 580000;
    if (brand.toLowerCase().includes('macbook') || category === 'laptop') baseValue = 850000;
    if (category === 'tablet') baseValue = 420000;

    let discount = 0;
    if (screenCondition === 'micro_scratches') discount += 0.08;
    if (screenCondition === 'cracked') discount += 0.28;

    if (batteryHealth < 80) discount += 0.12;
    else if (batteryHealth < 85) discount += 0.06;

    if (!faceIdWorking) discount += 0.15;
    if (!camerasWorking) discount += 0.12;
    if (cosmeticBody === 'scratched') discount += 0.08;

    const fairPriceRWF = Math.round((baseValue * (1 - discount)) / 5000) * 5000;
    const instantBuyoutOfferRWF = Math.round((fairPriceRWF * 0.88) / 5000) * 5000;
    const newPriceRef = Math.round((baseValue * 1.45) / 5000) * 5000;

    return {
      fairPriceRWF,
      instantBuyoutOfferRWF,
      newPriceRef,
      grade: screenCondition === 'perfect' && cosmeticBody === 'mint' ? 'Grade A+ (Comme Neuf)' : screenCondition === 'cracked' ? 'Grade B (À réparer)' : 'Grade A (Très Bon État)',
    };
  };

  const results = calculateFairPrice();

  const handleFinishListing = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    if (onListDevice) {
      onListDevice({
        id: `mkt-${Date.now()}`,
        title: `${brand} ${model}`,
        category,
        brand,
        model,
        priceRWF: results.fairPriceRWF,
        originalPriceRWF: results.newPriceRef,
        discountPercent: Math.round((1 - results.fairPriceRWF / results.newPriceRef) * 100),
        conditionGrade: results.grade,
        batteryHealth,
        storage: '128 Go',
        color: 'Noir / Sidéral',
        warrantyMonths: 6,
        images: [
          'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=600&auto=format&fit=crop&q=80',
        ],
        sellerType: 'verified_citizen',
        sellerName: 'Patrick H. (Auto-Diagnostiqué)',
        sellerRating: 5.0,
        neighborhood: 'Remera, Kigali',
        features: ['Vérifié par Algorithme Gira-Tech', 'Batterie ' + batteryHealth + '%', '100% Débloqué'],
        diagnosticReport: {
          screen: screenCondition === 'perfect' ? '100% Impeccable' : screenCondition === 'cracked' ? 'Micro-rayures' : 'Remplacé OEM',
          battery: batteryHealth > 85 ? 'Excellente capacité' : 'Originale vérifiée',
          camera: camerasWorking ? '100% Fonctionnelle' : 'Objectifs testés',
          motherboard: 'Tests bench validés',
          security: 'iCloud/Google clean',
        },
        inStock: true,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-[28px] bg-slate-950/80 border border-white/15 backdrop-blur-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/15 text-white">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                {t('diag_modal_title')}
              </h3>
              <p className="text-xs text-slate-300">
                {t('diag_modal_sub')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6 max-h-[72vh] overflow-y-auto relative z-10">
          
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2.5">
                  {t('device_to_diag')}
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCategory('smartphone')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 text-xs backdrop-blur-md ${
                      category === 'smartphone'
                        ? 'bg-white/20 border-white/40 text-white font-bold shadow-lg shadow-white/5'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-indigo-400" />
                    <span>{t('cat_smartphone')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('laptop')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 text-xs backdrop-blur-md ${
                      category === 'laptop'
                        ? 'bg-white/20 border-white/40 text-white font-bold shadow-lg shadow-white/5'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <Laptop className="w-5 h-5 text-indigo-400" />
                    <span>{t('cat_laptop')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('tablet')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 text-xs backdrop-blur-md ${
                      category === 'tablet'
                        ? 'bg-white/20 border-white/40 text-white font-bold shadow-lg shadow-white/5'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <Tablet className="w-5 h-5 text-indigo-400" />
                    <span>{t('cat_tablet')}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">{t('brand_label', 'Marque :')}</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-white/30 backdrop-blur-md"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">{t('model_label', 'Modèle exact :')}</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-white/30 backdrop-blur-md"
                  />
                </div>
              </div>

              {/* Questionnaire */}
              <div className="space-y-3.5 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    {t('screen_condition_label')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setScreenCondition('perfect')}
                      className={`p-2.5 rounded-xl border text-xs text-center transition backdrop-blur-md ${
                        screenCondition === 'perfect'
                          ? 'bg-white/20 border-white/40 text-white font-bold'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {t('screen_perfect')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setScreenCondition('micro_scratches')}
                      className={`p-2.5 rounded-xl border text-xs text-center transition backdrop-blur-md ${
                        screenCondition === 'micro_scratches'
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-200 font-bold'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {t('screen_micro')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setScreenCondition('cracked')}
                      className={`p-2.5 rounded-xl border text-xs text-center transition backdrop-blur-md ${
                        screenCondition === 'cracked'
                          ? 'bg-rose-500/20 border-rose-500/40 text-rose-200 font-bold'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {t('screen_cracked_opt')}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span>{t('battery_health_label')}</span>
                    <span className="font-mono-code text-indigo-400 font-bold">{batteryHealth}%</span>
                  </div>
                  <input
                    type="range"
                    min="65"
                    max="100"
                    value={batteryHealth}
                    onChange={(e) => setBatteryHealth(Number(e.target.value))}
                    className="w-full accent-white bg-white/10 rounded-lg cursor-pointer h-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">{t('faceid_label')}</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFaceIdWorking(true)}
                        className={`py-2 rounded-xl border text-xs font-medium transition backdrop-blur-md ${
                          faceIdWorking ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold' : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        ✓ {t('yes_label', 'Marche')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFaceIdWorking(false)}
                        className={`py-2 rounded-xl border text-xs font-medium transition backdrop-blur-md ${
                          !faceIdWorking ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 font-bold' : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        ✗ {t('no_label', 'HS')}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">{t('camera_label')}</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setCamerasWorking(true)}
                        className={`py-2 rounded-xl border text-xs font-medium transition backdrop-blur-md ${
                          camerasWorking ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold' : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        ✓ 100% OK
                      </button>
                      <button
                        type="button"
                        onClick={() => setCamerasWorking(false)}
                        className={`py-2 rounded-xl border text-xs font-medium transition backdrop-blur-md ${
                          !camerasWorking ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 font-bold' : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                      >
                        ✗ {t('no_label', 'Cassé')}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    {t('icloud_label')}
                  </label>
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between text-xs backdrop-blur-md">
                    <span className="text-slate-300">{t('icloud_clean_desc', "L'appareil sera réinitialisé et déconnecté de tout compte")}</span>
                    <button
                      type="button"
                      onClick={() => setIcloudClean(!icloudClean)}
                      className={`px-3 py-1.5 rounded-full font-bold text-xs transition ${
                        icloudClean ? 'bg-white text-slate-950 shadow-md' : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {icloudClean ? '✓ 100% Clean' : 'Non Clean'}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3.5 bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 mt-5 shadow-xl shadow-white/10 active:scale-95"
              >
                <span>{t('calc_fair_price_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              
              <div className="bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/15 space-y-4 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    {t('diag_result_title')}
                  </span>
                  <span className="text-xs font-bold bg-white/10 text-white px-2.5 py-0.5 rounded-full border border-white/15">
                    {results.grade}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-slate-400">{t('fair_price_label')}</span>
                  <div className="text-3xl font-black text-white font-mono-code">
                    {results.fairPriceRWF.toLocaleString('fr-FR')} RWF
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {t('new_price_ref')} ~{results.newPriceRef.toLocaleString('fr-FR')} RWF.
                  </p>
                </div>

                <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between text-xs backdrop-blur-md">
                  <div>
                    <span className="text-white font-semibold block">{t('instant_cash_option')}</span>
                    <span className="text-[11px] text-slate-400">{t('instant_cash_desc')}</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-400 font-mono-code">
                    {results.instantBuyoutOfferRWF.toLocaleString('fr-FR')} RWF
                  </div>
                </div>
              </div>

              {/* Protection features */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t('auto_diag_guarantee_1', 'Votre annonce aura le badge "Auto-Diagnostic Certifié Gira-Tech"')}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t('auto_diag_guarantee_2', 'Paiement sécurisé par Séquestre MTN MoMo (zéro arnaque)')}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t('auto_diag_guarantee_3', 'Coursier moto Gira-Tech disponible pour la livraison sécurisée')}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-2xl text-xs transition border border-white/10"
                >
                  {t('edit_btn', 'Modifier')}
                </button>
                <button
                  type="button"
                  id="publish-diagnostic-listing-btn"
                  onClick={handleFinishListing}
                  className="flex-1 py-3 bg-white hover:bg-slate-100 text-slate-950 font-black rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-white/10 active:scale-95"
                >
                  <Tag className="w-4 h-4 font-bold" />
                  <span>{t('publish_marketplace_btn')}</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
