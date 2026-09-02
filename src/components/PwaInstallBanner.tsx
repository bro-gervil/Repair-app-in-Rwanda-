import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Download, Smartphone, Apple, X, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const PwaInstallBanner: React.FC = () => {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Register service worker if available
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Check if already standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Show Android / iOS instructions
      setShowIosGuide(true);
    }
  };

  if (isDismissed || isInstalled) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-b border-emerald-500/30 px-4 py-2.5 text-xs text-slate-200 flex items-center justify-between shadow-md relative z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white">{t('pwa_banner_title')}</span>{' '}
            <span className="text-slate-300 hidden sm:inline">
              {t('pwa_banner_desc')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg transition flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('install_app_btn')}</span>
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-slate-400 hover:text-white rounded-md transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Guide modal for iOS / Android manual add */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                {t('pwa_ready')}
              </h3>
              <button
                onClick={() => setShowIosGuide(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <strong className="text-emerald-400 flex items-center gap-1.5">
                  <Apple className="w-4 h-4" /> {t('ios_guide_title')}
                </strong>
                <p>{t('ios_guide_step1')}</p>
                <p>{t('ios_guide_step2')}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <strong className="text-emerald-400 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" /> {t('android_guide_title')}
                </strong>
                <p>{t('android_guide_step1')}</p>
                <p>{t('android_guide_step2')}</p>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs transition"
            >
              {t('close_continue_btn', 'Compris !')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
