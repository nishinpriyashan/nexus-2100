import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, ArrowUpDown, Rocket } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useJourneyStore } from '../../store/journeyStore';
import AIAnalysisSequence from '../ai/AIAnalysisSequence';
import TransportFareSelector from './TransportFareSelector';

export default function JourneySearch() {
  const [from, setFrom] = useState('Colombo Fort Station');
  const [to, setTo] = useState('Kandy Central Hub');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFareSelector, setShowFareSelector] = useState(false);

  const navigate = useNavigate();
  const setActiveJourney = useJourneyStore((state) => state.setActiveJourney);
  const setJourneyStatus = useJourneyStore((state) => state.setJourneyStatus);

  const SRI_LANKA_PRESETS = [
    { name: "Kandy Central Hub", from: "Colombo Fort Station" },
    { name: "Galle Fort Coast", from: "Colombo Fort Station" },
    { name: "Jaffna Terminal", from: "Colombo Fort Station" },
    { name: "Negombo Airport", from: "Colombo Fort Station" },
    { name: "Nuwara Eliya Hill", from: "Kandy Central Hub" }
  ];

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!to.trim()) return;

    setActiveJourney({ from, to });
    setShowFareSelector(true);
  };

  return (
    <div className="relative mt-6 space-y-6">
      <AnimatePresence>
        {isAnalyzing && <AIAnalysisSequence />}
      </AnimatePresence>

      {/* ── Search Bar Form ── */}
      <div className="bg-surface/80 backdrop-blur-xl border border-surface/90 rounded-2xl p-6 shadow-2xl space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div className="relative">
            <label htmlFor="from" className="sr-only">From</label>
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <MapPin className="w-5 h-5 text-primary-cyan" />
            </div>
            <input
              id="from"
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full bg-background/60 border border-surface/80 rounded-xl py-3 pl-12 pr-4 text-primary-text focus:outline-none focus:ring-1 focus:ring-primary-cyan focus:border-primary-cyan transition-all text-sm font-semibold"
              placeholder="Origin Station"
              required
            />
          </div>

          <div className="relative flex justify-center -my-3 z-10">
            <button
              type="button"
              onClick={handleSwap}
              className="bg-surface border border-surface/80 p-2 rounded-full text-secondary-text hover:text-primary-cyan hover:border-primary-cyan/50 transition-all cursor-pointer"
              aria-label="Swap locations"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <label htmlFor="to" className="sr-only">To</label>
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Navigation className="w-5 h-5 text-ai-violet" />
            </div>
            <input
              id="to"
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-background/60 border border-surface/80 rounded-xl py-3 pl-12 pr-4 text-primary-text focus:outline-none focus:ring-1 focus:ring-ai-violet focus:border-ai-violet transition-all text-sm font-semibold"
              placeholder="Destination Station"
              required
            />
          </div>

          {/* Preset Sri Lanka Station Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-secondary-text font-mono uppercase tracking-widest mr-1">Real Sri Lanka Destinations:</span>
            {SRI_LANKA_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  setFrom(preset.from);
                  setTo(preset.name);
                  setActiveJourney({ from: preset.from, to: preset.name });
                  setShowFareSelector(true);
                }}
                className="px-2.5 py-1 bg-surface/60 hover:bg-primary-cyan/20 text-secondary-text hover:text-primary-cyan border border-surface/80 rounded-full text-[10px] font-mono transition-all cursor-pointer"
              >
                {preset.name}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="mt-2 w-full py-3.5 bg-gradient-to-r from-primary-cyan via-ai-violet to-primary-cyan hover:opacity-95 text-background font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <Rocket className="w-4 h-4" />
            <span>Select Vehicle Tier & Prices</span>
          </button>
        </form>
      </div>

      {/* ── Uber-Style Vehicle Price & Transport Option Selector ── */}
      {showFareSelector && (
        <div className="animate-fadeIn">
          <TransportFareSelector />
        </div>
      )}
    </div>
  );
}
