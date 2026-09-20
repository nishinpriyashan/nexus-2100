import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Circle, MapPin, Clock, Accessibility } from "lucide-react";
import { useJourneyStore } from "../../store/journeyStore";

function getStatusSymbol(status) {
  switch (status) {
    case "completed": return "Completed";
    case "active": return "Active";
    case "transfer": return "Transfer";
    case "end": return "Destination";
    default: return "Upcoming";
  }
}

export default function RouteTimeline({ route }) {
  const navigate = useNavigate();
  const { passport, aiApplied } = useJourneyStore();
  const themeColor = aiApplied ? "text-ai-violet" : "text-primary-cyan";
  const bgColor = aiApplied ? "bg-ai-violet" : "bg-primary-cyan";
  const borderColor = aiApplied ? "border-ai-violet" : "border-primary-cyan";
  const glowClass = aiApplied
    ? "shadow-[0_0_15px_rgba(139,92,255,0.4)]"
    : "shadow-[0_0_15px_rgba(57,231,255,0.4)]";
  const ctaBg = aiApplied ? "bg-ai-violet hover:bg-ai-violet/90" : "bg-primary-cyan hover:bg-primary-cyan/90";

  return (
    <div
      className="bg-surface/30 backdrop-blur-md border border-surface rounded-2xl p-5 md:p-6 h-full flex flex-col"
      role="region"
      aria-label="Route timeline"
    >
      <h3 className="text-xs font-bold text-secondary-text tracking-widest uppercase mb-5">
        Route Timeline
      </h3>

      <ol
        className="relative flex-1 py-2 flex flex-col gap-6"
        role="list"
        aria-label={`Journey from ${route.nodes[0]?.mode} to ${route.nodes[route.nodes.length - 1]?.platform || "Destination"}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={route.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-6 relative z-10"
          >
            {route.nodes.map((node, index) => {
              const isLast = index === route.nodes.length - 1;
              const isCompleted = node.status === "completed";
              const isActive = node.status === "active";
              const isTransfer = node.status === "transfer";
              const isEnd = node.status === "end";

              return (
                <li key={index} className="flex items-start gap-4 group" role="listitem">
                  {/* Timeline indicator column */}
                  <div className="relative flex flex-col items-center shrink-0 w-5">
                    {/* Node icon */}
                    <div className={`w-5 h-5 rounded-full border-2 bg-background flex items-center justify-center z-10 transition-all ${
                      isCompleted ? `${borderColor}` :
                      isActive ? `${borderColor} ring-2 ring-offset-2 ring-offset-background ring-current/30` :
                      isEnd ? "border-success" :
                      isTransfer ? "border-warning" :
                      "border-secondary-text/40"
                    }`}>
                      {isCompleted && <CheckCircle2 className={`w-3 h-3 ${themeColor}`} />}
                      {isActive && <div className={`w-1.5 h-1.5 rounded-full ${bgColor} animate-pulse`} />}
                      {isEnd && <MapPin className="w-3 h-3 text-success" />}
                      {isTransfer && <Circle className="w-2 h-2 text-warning fill-warning" />}
                    </div>
                    {/* Connecting line */}
                    {!isLast && (
                      <div className="absolute top-5 w-0.5 bg-surface/60 z-0" style={{ height: "calc(100% + 16px)" }}>
                        {!["pending"].includes(node.status) && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "100%" }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className={`w-full ${isCompleted ? bgColor : "bg-surface"}`}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Node content */}
                  <div className="flex flex-col gap-0.5 pb-2 min-w-0">
                    {/* Time + status */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`font-mono text-base font-bold leading-none ${
                        isActive ? themeColor : isEnd ? "text-success" : "text-primary-text"
                      }`}>
                        {node.time}
                      </span>
                      {/* Screen-reader only status label */}
                      <span className="sr-only">{getStatusSymbol(node.status)}</span>
                      {node.duration && (
                        <span className="flex items-center gap-1 text-[10px] text-secondary-text">
                          <Clock className="w-3 h-3" />
                          {node.duration}
                        </span>
                      )}
                    </div>

                    {/* Mode name */}
                    <span className={`text-sm font-semibold leading-tight ${
                      node.status === "pending" ? "text-secondary-text" : "text-primary-text"
                    }`}>
                      {node.mode}
                    </span>

                    {/* Platform / Gate */}
                    {node.platform && (
                      <span className="text-[11px] text-secondary-text/80 font-mono tracking-wider">
                        {node.platform}
                      </span>
                    )}

                    {/* Description / accessibility note */}
                    {node.description && (
                      <span className="text-[11px] text-secondary-text leading-snug mt-0.5 max-w-[220px]">
                        {node.description}
                      </span>
                    )}

                    {/* Step-free badge */}
                    {passport.mobility.stepFree && node.description?.toLowerCase().includes("step-free") && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-success font-semibold mt-1">
                        <Accessibility className="w-3 h-3" />
                        Step-Free Verified
                      </span>
                    )}

                    {/* Transfer badge */}
                    {isTransfer && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-warning/10 border border-warning/20 rounded-full text-[10px] text-warning font-semibold mt-1 w-fit">
                        Transfer Point
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </ol>

      {/* Bottom CTA bar */}
      <div className="mt-6 flex items-center justify-between pt-5 border-t border-surface/50 gap-4 flex-wrap">
        <div className="flex flex-col">
          <span className="text-[10px] text-secondary-text tracking-widest uppercase mb-1">Arrival</span>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={route.arrival}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`text-2xl font-bold font-mono ${themeColor}`}
            >
              {route.arrival}
            </motion.span>
          </AnimatePresence>
          {aiApplied && (
            <span className="text-[10px] text-ai-violet mt-0.5 font-semibold">
              AI Optimized — 8 min saved
            </span>
          )}
        </div>

        <button
          onClick={() => navigate("/tracking")}
          id="start-journey-btn"
          className={`px-6 py-3 ${ctaBg} text-background font-bold tracking-widest text-sm rounded-xl transition-all ${glowClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary-cyan`}
          aria-label="Start Journey — proceed to live tracking"
        >
          START JOURNEY →
        </button>
      </div>
    </div>
  );
}
