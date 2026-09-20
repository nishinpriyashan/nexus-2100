import { useJourneyStore } from "../../store/journeyStore";
import { ArrowRight, Cpu, Activity } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { routes } from "../../data/journeyData";

export default function JourneyHeader() {
  const { activeJourney, routeType, aiApplied } = useJourneyStore();
  const from = activeJourney?.from || "Naaldwijk";
  const to = activeJourney?.to || "Amsterdam";
  const route = routes[routeType] || routes.fastest;

  return (
    <div className="mb-6 pb-5 border-b border-surface/50" role="region" aria-label="Journey summary">
      {/* Top metadata row */}
      <div className="flex items-center gap-3 text-[10px] font-mono text-secondary-text/70 tracking-widest uppercase mb-3 flex-wrap">
        <span>Journey // 8407-A</span>
        <span className="w-1 h-1 rounded-full bg-secondary-text/50" aria-hidden="true" />
        <span>Dep. {route.departure}</span>
        <span className="w-1 h-1 rounded-full bg-secondary-text/50" aria-hidden="true" />
        <span>{route.duration} min</span>
        <span className="w-1 h-1 rounded-full bg-secondary-text/50" aria-hidden="true" />

        {/* AI confidence badge */}
        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${
          aiApplied
            ? "text-ai-violet border-ai-violet/30 bg-ai-violet/10"
            : "text-primary-cyan border-primary-cyan/30 bg-primary-cyan/10"
        }`}>
          {aiApplied ? <Cpu className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
          <span>{route.confidence}% confidence</span>
        </span>
      </div>

      {/* Origin → Destination */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-[10px] text-secondary-text tracking-widest uppercase mb-0.5">From</div>
          <AnimatePresence mode="wait">
            <motion.h1
              key={from}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold tracking-tight text-primary-text"
              style={{ fontFamily: "Space Grotesk, Inter, sans-serif" }}
            >
              {from}
            </motion.h1>
          </AnimatePresence>
        </div>

        <ArrowRight
          className="w-6 h-6 md:w-8 md:h-8 text-secondary-text shrink-0"
          aria-hidden="true"
        />

        <div className="text-right">
          <div className="text-[10px] text-secondary-text tracking-widest uppercase mb-0.5">To</div>
          <AnimatePresence mode="wait">
            <motion.div
              key={to}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold tracking-tight text-primary-text"
              style={{ fontFamily: "Space Grotesk, Inter, sans-serif" }}
            >
              {to}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Arrival info */}
      <div className="flex items-end justify-between mt-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-secondary-text tracking-widest uppercase">Arrives</span>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={route.arrival}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={`text-xl font-bold font-mono ${aiApplied ? "text-ai-violet" : "text-primary-cyan"}`}
            >
              {route.arrival}
            </motion.span>
          </AnimatePresence>
        </div>

        {aiApplied && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[11px] text-success font-semibold px-3 py-1 bg-success/10 border border-success/20 rounded-full"
          >
            AI route active — 8 min saved
          </motion.span>
        )}
      </div>
    </div>
  );
}
