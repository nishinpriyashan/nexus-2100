import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

const STAGES = [
  { text: "SCANNING GROUND NETWORK", delay: 0 },
  { text: "ANALYZING RAIL ROUTES", delay: 0.5 },
  { text: "CHECKING AERIAL PATHS", delay: 1.0 },
  { text: "VERIFYING CONNECTIONS", delay: 1.5 },
  { text: "COMPUTING AI OPTIMIZATION", delay: 2.0 },
  { text: "FINALIZING ROUTE DATA", delay: 2.5 },
];

function AnalysisStage({ text, delay }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), (delay + 0.6) * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="flex items-center gap-3 text-sm"
    >
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="done"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
          </motion.div>
        ) : (
          <motion.div key="pending">
            <Circle className="w-4 h-4 text-secondary-text/40 shrink-0" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className={`tracking-wide transition-colors duration-300 ${done ? "text-primary-text" : "text-secondary-text"}`}>
        {text}
      </span>
    </motion.div>
  );
}

export default function AIAnalysisSequence() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/85 backdrop-blur-xl rounded-2xl border border-primary-cyan/20 overflow-hidden"
      role="status"
      aria-label="NEXUS is analyzing the mobility network"
      aria-live="polite"
    >
      {/* Scan line animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-cyan/40 to-transparent"
          animate={{ y: ["0%", "100%", "0%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="text-[10px] font-bold text-ai-violet tracking-[0.35em] mb-2 uppercase">
          Nexus Intelligence
        </div>
        <div className="text-lg font-semibold text-primary-cyan tracking-wider" style={{ fontFamily: "Space Grotesk, Inter, sans-serif" }}>
          ANALYZING MOBILITY NETWORK
        </div>
        <div className="text-xs text-secondary-text mt-1">Processing real-time network data...</div>
      </div>

      {/* Stages */}
      <div className="flex flex-col gap-3 w-52 mb-8 relative z-10">
        {STAGES.map((stage) => (
          <AnalysisStage key={stage.text} text={stage.text} delay={stage.delay} />
        ))}
      </div>

      {/* Spinner */}
      <div className="flex items-center gap-3 relative z-10">
        <Loader2 className="w-5 h-5 text-ai-violet animate-spin" />
        <span className="text-xs text-secondary-text tracking-widest uppercase">Computing optimal path</span>
      </div>
    </motion.div>
  );
}
