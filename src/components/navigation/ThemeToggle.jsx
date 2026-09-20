import { Sun, Moon, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../hooks/useTheme";

const THEMES = [
  { id: "system", Icon: Monitor, label: "System" },
  { id: "light", Icon: Sun, label: "Light" },
  { id: "dark", Icon: Moon, label: "Dark" },
];

export default function ThemeToggle({ compact = false }) {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const idx = THEMES.findIndex((t) => t.id === theme);
    const next = THEMES[(idx + 1) % THEMES.length];
    setTheme(next.id);
  };

  const current = THEMES.find((t) => t.id === theme) || THEMES[0];
  const Icon = current.Icon;

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-surface/50 bg-surface/30 hover:bg-surface/50 hover:border-primary-cyan/30 text-secondary-text hover:text-primary-cyan transition-all duration-200 group"
      aria-label={`Theme: ${current.label}. Click to cycle.`}
      title={`Theme: ${current.label}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 20, scale: 0.8 }}
          transition={{ duration: 0.15 }}
        >
          <Icon className="w-4 h-4" />
        </motion.div>
      </AnimatePresence>
      {!compact && (
        <span className="text-[10px] font-semibold tracking-widest uppercase hidden sm:block">
          {current.label}
        </span>
      )}
    </button>
  );
}
