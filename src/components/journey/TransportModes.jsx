import { Car, Train, Plane, Zap } from "lucide-react";
import { motion } from "motion/react";

const MODES = [
  {
    name: "AUTONOMOUS",
    label: "Autonomous Shuttle",
    icon: Car,
    description: "Self-driving ground vehicles. Zero-emission.",
    color: "text-primary-cyan",
    delay: 0,
  },
  {
    name: "MAGLEV",
    label: "Maglev Express",
    icon: Train,
    description: "Magnetic levitation rail. Up to 500 km/h.",
    color: "text-ai-violet",
    delay: 0.05,
  },
  {
    name: "AEROLINK",
    label: "AeroLink",
    icon: Plane,
    description: "Urban aerial mobility. Autonomous VTOL.",
    color: "text-success",
    delay: 0.1,
  },
  {
    name: "SMART ROAD",
    label: "Smart Road",
    icon: Zap,
    description: "AI-managed intelligent road network.",
    color: "text-warning",
    delay: 0.15,
  },
];

export default function TransportModes() {
  return (
    <div
      className="border-t border-surface/50 pt-5 mt-2"
      role="list"
      aria-label="Available transport modes"
    >
      <div className="text-[9px] font-bold text-secondary-text tracking-[0.3em] uppercase mb-3">
        Transport Modes
      </div>
      <div className="flex gap-4 md:gap-6">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          return (
            <motion.div
              key={mode.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mode.delay, duration: 0.3 }}
              className="group relative flex flex-col items-center gap-2 cursor-default"
              role="listitem"
              title={mode.description}
            >
              <div className={`p-2 rounded-xl border border-surface/50 bg-surface/20 group-hover:bg-surface/40 group-hover:border-primary-cyan/30 transition-all duration-200 ${mode.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-semibold tracking-widest text-secondary-text group-hover:text-primary-text transition-colors uppercase">
                {mode.name}
              </span>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-36 bg-surface/90 backdrop-blur-sm border border-surface/80 rounded-lg px-3 py-2 text-[10px] text-secondary-text text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 shadow-lg">
                {mode.description}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
