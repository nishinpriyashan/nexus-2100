import { motion, AnimatePresence } from "motion/react";
import { Cpu, CheckCircle2, Activity } from "lucide-react";
import { useJourneyStore } from "../../store/journeyStore";

/**
 * NEXUS Live Monitor — compact network status panel.
 * Disruption triggering is now handled by JourneyGuardian.
 */
export default function NexusLiveMonitor({ route }) {
  const { aiApplied } = useJourneyStore();

  return (
    <div
      className="bg-surface/30 backdrop-blur-md border border-surface/60 rounded-2xl overflow-hidden"
      role="region"
      aria-label="NEXUS network monitor"
    >
      {/* Header */}
      <div className="bg-surface/30 px-5 py-3 border-b border-surface/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className={`w-4 h-4 ${aiApplied ? "text-success" : "text-ai-violet"}`} />
          <h3 className="text-[10px] font-bold text-secondary-text tracking-widest uppercase">
            Nexus Predictive AI
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-1.5 h-1.5 rounded-full ${aiApplied ? "bg-success" : "bg-ai-violet"}`}
          />
          <span className="text-[9px] text-secondary-text uppercase tracking-widest">
            {aiApplied ? "Route Synchronized" : "Network Monitoring"}
          </span>
        </div>
      </div>

      {/* Status rows */}
      <div className="px-5 py-3 flex flex-col gap-2">
        <AnimatePresence mode="wait">
          {!aiApplied ? (
            <motion.div
              key="monitoring"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2"
            >
              <StatusRow label="Network Status" value="OPTIMAL" valueClass="text-success" />
              <StatusRow label="Confidence" value={`${route?.confidence || 98.7}%`} />
              <StatusRow label="Traffic Vector" value="CLEAR" />
              <StatusRow label="AI Monitoring" value="ACTIVE" valueClass="text-ai-violet" />
            </motion.div>
          ) : (
            <motion.div
              key="applied"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 py-1"
            >
              <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
              <div>
                <div className="text-xs font-bold text-success">AI Route Active</div>
                <div className="text-[10px] text-secondary-text mt-0.5">
                  Node A17 bypassed via AeroLink Alpha
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animated scan line */}
      <div className="relative h-0.5 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 right-0 h-full bg-gradient-to-r from-transparent via-ai-violet/40 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}

function StatusRow({ label, value, valueClass = "text-primary-text" }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-secondary-text uppercase tracking-wider">{label}</span>
      <span className={`text-[11px] font-bold ${valueClass}`}>{value}</span>
    </div>
  );
}

function Activity2({ className }) {
  return <Activity className={className} />;
}
Activity2;
