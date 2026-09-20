import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Wifi,
  Accessibility,
  MapPin,
  Car,
} from "lucide-react";
import { useJourneyStore } from "../../store/journeyStore";

const MONITORING_ITEMS = [
  { id: "vehicle", label: "Vehicle Systems", icon: Car, normalStatus: "Nominal" },
  { id: "connections", label: "Connections", icon: Wifi, normalStatus: "All Clear" },
  { id: "network", label: "Network Status", icon: Cpu, normalStatus: "Online" },
  { id: "accessibility", label: "Accessibility", icon: Accessibility, normalStatus: "Verified" },
  { id: "destination", label: "Destination", icon: MapPin, normalStatus: "On Track" },
];

export default function JourneyGuardian() {
  const { passport, aiApplied, aiDisruption, triggerAiDisruption, applyAiRoute } = useJourneyStore();

  const [showDisruptionAlert, setShowDisruptionAlert] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Show disruption alert after aiDisruption triggers
  useEffect(() => {
    if (aiDisruption && !aiApplied && !dismissed) {
      const timer = setTimeout(() => setShowDisruptionAlert(true), 600);
      return () => clearTimeout(timer);
    }
  }, [aiDisruption, aiApplied, dismissed]);


  // Compute health based on state
  let health = 100;
  if (aiApplied) {
    health = 99;
  } else if (aiDisruption && !dismissed) {
    health = 72;
  } else if (dismissed) {
    health = 88;
  }

  const handleAccept = () => {
    setIsApplying(true);
    setTimeout(() => {
      applyAiRoute();
      setIsApplying(false);
    }, 1200);
  };

  const handleKeep = () => {
    setDismissed(true);
    setShowDisruptionAlert(false);
  };

  const healthColor = health >= 90 ? "text-success" : health >= 70 ? "text-warning" : "text-red-400";
  const healthBg = health >= 90 ? "bg-success" : health >= 70 ? "bg-warning" : "bg-red-400";

  return (
    <div
      className="bg-surface/30 backdrop-blur-md border border-surface rounded-2xl overflow-hidden"
      role="region"
      aria-label="NEXUS Journey Guardian — monitoring your journey"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-surface/60 bg-surface/20">
        <div className="flex items-center gap-2">
          <Shield className={`w-4 h-4 ${aiDisruption && !aiApplied ? "text-warning" : "text-success"}`} />
          <span className="text-xs font-bold tracking-widest uppercase text-primary-text">
            Journey Guardian
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-bold font-mono ${healthColor}`}>
            {health}%
          </span>
          <div className="w-16 h-1.5 bg-surface rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${healthBg} rounded-full`}
              animate={{ width: `${health}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Monitoring Checklist */}
      <div className="px-5 py-3 space-y-2">
        {MONITORING_ITEMS.map((item) => {
          const Icon = item.icon;
          const isDisrupted = item.id === "network" && aiDisruption && !aiApplied && !dismissed;
          const isConnectionsAffected = item.id === "connections" && aiDisruption && !aiApplied && !dismissed;
          const isAccessEnabled = item.id === "accessibility" && passport.mobility.stepFree;

          return (
            <div key={item.id} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${
                  isDisrupted || isConnectionsAffected ? "text-warning" : "text-secondary-text"
                }`} />
                <span className="text-xs text-secondary-text">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {isDisrupted ? (
                  <span className="text-[10px] font-semibold text-warning">CONGESTION</span>
                ) : isConnectionsAffected ? (
                  <span className="text-[10px] font-semibold text-warning">REROUTING</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-success" />
                    <span className="text-[10px] text-success font-medium">
                      {isAccessEnabled && item.id === "accessibility" ? "Step-Free" : item.normalStatus}
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Disruption Alert */}
      <AnimatePresence>
        {showDisruptionAlert && !aiApplied && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mx-3 mb-3 p-4 bg-warning/10 border border-warning/30 rounded-xl"
            role="alert"
            aria-live="assertive"
          >
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-warning mb-1">DISRUPTION DETECTED</div>
                <p className="text-[11px] text-secondary-text leading-snug">
                  Congestion at Node A17. NEXUS AI has found an alternative route via AeroLink Alpha — saving <strong className="text-primary-text">8 minutes</strong>.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAccept}
                disabled={isApplying}
                className="flex-1 py-2 text-xs font-bold tracking-widest bg-ai-violet text-white rounded-lg hover:bg-ai-violet/90 transition-all disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai-violet"
                aria-label="Accept AI alternative route"
              >
                {isApplying ? "APPLYING..." : "ACCEPT"}
              </button>
              <button
                onClick={handleKeep}
                className="flex-1 py-2 text-xs font-bold tracking-widest border border-surface/80 text-secondary-text rounded-lg hover:text-primary-text hover:bg-surface/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-cyan"
                aria-label="Keep original route"
              >
                KEEP ROUTE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Applied confirmation */}
      <AnimatePresence>
        {aiApplied && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-3 mb-3 p-3 bg-success/10 border border-success/30 rounded-xl flex items-center gap-3"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
            <span className="text-[11px] text-success font-semibold">
              AI Route Active — 8 min ahead of schedule
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo trigger — clearly labeled */}
      {!aiDisruption && !aiApplied && (
        <div className="px-4 pb-4">
          <button
            onClick={triggerAiDisruption}
            className="w-full py-2 text-[10px] font-bold tracking-widest uppercase border border-dashed border-secondary-text/30 text-secondary-text/50 hover:text-secondary-text hover:border-secondary-text/50 rounded-lg transition-all"
            aria-label="Demo: simulate a network disruption"
          >
            ⚡ Simulate Disruption (Demo)
          </button>
        </div>
      )}
    </div>
  );
}
