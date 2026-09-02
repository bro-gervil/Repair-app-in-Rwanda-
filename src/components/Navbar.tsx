import React, { useState } from 'react';
import { AppRole, RegisteredUser } from '../types';
import { 
  Home,
  Wrench, 
  ShoppingBag, 
  Recycle, 
  ShieldCheck, 
  Smartphone, 
  UserCheck, 
  Building2, 
  QrCode,
  Sparkles,
  SmartphoneNfc,
  Languages,
  ChevronDown,
  User,
  LogIn,
  UserPlus,
  LogOut,
  MapPin,
  Bike
} from 'lucide-react';
import { useLanguage, Language } from '../i18n/LanguageContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeRole: AppRole;
  setActiveRole: (role: AppRole) => void;
  giraPoints: number;
  activeOrdersCount: number;
  isMobileDeviceFrame: boolean;
  setIsMobileDeviceFrame: (val: boolean) => void;
  currentUser: RegisteredUser | null;
  onOpenAuthModal: (mode?: 'login' | 'register', role?: 'client' | 'technician') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  activeRole,
  setActiveRole,
  giraPoints,
  activeOrdersCount,
  isMobileDeviceFrame,
  setIsMobileDeviceFrame,
  currentUser,
  onOpenAuthModal,
  onLogout,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const languagesList: { code: Language; label: string; flag: string }[] = [
    { code: 'rw', label: 'Ikinyarwanda', flag: '🇷🇼' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  const currentLangObj = languagesList.find((l) => l.code === language) || languagesList[0];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/60 backdrop-blur-2xl border-b border-white/10 text-slate-100 transition-all">
      {/* Top Banner / Quick Role Switcher Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-400 font-medium hidden sm:inline">{t('network_tag')}</span>
          <span className="text-emerald-300 font-semibold bg-white/5 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            {t('security_pill')}
          </span>
        </div>

        <div className="flex items-center gap-2.5 ml-auto">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              id="language-selector-btn"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold text-xs bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all shadow-sm"
              title={t('change_language')}
            >
              <span className="text-sm">{currentLangObj.flag}</span>
              <span className="hidden xs:inline">{currentLangObj.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {langMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setLangMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-slate-950/95 border border-white/20 shadow-2xl backdrop-blur-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-white/10 mb-1">
                    {t('change_language')}
                  </div>
                  {languagesList.map((item) => (
                    <button
                      key={item.code}
                      id={`lang-select-${item.code}`}
                      onClick={() => {
                        setLanguage(item.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition ${
                        language === item.code
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{item.flag}</span>
                        <span>{item.label}</span>
                      </div>
                      {language === item.code && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Mobile frame toggle for testing iOS / Android experience */}
          <button
            id="toggle-device-frame-btn"
            onClick={() => setIsMobileDeviceFrame(!isMobileDeviceFrame)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium text-xs transition-all backdrop-blur-md border ${
              isMobileDeviceFrame 
                ? 'bg-white text-slate-950 font-semibold border-white shadow-md shadow-white/10' 
                : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border-white/10'
            }`}
            title={t('navbar_toggle_mobile_view')}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isMobileDeviceFrame ? t('mobile_view') : t('full_view')}</span>
          </button>

          {/* Role selector with frosted glass container */}
          <div className="flex items-center bg-white/5 backdrop-blur-md p-0.5 sm:p-1 rounded-full border border-white/10">
            <button
              id="role-client-btn"
              onClick={() => setActiveRole('client')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs transition-all ${
                activeRole === 'client'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <SmartphoneNfc className="w-3.5 h-3.5" />
              <span>{t('role_client')}</span>
            </button>
            <button
              id="role-technician-btn"
              onClick={() => setActiveRole('technician')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs transition-all ${
                activeRole === 'technician'
                  ? 'bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{t('role_tech')}</span>
            </button>
            <button
              id="role-recycler-btn"
              onClick={() => setActiveRole('recycler')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs transition-all ${
                activeRole === 'recycler'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{t('role_recycler')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div 
          id="app-logo-home-btn"
          onClick={() => {
            setActiveRole('client');
            setCurrentTab('home');
          }} 
          className="flex items-center gap-3 cursor-pointer select-none group"
          title={t('back_to_home')}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform border border-white/20">
            <Wrench className="w-5 h-5 text-slate-950 font-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-display">Gira-Tech</span>
              <span className="text-[10px] font-bold bg-white/10 text-emerald-300 border border-white/15 px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md">Kigali</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5">{t('app_tagline')}</p>
          </div>
        </div>

        {/* Navigation Tabs (Client) with Frosted Pill bar */}
        {activeRole === 'client' ? (
          <nav className="hidden md:flex items-center gap-1.5 bg-white/5 backdrop-blur-xl p-1.5 rounded-full border border-white/10 shadow-lg shadow-black/20">
            <button
              id="tab-home-btn"
              onClick={() => setCurrentTab('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                currentTab === 'home'
                  ? 'bg-white text-slate-950 shadow-md shadow-white/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t('tab_home')}</span>
            </button>

            <button
              id="tab-repairs-btn"
              onClick={() => setCurrentTab('repairs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all relative ${
                currentTab === 'repairs'
                  ? 'bg-white text-slate-950 shadow-md shadow-white/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{t('tab_repairs')}</span>
              {activeOrdersCount > 0 && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full animate-bounce">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            <button
              id="tab-marketplace-btn"
              onClick={() => setCurrentTab('marketplace')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                currentTab === 'marketplace'
                  ? 'bg-white text-slate-950 shadow-md shadow-white/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t('tab_marketplace')}</span>
            </button>

            <button
              id="tab-recycling-btn"
              onClick={() => setCurrentTab('recycling')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                currentTab === 'recycling'
                  ? 'bg-white text-slate-950 shadow-md shadow-white/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Recycle className="w-3.5 h-3.5" />
              <span>{t('tab_recycling')}</span>
            </button>

            <button
              id="tab-security-btn"
              onClick={() => setCurrentTab('security')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                currentTab === 'security'
                  ? 'bg-white text-slate-950 shadow-md shadow-white/10'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('tab_security')}</span>
            </button>
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <button
              id="nav-return-home-btn"
              onClick={() => {
                setActiveRole('client');
                setCurrentTab('home');
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-emerald-300 border border-emerald-500/30 transition shadow-md"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t('back_to_home')}</span>
            </button>
          </div>
        )}

        {/* Right Info: Eco-Wallet points badge & User Profile/Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div 
            onClick={() => {
              if (activeRole === 'client') setCurrentTab('recycling');
            }}
            className="flex items-center gap-2 sm:gap-2.5 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl cursor-pointer transition-all shadow-md group"
            title={t('gira_points')}
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-gradient-to-tr from-emerald-500/30 to-teal-400/30 border border-emerald-400/30 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-semibold tracking-wider leading-none">{t('gira_points')}</div>
              <div className="text-xs sm:text-sm font-bold text-white leading-tight font-mono-code">{giraPoints} {t('points_unit')}</div>
            </div>
          </div>

          {/* User Auth Section */}
          {currentUser ? (
            <div className="relative">
              <button
                id="user-profile-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/15 px-2.5 sm:px-3 py-1.5 rounded-2xl transition-all shadow-md group"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-white/20"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-[9px] font-bold px-1 rounded ${
                      currentUser.role === 'client'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-indigo-500/20 text-indigo-300'
                    }`}>
                      {currentUser.role === 'client' ? t('role_client') : t('role_tech')}
                    </span>
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setUserMenuOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-3 shadow-2xl z-50 animate-fadeIn">
                    {/* User profile header card */}
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 mb-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border border-white/20"
                        />
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white truncate">{currentUser.name}</h4>
                          <p className="text-[11px] text-slate-400 truncate">{currentUser.phone}</p>
                          {currentUser.workshopName && (
                            <p className="text-[10px] text-indigo-300 font-semibold truncate flex items-center gap-1 mt-0.5">
                              <Wrench className="w-2.5 h-2.5" />
                              {currentUser.workshopName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1 truncate max-w-[170px]">
                          <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{currentUser.neighborhood}</span>
                        </span>
                        {currentUser.vehiclePlate && (
                          <span className="text-indigo-400 font-mono-code font-bold truncate max-w-[80px]">
                            {currentUser.vehiclePlate.split(' ')[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Switch Role */}
                    <div className="space-y-1 mb-2">
                      <button
                        onClick={() => {
                          const targetRole = currentUser.role === 'client' ? 'technician' : 'client';
                          setActiveRole(targetRole);
                          if (targetRole === 'client') setCurrentTab('repairs');
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white flex items-center justify-between transition"
                      >
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-emerald-400" />
                          <span>
                            {currentUser.role === 'client' 
                              ? t('switch_to_tech_view') 
                              : t('switch_to_client_view')}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">→</span>
                      </button>

                      <button
                        onClick={() => {
                          onOpenAuthModal('login');
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white flex items-center gap-2 transition"
                      >
                        <LogIn className="w-4 h-4 text-sky-400" />
                        <span>{t('switch_account')}</span>
                      </button>

                      <button
                        onClick={() => {
                          onOpenAuthModal('register');
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white flex items-center gap-2 transition"
                      >
                        <UserPlus className="w-4 h-4 text-emerald-400" />
                        <span>{t('tab_register')}</span>
                      </button>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <button
                        onClick={() => {
                          onLogout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-500/15 flex items-center gap-2 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('logout_btn')}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                id="login-header-btn"
                onClick={() => onOpenAuthModal('login')}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('sign_in')}</span>
              </button>
              <button
                id="register-header-btn"
                onClick={() => onOpenAuthModal('register')}
                className="px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5 active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t('sign_up')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Tab Bar for Compact Screens */}
      {activeRole === 'client' ? (
        <div className="md:hidden flex items-center justify-around bg-slate-950/80 backdrop-blur-2xl border-t border-white/10 px-2 py-2.5">
          <button
            id="mobile-tab-home-btn"
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-xs font-medium transition-colors ${
              currentTab === 'home' ? 'text-emerald-400 font-bold bg-white/5' : 'text-slate-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>{t('tab_home')}</span>
          </button>
          <button
            id="mobile-tab-repairs-btn"
            onClick={() => setCurrentTab('repairs')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-xs font-medium transition-colors relative ${
              currentTab === 'repairs' ? 'text-emerald-400 font-bold bg-white/5' : 'text-slate-400'
            }`}
          >
            <Wrench className="w-5 h-5" />
            <span>{t('tab_repairs_short')}</span>
            {activeOrdersCount > 0 && (
              <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            )}
          </button>
          <button
            id="mobile-tab-marketplace-btn"
            onClick={() => setCurrentTab('marketplace')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-xs font-medium transition-colors ${
              currentTab === 'marketplace' ? 'text-emerald-400 font-bold bg-white/5' : 'text-slate-400'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{t('tab_marketplace_short')}</span>
          </button>
          <button
            id="mobile-tab-recycling-btn"
            onClick={() => setCurrentTab('recycling')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-xs font-medium transition-colors ${
              currentTab === 'recycling' ? 'text-emerald-400 font-bold bg-white/5' : 'text-slate-400'
            }`}
          >
            <Recycle className="w-5 h-5" />
            <span>{t('tab_recycling_short')}</span>
          </button>
          <button
            id="mobile-tab-security-btn"
            onClick={() => setCurrentTab('security')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-xs font-medium transition-colors ${
              currentTab === 'security' ? 'text-emerald-400 font-bold bg-white/5' : 'text-slate-400'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span>{t('tab_security_short')}</span>
          </button>
        </div>
      ) : (
        <div className="md:hidden flex items-center justify-between bg-slate-900/90 backdrop-blur-2xl border-t border-white/10 px-4 py-2.5">
          <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t('role_mode_prefix')} {activeRole === 'technician' ? t('role_tech') : t('role_recycler')}</span>
          </span>
          <button
            onClick={() => {
              setActiveRole('client');
              setCurrentTab('home');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 shadow-md"
          >
            <Home className="w-4 h-4" />
            <span>{t('back_to_home')}</span>
          </button>
        </div>
      )}
    </header>
  );
};

