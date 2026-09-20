import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, ShieldAlert, Activity, CheckCircle2 } from 'lucide-react';
import { useJourneyStore } from '../../store/journeyStore';

export default function NexusLiveMonitor({ route, onAiTriggered, aiWarningActive }) {
  const { applyAiRoute, aiApplied } = useJourneyStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [debugClicks, setDebugClicks] = useState(0);

  // Hidden trigger mechanism: 3 clicks on the monitor title triggers the alert
  const handleDebugTrigger = () => {
    if (aiApplied || aiWarningActive) return;
    setDebugClicks(c => c + 1);
    if (debugClicks >= 2) {
      onAiTriggered();
    }
  };

  const handleApply = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      applyAiRoute();
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="bg-surface/30 backdrop-blur-md border border-surface rounded-2xl overflow-hidden flex flex-col relative">
      {/* Header */}
      <div 
        className="bg-surface/40 p-4 border-b border-surface flex items-center justify-between cursor-default"
        onClick={handleDebugTrigger}
      >
        <div className="flex items-center gap-2">
          <Cpu className={`w-4 h-4 ${aiApplied ? 'text-success-green' : 'text-ai-violet'}`} />
          <h3 className="text-[10px] font-bold text-secondary-text tracking-widest uppercase">Nexus Predictive AI</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${aiApplied ? 'bg-success-green' : 'bg-ai-violet'} animate-pulse`} />
          <span className="text-[9px] text-secondary-text uppercase tracking-widest">Network Monitoring</span>
        </div>
      </div>

      <div className="p-4 flex flex-col relative overflow-hidden min-h-[160px]">
        <AnimatePresence mode="wait">
          
          {/* Normal Status */}
          {!aiWarningActive && !aiApplied && (
            <motion.div
              key="normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs text-secondary-text uppercase">Network Status</span>
                <span className="text-xs font-bold text-success-green">OPTIMAL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-secondary-text uppercase">Confidence</span>
                <span className="text-xs font-bold text-primary-text">{route.confidence}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-secondary-text uppercase">Traffic Vector</span>
                <span className="text-xs font-bold text-primary-text">CLEAR</span>
              </div>
              <div className="mt-2 text-[10px] text-center text-secondary-text/50">
                (Click header 3x to simulate disruption)
              </div>
            </motion.div>
          )}

          {/* Warning State */}
          {aiWarningActive && !aiApplied && (
            <motion.div
              key="warning"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col h-full"
            >
              <div className="flex items-start gap-3 mb-4">
                <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wide mb-1">Predictive Alert</h4>
                  <p className="text-[11px] text-secondary-text leading-tight">Congestion probability increased at Mobility Node A17.</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 bg-ai-violet/10 p-2 rounded border border-ai-violet/20">
                <span className="text-[10px] text-ai-violet uppercase tracking-wider">Time Saved</span>
                <span className="text-xs font-bold text-ai-violet">8 MIN</span>
              </div>

              <button
                onClick={handleApply}
                disabled={isAnalyzing}
                className="w-full py-2 bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border border-amber-500/50 font-bold tracking-widest rounded transition-all text-xs flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <><Activity className="w-3 h-3 animate-pulse" /> RECALCULATING VECTORS</>
                ) : (
                  "ACCEPT AI REROUTE"
                )}
              </button>
            </motion.div>
          )}

          {/* Resolved/Applied State */}
          {aiApplied && (
            <motion.div
              key="applied"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-center py-2"
            >
              <CheckCircle2 className="w-8 h-8 text-success-green mb-2" />
              <h4 className="text-sm font-bold text-success-green uppercase tracking-wide mb-1">Route Synchronized</h4>
              <p className="text-[11px] text-secondary-text">NEXUS successfully bypassed congestion.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
