import React, { useState } from 'react';
import { MarketplaceItem, DeviceCategory } from '../types';
import { 
  Home,
  ShoppingBag, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Filter, 
  Search, 
  BatteryCharging, 
  Award, 
  MapPin, 
  Tag, 
  Plus, 
  X,
  CreditCard,
  Layers,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../i18n/LanguageContext';

interface MarketplaceViewProps {
  items: MarketplaceItem[];
  onOpenDiagnosticModal: () => void;
  onBuyItem: (item: MarketplaceItem) => void;
  onReturnHome?: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  items,
  onOpenDiagnosticModal,
  onBuyItem,
  onReturnHome,
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [showBuySuccessModal, setShowBuySuccessModal] = useState<boolean>(false);

  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleExecutePurchase = (item: MarketplaceItem) => {
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (e) {}
    onBuyItem(item);
    setSelectedItem(null);
    setShowBuySuccessModal(true);
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
          <span className="text-amber-300 font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
            {t('tab_marketplace')}
          </span>
        </div>
      )}
      
      {/* Hero Banner for Marketplace */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-[28px] relative overflow-hidden shadow-2xl">
        <div className="absolute right-[-80px] top-[-80px] w-80 h-80 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute left-[30%] bottom-[-50px] w-60 h-60 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/15 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/30">
                {t('mkt_hero_badge')}
              </span>
              <span className="text-xs text-slate-400">• {t('warranty_pill')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
              {t('mkt_hero_title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {t('mkt_hero_desc')}
            </p>
          </div>

          <button
            id="start-auto-diagnostic-btn"
            onClick={onOpenDiagnosticModal}
            className="shrink-0 bg-white hover:bg-slate-100 text-slate-950 font-bold px-6 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-white/10 hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-5 h-5 font-bold text-indigo-600" />
            <span>{t('btn_sell_device')}</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/5 backdrop-blur-xl p-3 sm:p-4 rounded-2xl border border-white/10 shadow-xl">
        
        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search_placeholder')}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-400 focus:bg-white/10 transition backdrop-blur-md"
          />
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: t('cat_all') },
            { id: 'smartphone', label: t('cat_smartphones') },
            { id: 'laptop', label: t('cat_laptops') },
            { id: 'tablet', label: t('cat_tablets') },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition shrink-0 border ${
                selectedCategory === cat.id
                  ? 'bg-white text-slate-950 font-bold border-white shadow-md shadow-white/10'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-white/20 backdrop-blur-xl rounded-[28px] overflow-hidden shadow-2xl transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              {/* Product Image & Badges */}
              <div className="aspect-4/3 relative overflow-hidden bg-slate-950/60 flex items-center justify-center p-2">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-[20px]"
                />
                
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="bg-white text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
                    {item.conditionGrade}
                  </span>
                  <span className="bg-slate-950/80 backdrop-blur-md text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    {t('warranty_prefix')} {item.warrantyMonths} {t('months_unit')}
                  </span>
                </div>

                {item.discountPercent > 0 && (
                  <div className="absolute top-3 right-3 bg-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">
                    -{item.discountPercent}% {t('vs_new')}
                  </div>
                )}

                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-slate-200 flex items-center gap-1">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                    {t('battery_label')} : <strong className="text-emerald-300">{item.batteryHealth}%</strong>
                  </span>
                  <span className="text-slate-300 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {item.neighborhood}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 space-y-3">
                <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-emerald-300 transition">
                  {item.title}
                </h3>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-white font-mono-code">
                    {item.priceRWF.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-emerald-400">RWF</span>
                  </span>
                  {item.originalPriceRWF > item.priceRWF && (
                    <span className="text-xs text-slate-400 line-through font-mono-code">
                      {item.originalPriceRWF.toLocaleString('fr-FR')} RWF
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.features.slice(0, 2).map((f, i) => (
                    <span key={i} className="text-[10px] bg-white/5 text-slate-300 px-2.5 py-1 rounded-full border border-white/5 backdrop-blur-md">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-5 pt-0">
              <button
                onClick={() => setSelectedItem(item)}
                className="w-full py-3 bg-white/5 hover:bg-white text-slate-200 hover:text-slate-950 font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 border border-white/10 hover:border-white shadow-md active:scale-95"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t('btn_view_report_buy')}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Inspection & Checkout Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-[28px] bg-slate-950/90 border border-white/20 backdrop-blur-2xl shadow-2xl overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  {selectedItem.conditionGrade} • {t('certified_badge')}
                </span>
                <h3 className="text-lg font-bold text-white font-display mt-1.5">
                  {selectedItem.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="aspect-square rounded-2xl overflow-hidden bg-slate-950/60 border border-white/10 p-2">
                  <img
                    src={selectedItem.images[0]}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                <div className="space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-2xl font-black text-white font-mono-code">
                      {selectedItem.priceRWF.toLocaleString('fr-FR')} <span className="text-sm font-normal text-emerald-400">RWF</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {t('seller_label')} : <strong className="text-white">{selectedItem.sellerName}</strong> ({selectedItem.neighborhood})
                    </p>
                    <div className="text-xs text-slate-300 space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                      <div>{t('storage_label')} : <strong>{selectedItem.storage}</strong></div>
                      <div>{t('color_label')} : <strong>{selectedItem.color}</strong></div>
                      <div>{t('battery_label')} : <strong className="text-emerald-300">{selectedItem.batteryHealth}%</strong></div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-xs text-slate-300 leading-relaxed backdrop-blur-md">
                    🛡️ <strong>{t('escrow_return_title')} :</strong> {t('escrow_return_desc')}
                  </div>
                </div>
              </div>

              {/* 5-Point Technical Diagnostic Report */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  {t('diag_report_heading')} :
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between backdrop-blur-md">
                    <span className="text-slate-400">1. {t('diag_screen')} :</span>
                    <span className="font-bold text-emerald-300">{selectedItem.diagnosticReport.screen}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between backdrop-blur-md">
                    <span className="text-slate-400">2. {t('diag_battery')} :</span>
                    <span className="font-bold text-emerald-300">{selectedItem.diagnosticReport.battery}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between backdrop-blur-md">
                    <span className="text-slate-400">3. {t('diag_camera')} :</span>
                    <span className="font-bold text-emerald-300">{selectedItem.diagnosticReport.camera}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between backdrop-blur-md">
                    <span className="text-slate-400">4. {t('diag_motherboard')} :</span>
                    <span className="font-bold text-emerald-300">{selectedItem.diagnosticReport.motherboard}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between sm:col-span-2 backdrop-blur-md">
                    <span className="text-slate-400">5. {t('diag_security')} :</span>
                    <span className="font-bold text-emerald-300">{selectedItem.diagnosticReport.security}</span>
                  </div>
                </div>
              </div>

              {/* Purchase Button */}
              <button
                onClick={() => handleExecutePurchase(selectedItem)}
                className="w-full py-3.5 bg-white hover:bg-slate-100 text-slate-950 font-black rounded-2xl text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-white/10 active:scale-95"
              >
                <CreditCard className="w-4 h-4 text-slate-950" />
                <span>{t('btn_buy_momo')} ({selectedItem.priceRWF.toLocaleString('fr-FR')} RWF)</span>
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Success purchase toast */}
      {showBuySuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-950/90 border border-emerald-500/40 backdrop-blur-2xl p-7 rounded-[28px] max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white font-display">{t('order_secured_title')}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t('order_secured_desc')}
            </p>
            <button
              onClick={() => setShowBuySuccessModal(false)}
              className="w-full py-3 bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-2xl text-xs transition shadow-lg shadow-white/10"
            >
              {t('close_btn')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

