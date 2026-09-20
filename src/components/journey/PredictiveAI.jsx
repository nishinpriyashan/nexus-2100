import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Cpu, Activity, Clock } from 'lucide-react';
import { useJourneyStore } from '../../store/journeyStore';

export default function PredictiveAI() {
  const { aiDisruption, applyAiRoute, aiApplied } = useJourneyStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Simulate AI detecting a disruption shortly after mount
  useEffect(() => {
    if (aiDisruption && !aiApplied) {
      const timer = setTimeout(() => setShowWarning(true), 2500);
      return () => clearTimeout(timer);
    }
  }, [aiDisruption, aiApplied]);

  const handleApply = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      applyAiRoute();
      setIsAnalyzing(false);
      setShowWarning(false);
    }, 1500);
  };

  return (
    <div className="bg-surface/20 border border-surface rounded-2xl overflow-hidden flex flex-col h-full relative">
      {/* Header */}
      <div className="bg-surface/40 p-4 border-b border-surface flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-ai-violet" />
          <h3 className="text-xs font-bold text-ai-violet tracking-widest uppercase">Nexus Predictive Engine</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-ai-violet animate-pulse" />
          <span className="text-[10px] text-secondary-text uppercase tracking-widest">Network Monitoring</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!showWarning && !aiApplied && (
            <motion.div
              key="monitoring"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center text-secondary-text space-y-4"
            >
              <Activity className="w-12 h-12 text-surface opacity-50" />
              <p className="text-sm">Monitoring route conditions across Ground, Rail, and Aerial networks.</p>
              <p className="font-mono text-xs text-primary-cyan/40">12:08:14 SYSTEM NOMINAL</p>
            </motion.div>
          )}

          {showWarning && !aiApplied && (
            <motion.div
              key="warning"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <ShieldAlert className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-amber-500 font-bold mb-1">Potential congestion detected</h4>
                    <p className="text-sm text-secondary-text">at Mobility Node A17.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-surface/30 rounded border border-surface">
                    <div className="text-[10px] text-secondary-text uppercase tracking-wider mb-1">Current Arrival</div>
                    <div className="font-mono text-xl text-primary-text">08:31</div>
                  </div>
                  <div className="p-3 bg-ai-violet/10 rounded border border-ai-violet/20">
                    <div className="text-[10px] text-ai-violet uppercase tracking-wider mb-1">AI Alternative</div>
                    <div className="font-mono text-xl text-ai-violet">08:23</div>
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-lg font-bold text-success-green bg-success-green/10 px-4 py-1 rounded-full border border-success-green/20">
                    8 MIN SAVED
                  </span>
                </div>
              </div>

              <button
                onClick={handleApply}
                disabled={isAnalyzing}
                className="w-full mt-6 py-4 bg-ai-violet text-white font-bold tracking-widest rounded transition-all hover:bg-ai-violet/90 relative overflow-hidden group"
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Activity className="w-5 h-5 animate-pulse" />
                    ANALYZING VECTORS...
                  </span>
                ) : (
                  <span className="relative z-10">APPLY AI ROUTE</span>
                )}
                {!isAnalyzing && (
                  <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                )}
              </button>
            </motion.div>
          )}

          {aiApplied && (
            <motion.div
              key="applied"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-success-green/20 border border-success-green/40 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-2 border-success-green border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
                <Clock className="w-8 h-8 text-success-green" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-primary-text mb-2">Route Synchronized</h4>
                <p className="text-sm text-secondary-text">Journey updated dynamically via predictive intelligence.</p>
              </div>
              <div className="p-3 bg-ai-violet/10 rounded-lg border border-ai-violet/20 text-ai-violet text-sm font-mono flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                Confidence 99.8%
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative scanning line */}
      <motion.div 
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 4, ease: "linear", repeat: Infinity }}
        className="absolute left-0 right-0 h-0.5 bg-ai-violet/20 opacity-50 z-0 pointer-events-none blur-[1px]" 
      />
    </div>
  );
}
