import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Settings2, Zap, Accessibility, Leaf, Layout, Eye, Monitor, Moon, Sun } from "lucide-react";
import { useJourneyStore } from "../../store/journeyStore";
import { useTheme } from "../../hooks/useTheme";

export default function NexusPassport({ isOpen, onClose }) {
  const { passport, updatePassport } = useJourneyStore();
  const { theme, setTheme } = useTheme();

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Panel (Bottom sheet on mobile, side panel on desktop) */}
        <motion.div
          initial={{ y: "100%", x: 0 }}
          animate={{ y: 0, x: 0 }}
          exit={{ y: "100%", x: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full h-[85vh] mt-auto md:mt-0 md:h-full md:w-96 bg-surface border-t md:border-t-0 md:border-l border-surface shadow-2xl flex flex-col rounded-t-3xl md:rounded-none overflow-hidden"
          role="dialog"
          aria-label="NEXUS Passport Preferences"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-surface/50 bg-background/50">
            <div className="flex items-center gap-3">
              <Settings2 className="w-5 h-5 text-primary-cyan" />
              <div>
                <h2 className="text-sm font-bold text-primary-cyan tracking-widest uppercase">
                  NEXUS Passport
                </h2>
                <p className="text-[10px] text-secondary-text uppercase tracking-wider">
                  Local Preferences Profile
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-secondary-text hover:text-primary-text hover:bg-surface rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-cyan"
              aria-label="Close Passport"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Journey Priority */}
            <section>
              <h3 className="text-[11px] font-bold text-secondary-text tracking-widest uppercase mb-4">
                Journey Priority
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <OptionButton
                  icon={Zap}
                  label="Fastest"
                  active={passport.journeyPriority === "fastest"}
                  onClick={() => updatePassport({ journeyPriority: "fastest" })}
                />
                <OptionButton
                  icon={Accessibility}
                  label="Accessible"
                  active={passport.journeyPriority === "accessible"}
                  onClick={() => updatePassport({ journeyPriority: "accessible" })}
                />
                <OptionButton
                  icon={Leaf}
                  label="Eco"
                  active={passport.journeyPriority === "eco"}
                  onClick={() => updatePassport({ journeyPriority: "eco" })}
                />
              </div>
            </section>

            <div className="h-px bg-surface/50" />

            {/* Experience */}
            <section>
              <h3 className="text-[11px] font-bold text-secondary-text tracking-widest uppercase mb-4">
                Experience
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <OptionButton
                  icon={Layout}
                  label="Standard"
                  active={passport.experience === "standard"}
                  onClick={() => updatePassport({ experience: "standard" })}
                />
                <OptionButton
                  icon={Eye}
                  label="Simplified"
                  active={passport.experience === "simplified"}
                  onClick={() => updatePassport({ experience: "simplified" })}
                />
              </div>
            </section>

            <div className="h-px bg-surface/50" />

            {/* Mobility Requirements */}
            <section>
              <h3 className="text-[11px] font-bold text-secondary-text tracking-widest uppercase mb-4">
                Mobility Requirements
              </h3>
              <div className="space-y-2">
                <ToggleRow
                  label="Step-Free Access"
                  description="Prioritize lifts and low-floor boarding"
                  active={passport.mobility.stepFree}
                  onClick={() => updatePassport({ mobility: { stepFree: !passport.mobility.stepFree } })}
                />
                <ToggleRow
                  label="Reduced Motion"
                  description="Minimize 3D and UI animations"
                  active={passport.mobility.reducedMotion}
                  onClick={() => updatePassport({ mobility: { reducedMotion: !passport.mobility.reducedMotion } })}
                />
                <ToggleRow
                  label="Visual Assistance"
                  description="Increase contrast and font legibility"
                  active={passport.mobility.visualAssistance}
                  onClick={() => updatePassport({ mobility: { visualAssistance: !passport.mobility.visualAssistance } })}
                />
              </div>
            </section>

            <div className="h-px bg-surface/50" />

            {/* Appearance */}
            <section>
              <h3 className="text-[11px] font-bold text-secondary-text tracking-widest uppercase mb-4">
                Appearance
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <OptionButton
                  icon={Moon}
                  label="Dark"
                  active={theme === "dark"}
                  onClick={() => setTheme("dark")}
                />
                <OptionButton
                  icon={Sun}
                  label="Light"
                  active={theme === "light"}
                  onClick={() => setTheme("light")}
                />
                <OptionButton
                  icon={Monitor}
                  label="System"
                  active={theme === "system"}
                  onClick={() => setTheme("system")}
                />
              </div>
            </section>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function OptionButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-cyan ${
        active
          ? "bg-primary-cyan/10 border-primary-cyan/50 text-primary-cyan"
          : "bg-surface/30 border-surface/50 text-secondary-text hover:text-primary-text hover:bg-surface/60"
      }`}
      aria-pressed={active}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-bold tracking-widest uppercase">{label}</span>
    </button>
  );
}

function ToggleRow({ label, description, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 rounded-xl border border-surface/50 bg-surface/30 hover:bg-surface/60 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-cyan"
      aria-pressed={active}
    >
      <div>
        <div className={`text-sm font-bold ${active ? 'text-primary-cyan' : 'text-primary-text'}`}>{label}</div>
        <div className="text-[10px] text-secondary-text mt-0.5">{description}</div>
      </div>
      <div className={`w-10 h-5 rounded-full flex items-center p-0.5 transition-colors ${active ? 'bg-primary-cyan' : 'bg-surface/80'}`}>
        <div className={`w-4 h-4 bg-background rounded-full shadow-sm transform transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </button>
  );
}
