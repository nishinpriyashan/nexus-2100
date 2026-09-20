import { useState } from 'react';
import { CreditCard, QrCode, Wallet, Check, Sparkles, X, ShieldCheck } from 'lucide-react';
import { useJourneyStore } from '../../store/journeyStore';

/**
 * Unified Digital Wallet & Contactless QR Boarding Pass Modal (PRD B11 / B12 [P0])
 * Renders user wallet balance in LKR, digital multimodal passes,
 * and produces scannable QR ticket passes for Maglev & AeroLink legs.
 */
export default function DigitalWalletModal({ isOpen, onClose }) {
  const { activeJourney, routeType } = useJourneyStore();
  const [walletBalance, setWalletBalance] = useState(25000);
  const [activeTab, setActiveTab] = useState('qr'); // 'qr' | 'wallet'

  const from = activeJourney?.from || 'Colombo Fort Station';
  const to = activeJourney?.to || 'Kandy Central Hub';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-md bg-surface/95 border border-primary-cyan/40 rounded-3xl p-6 shadow-2xl flex flex-col space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface/80 pb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary-cyan" />
            <span className="font-bold text-base md:text-lg tracking-wide uppercase text-primary-text" style={{ fontFamily: 'Space Grotesk' }}>
              NEXUS Digital Wallet & QR Pass
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-secondary-text hover:text-primary-text hover:bg-surface transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-primary-cyan/20 via-ai-violet/20 to-primary-cyan/20 border border-primary-cyan/40 p-4 rounded-2xl flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[10px] font-mono text-secondary-text uppercase tracking-widest block">Unified Balance</span>
            <span className="text-2xl font-bold font-mono text-primary-text">
              LKR {walletBalance.toLocaleString()}
            </span>
          </div>
          <span className="px-3 py-1 bg-success/15 border border-success/30 rounded-full text-[10px] font-mono font-bold text-success flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Contactless Active
          </span>
        </div>

        {/* Tabs: QR Pass vs Wallet Options */}
        <div className="flex items-center p-1 bg-background/80 border border-surface/80 rounded-xl">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'qr' ? 'bg-primary-cyan text-background shadow' : 'text-secondary-text hover:text-primary-text'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Digital QR Ticket</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'wallet' ? 'bg-primary-cyan text-background shadow' : 'text-secondary-text hover:text-primary-text'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Passes & Top-Up</span>
          </button>
        </div>

        {/* Tab 1: Scannable Digital QR Boarding Pass */}
        {activeTab === 'qr' && (
          <div className="flex flex-col items-center space-y-4 p-4 bg-background/80 border border-surface/80 rounded-2xl text-center">
            <div className="text-xs font-bold text-primary-cyan uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Multimodal Boarding QR Pass
            </div>

            <div className="text-sm font-bold text-primary-text" style={{ fontFamily: 'Space Grotesk' }}>
              {from} ➔ {to}
            </div>

            {/* Custom SVG Scannable QR Ticket */}
            <div className="p-3 bg-white rounded-2xl shadow-2xl border-4 border-primary-cyan/40">
              <svg className="w-36 h-36" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="#FFFFFF" />
                {/* QR Finder Patterns */}
                <rect x="5" y="5" width="25" height="25" fill="#030711" />
                <rect x="9" y="9" width="17" height="17" fill="#FFFFFF" />
                <rect x="13" y="13" width="9" height="9" fill="#030711" />

                <rect x="70" y="5" width="25" height="25" fill="#030711" />
                <rect x="74" y="9" width="17" height="17" fill="#FFFFFF" />
                <rect x="78" y="13" width="9" height="9" fill="#030711" />

                <rect x="5" y="70" width="25" height="25" fill="#030711" />
                <rect x="9" y="74" width="17" height="17" fill="#FFFFFF" />
                <rect x="13" y="78" width="9" height="9" fill="#030711" />

                {/* Random QR Matrix Data Nodes */}
                <rect x="35" y="10" width="8" height="8" fill="#39E7FF" />
                <rect x="48" y="18" width="8" height="8" fill="#030711" />
                <rect x="38" y="38" width="24" height="24" fill="#8B5CFF" />
                <rect x="70" y="45" width="12" height="12" fill="#030711" />
                <rect x="10" y="42" width="10" height="10" fill="#030711" />
                <rect x="42" y="70" width="15" height="15" fill="#030711" />
                <rect x="68" y="72" width="18" height="18" fill="#39E7FF" />
              </svg>
            </div>

            <div className="text-[10px] font-mono text-secondary-text uppercase tracking-widest">
              Pass ID: <strong className="text-primary-text">NX-SL-840792</strong> · Valid for Maglev & AeroLink
            </div>
          </div>
        )}

        {/* Tab 2: Wallet Top-Up & Passes */}
        {activeTab === 'wallet' && (
          <div className="space-y-3 p-4 bg-background/80 border border-surface/80 rounded-2xl text-xs">
            <div className="text-xs font-bold text-primary-cyan uppercase tracking-widest mb-2">Quick Top-Up Balance</div>
            <div className="grid grid-cols-3 gap-2">
              {[1000, 5000, 10000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setWalletBalance((prev) => prev + amount)}
                  className="py-2 bg-surface hover:bg-primary-cyan/20 border border-surface hover:border-primary-cyan text-primary-text rounded-xl font-mono font-bold transition-all cursor-pointer"
                >
                  +LKR {amount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 bg-primary-cyan/20 hover:bg-primary-cyan/30 text-primary-cyan border border-primary-cyan/40 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
        >
          Close Wallet
        </button>
      </div>
    </div>
  );
}
