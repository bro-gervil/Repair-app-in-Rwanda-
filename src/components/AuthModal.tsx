import React, { useState } from 'react';
import { 
  X, 
  User, 
  Wrench, 
  SmartphoneNfc, 
  ShieldCheck, 
  Lock, 
  Phone, 
  MapPin, 
  Building2, 
  Bike, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RegisteredUser } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  initialRole?: 'client' | 'technician';
  registeredUsers: RegisteredUser[];
  onAuthSuccess: (user: RegisteredUser, isNewRegistration: boolean) => void;
}

const KIGALI_NEIGHBORHOODS = [
  'Remera (Stade Amahoro / Giporoso)',
  'Kacyiru (Zone Ambassades / Norrsken)',
  'Nyarugenge (Downtown / City Center)',
  'Kimironko (Marché / Prison Road)',
  'Gikondo (Zone Industrielle)',
  'Nyamirambo (Biryogo / Cosmos)',
  'Kicukiro (Centre / Sonatubes)',
  'Kagugu / Gisozi',
  'Kiyovu (Haut / Bas)',
  'Kanombe (Aéroport)',
];

const TECH_SPECIALTIES = [
  'Écrans OLED & Vitres',
  'MacBook Logic Board',
  'Micro-Soudure CMS',
  'Batteries OEM',
  'Désoxydation / Chute Eau',
  'Connecteurs USB-C',
  'FaceID / TouchID',
  'PC Laptops (Dell/HP/Lenovo)',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  initialRole = 'client',
  registeredUsers,
  onAuthSuccess,
}) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<'client' | 'technician'>(initialRole);

  // Client form fields
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNeighborhood, setClientNeighborhood] = useState(KIGALI_NEIGHBORHOODS[0]);
  const [clientPin, setClientPin] = useState('');

  // Technician form fields
  const [techName, setTechName] = useState('');
  const [techWorkshop, setTechWorkshop] = useState('');
  const [techPhone, setTechPhone] = useState('');
  const [techNeighborhood, setTechNeighborhood] = useState(KIGALI_NEIGHBORHOODS[0]);
  const [techPlate, setTechPlate] = useState('');
  const [techSpecialties, setTechSpecialties] = useState<string[]>(['Écrans OLED & Vitres', 'Batteries OEM']);
  const [techPin, setTechPin] = useState('');

  // Login form fields
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Synchronize initial state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setRole(initialRole);
      setErrorMessage('');
    }
  }, [isOpen, initialMode, initialRole]);

  if (!isOpen) return null;

  const toggleSpecialty = (item: string) => {
    if (techSpecialties.includes(item)) {
      if (techSpecialties.length > 1) {
        setTechSpecialties(techSpecialties.filter((s) => s !== item));
      }
    } else {
      setTechSpecialties([...techSpecialties, item]);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (role === 'client') {
      if (!clientName.trim() || !clientPhone.trim() || !clientPin.trim()) {
        setErrorMessage(t('auth_err_required'));
        return;
      }

      const newUser: RegisteredUser = {
        id: `user-client-${Date.now()}`,
        role: 'client',
        name: clientName.trim(),
        phone: clientPhone.trim(),
        neighborhood: clientNeighborhood,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString().split('T')[0],
      };

      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}

      onAuthSuccess(newUser, true);
      onClose();
    } else {
      // Technician registration
      if (!techName.trim() || !techWorkshop.trim() || !techPhone.trim() || !techPin.trim() || !techPlate.trim()) {
        setErrorMessage(t('auth_err_required'));
        return;
      }

      const newTechUser: RegisteredUser = {
        id: `tech-${Date.now()}`,
        role: 'technician',
        name: techName.trim(),
        phone: techPhone.trim(),
        neighborhood: techNeighborhood,
        workshopName: techWorkshop.trim(),
        vehiclePlate: techPlate.trim(),
        specialties: techSpecialties,
        subscriptionPlan: 'Pro Kigali',
        rating: 5.0,
        reviewsCount: 1,
        certifiedBadge: true,
        activeWatermarkCode: `GIRA-KGL-${Math.floor(1000 + Math.random() * 9000)}-VERIFIED`,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString().split('T')[0],
      };

      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}

      onAuthSuccess(newTechUser, true);
      onClose();
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const query = loginPhone.trim().toLowerCase();
    if (!query) {
      setErrorMessage(t('auth_err_phone'));
      return;
    }

    // Match against registered users or role
    const matched = registeredUsers.find((u) => {
      const cleanPhone = u.phone.replace(/\s+/g, '');
      const cleanQuery = query.replace(/\s+/g, '');
      return (
        u.role === role &&
        (cleanPhone.includes(cleanQuery) ||
         u.name.toLowerCase().includes(query) ||
         (u.workshopName && u.workshopName.toLowerCase().includes(query)))
      );
    });

    if (matched) {
      try {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      } catch (e) {}
      onAuthSuccess(matched, false);
      onClose();
    } else {
      // Fallback create/sign in with entered identifier for smooth prototyping
      const fallbackUser: RegisteredUser = {
        id: `user-${role}-${Date.now()}`,
        role,
        name: role === 'client' ? query : `Atelier ${query}`,
        phone: query.startsWith('+') ? query : `+250 788 ${Math.floor(100000 + Math.random() * 900000)}`,
        neighborhood: KIGALI_NEIGHBORHOODS[0],
        workshopName: role === 'technician' ? `${query} Lab` : undefined,
        vehiclePlate: role === 'technician' ? 'RAD 418 K' : undefined,
        specialties: role === 'technician' ? ['Écrans OLED & Vitres', 'Batteries OEM'] : undefined,
        subscriptionPlan: 'Pro Kigali',
        certifiedBadge: true,
        activeWatermarkCode: `GIRA-KGL-${Math.floor(1000 + Math.random() * 9000)}-ACTIVE`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      onAuthSuccess(fallbackUser, false);
      onClose();
    }
  };

  const handleQuickDemoLogin = (targetUser: RegisteredUser) => {
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } catch (e) {}
    onAuthSuccess(targetUser, false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-slate-900/95 border border-white/15 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl shadow-black/80 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Mode Switching Tabs */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                {mode === 'login' ? t('auth_modal_title_login') : t('auth_modal_title_register')}
              </h2>
              <p className="text-xs text-slate-300">
                {t('auth_modal_subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Tab Switcher: Se Connecter vs S'inscrire */}
        <div className="px-4 sm:px-6 pt-4 pb-2">
          <div className="grid grid-cols-2 p-1 bg-white/5 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 ${
                mode === 'login'
                  ? 'bg-white text-slate-950 shadow-md shadow-white/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t('tab_login')}</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMessage(''); }}
              className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 ${
                mode === 'register'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('tab_register')}</span>
            </button>
          </div>
        </div>

        {/* Role Selector: Client vs Technicien */}
        <div className="px-4 sm:px-6 py-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            {t('choose_role_label')}
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => { setRole('client'); setErrorMessage(''); }}
              className={`p-3 rounded-2xl border text-left transition flex items-start gap-2.5 ${
                role === 'client'
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-white ring-1 ring-emerald-500/30'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                role === 'client' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-white/10 text-slate-300'
              }`}>
                <SmartphoneNfc className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs sm:text-sm block text-white truncate">
                  {t('i_am_client')}
                </span>
                <span className="text-[10px] text-slate-300 line-clamp-1 block">
                  {t('client_desc_short')}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setRole('technician'); setErrorMessage(''); }}
              className={`p-3 rounded-2xl border text-left transition flex items-start gap-2.5 ${
                role === 'technician'
                  ? 'bg-indigo-500/15 border-indigo-500/50 text-white ring-1 ring-indigo-500/30'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                role === 'technician' ? 'bg-indigo-500 text-white font-bold' : 'bg-white/10 text-slate-300'
              }`}>
                <Wrench className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs sm:text-sm block text-white truncate">
                  {t('i_am_tech')}
                </span>
                <span className="text-[10px] text-slate-300 line-clamp-1 block">
                  {t('tech_desc_short')}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/40 rounded-2xl text-xs text-rose-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0"></span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* MODE: REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {role === 'client' ? (
                /* CLIENT REGISTRATION FORM */
                <>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {t('full_name')} *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="ex: Patrick Habimana"
                        className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {t('phone_momo')} *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+250 788 123 456"
                        className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono-code"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {t('momo_notice')}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {t('kigali_neighborhood')}
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={clientNeighborhood}
                        onChange={(e) => setClientNeighborhood(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 appearance-none"
                      >
                        {KIGALI_NEIGHBORHOODS.map((nh) => (
                          <option key={nh} value={nh}>
                            {nh}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {t('secret_pin')} *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={clientPin}
                        onChange={(e) => setClientPin(e.target.value)}
                        placeholder="••••"
                        maxLength={6}
                        className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono-code"
                      />
                    </div>
                  </div>

                  {/* Trust badge guarantee */}
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-start gap-2.5 text-xs text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {t('client_trust_guarantee')}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    <span>{t('btn_create_client_acc')}</span>
                    <ArrowRight className="w-4 h-4 font-bold" />
                  </button>
                </>
              ) : (
                /* TECHNICIAN REGISTRATION FORM */
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        {t('full_name')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={techName}
                        onChange={(e) => setTechName(e.target.value)}
                        placeholder="ex: Olivier Mugisha"
                        className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        {t('workshop_name')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={techWorkshop}
                        onChange={(e) => setTechWorkshop(e.target.value)}
                        placeholder="ex: Kigali Precision Lab"
                        className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        {t('phone_momo')} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={techPhone}
                        onChange={(e) => setTechPhone(e.target.value)}
                        placeholder="+250 788 412 890"
                        className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono-code"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1">
                        <Bike className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{t('courier_plate')} *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={techPlate}
                        onChange={(e) => setTechPlate(e.target.value)}
                        placeholder="ex: RAD 418 K (Moto)"
                        className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono-code uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {t('kigali_neighborhood')}
                    </label>
                    <select
                      value={techNeighborhood}
                      onChange={(e) => setTechNeighborhood(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      {KIGALI_NEIGHBORHOODS.map((nh) => (
                        <option key={nh} value={nh}>
                          {nh}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      {t('specialties_label')} :
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {TECH_SPECIALTIES.map((spec) => {
                        const selected = techSpecialties.includes(spec);
                        return (
                          <button
                            type="button"
                            key={spec}
                            onClick={() => toggleSpecialty(spec)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition border flex items-center gap-1 ${
                              selected
                                ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 font-bold'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {selected && <Check className="w-3 h-3 text-indigo-400" />}
                            <span>{spec}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      {t('secret_pin')} *
                    </label>
                    <input
                      type="password"
                      required
                      value={techPin}
                      onChange={(e) => setTechPin(e.target.value)}
                      placeholder="••••"
                      maxLength={6}
                      className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono-code"
                    />
                  </div>

                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/25 rounded-2xl flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>
                      {t('tech_certification_pledge')}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95"
                  >
                    <span>{t('btn_create_tech_acc')}</span>
                    <ArrowRight className="w-4 h-4 font-bold" />
                  </button>
                </>
              )}
            </form>
          )}

          {/* MODE: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {role === 'client' ? t('phone_or_name_client') : t('phone_or_workshop_tech')} *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder={role === 'client' ? '+250 788 654 321' : '+250 788 412 890'}
                    className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono-code"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    {t('secret_pin')} *
                  </label>
                  <span className="text-[10px] text-slate-400">{t('pin_digits_hint')}</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    placeholder="••••"
                    maxLength={6}
                    className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono-code"
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 font-bold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 active:scale-95 shadow-lg ${
                  role === 'client'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                    : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-500/20'
                }`}
              >
                <span>{t('btn_login_action')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Fast 1-Click Demo Accounts */}
              <div className="pt-3 border-t border-white/10">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-2.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('demo_quick_login')}</span>
                </div>

                <div className="space-y-1.5">
                  {registeredUsers
                    .filter((u) => u.role === role)
                    .map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleQuickDemoLogin(user)}
                        className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-full object-cover border border-white/20"
                          />
                          <div>
                            <span className="font-bold text-xs text-white block group-hover:text-emerald-300">
                              {user.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {user.workshopName ? `${user.workshopName} • ` : ''}{user.phone}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          {t('auth_demo_click')}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-white/5 border-t border-white/10 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t('auth_footer_security')}</span>
        </div>
      </div>
    </div>
  );
};
