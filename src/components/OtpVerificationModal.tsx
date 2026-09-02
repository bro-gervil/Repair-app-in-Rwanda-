import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  ShieldCheck, 
  QrCode, 
  KeyRound, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  Copy, 
  Check,
  Bike,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  otpCode: string;
  qrToken: string;
  orderNumber: string;
  technicianName: string;
  onSimulateTechnicianScan?: () => void;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  onClose,
  otpCode,
  qrToken,
  orderNumber,
  technicianName,
  onSimulateTechnicianScan,
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(otpCode).catch(() => {});
      }
    } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateScan = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {}
      if (onSimulateTechnicianScan) {
        onSimulateTechnicianScan();
      }
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-[28px] bg-slate-950/80 border border-white/15 backdrop-blur-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/15 text-white">
              <KeyRound className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                {t('otp_modal_title')}
              </h3>
              <p className="text-xs text-slate-300">{t('order_label')} {orderNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 text-center space-y-5 relative z-10">
          
          <div className="space-y-1">
            <p className="text-xs text-slate-300">
              {t('otp_instruction')} (<strong className="text-white">{technicianName}</strong>)
            </p>
          </div>

          {/* Big OTP 4-Digit Display */}
          <div className="bg-white/5 p-5 rounded-2xl border border-white/15 relative group backdrop-blur-md">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2.5">
              {t('secret_code_title')}
            </span>
            
            <div className="flex items-center justify-center gap-3">
              {otpCode.split('').map((digit, i) => (
                <div
                  key={i}
                  className="w-14 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl font-black text-white font-mono-code shadow-lg backdrop-blur-md"
                >
                  {digit}
                </div>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="mt-3.5 inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">{t('code_copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t('copy_code')}</span>
                </>
              )}
            </button>
          </div>

          {/* QR Code Representation */}
          <div className="bg-white p-4 rounded-2xl w-44 h-44 mx-auto flex flex-col items-center justify-center shadow-xl relative border border-white/20">
            <QrCode className="w-32 h-32 text-slate-950" />
            <span className="text-[10px] font-bold text-slate-700 tracking-tight font-mono-code">
              {qrToken.slice(0, 16)}...
            </span>
          </div>

          {/* Protocol info */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-left flex items-start gap-3 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">{t('zero_risk_title')} </strong> {t('zero_risk_desc')}
            </p>
          </div>

          {/* Interactive Simulation Button (For previewing Pro interaction) */}
          <div className="pt-1">
            <button
              id="simulate-otp-scan-btn"
              onClick={handleSimulateScan}
              disabled={isVerifying}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-xl shadow-white/10 active:scale-95 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  <span>{t('crypto_verifying')}</span>
                </>
              ) : (
                <>
                  <Bike className="w-4 h-4 text-slate-950" />
                  <span>{t('simulate_tech_otp_btn')}</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
