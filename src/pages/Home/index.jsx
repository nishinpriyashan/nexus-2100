import { motion } from "motion/react";
import { Activity, Globe, Zap, Shield } from "lucide-react";
import JourneySearch from "../../components/journey/JourneySearch";
import TransportModes from "../../components/journey/TransportModes";
import HomeWorld from "../../scenes/environment/HomeWorld";
import AIAgentVideoModal from "../../components/ai/AIAgentVideoModal";
import { useJourneyStore } from "../../store/journeyStore";
import { useTheme } from "../../hooks/useTheme";

const STAT_ITEMS = [
  { label: "Cities Connected", value: "2,847", icon: Globe },
  { label: "Journeys/Hour", value: "4.2M", icon: Zap },
  { label: "Network Uptime", value: "99.9%", icon: Activity },
  { label: "AI Confidence", value: "98.7%", icon: Shield },
];

export default function Home() {
  const { passport } = useJourneyStore();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Simplified interface mode
  if (passport.experience === 'simplified') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12 text-center">
        <h1 className="text-4xl font-bold text-primary-text mb-4">NEXUS 2100</h1>
        <p className="text-secondary-text text-lg mb-10 max-w-sm">
          Plan your journey across the integrated mobility network.
        </p>
        <div className="w-full max-w-md">
          <JourneySearch />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[calc(100vh-80px)] flex flex-col">

      {/* ── 4-Second Delayed AI Video Avatar Overlay ── */}
      <AIAgentVideoModal />

      {/* ── DESKTOP: Full-screen Earth + Overlay layout ── */}
      <div className="hidden md:flex w-full flex-1 relative overflow-hidden">

        {/* 3D Earth (Background) */}
        <div
          className="absolute inset-0 z-0"
          aria-label="3D global mobility network visualization"
          role="img"
        >
          <HomeWorld isDark={isDark} />
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-background via-background/60 to-transparent pointer-events-none" />
        </div>

        {/* Foreground Content Panel */}
        <div className="relative z-10 w-5/12 xl:w-[42%] flex flex-col justify-center px-10 lg:px-16 xl:px-20 py-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex w-1.5 h-1.5 rounded-full bg-primary-cyan animate-pulse" />
              <span className="text-[11px] font-bold text-primary-cyan tracking-[0.3em] uppercase drop-shadow-md">
                AI Mobility Network // 2100
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter leading-[0.88] text-primary-text mb-5 drop-shadow-lg"
              style={{ fontFamily: "Space Grotesk, Inter, sans-serif" }}
            >
              ONE
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-cyan via-ai-violet to-primary-cyan bg-[length:200%] animate-[gradientShift_4s_ease-in-out_infinite]">
                INTELLIGENT
              </span>
              <br />
              NETWORK.
            </h1>

            <p className="text-secondary-text text-base lg:text-lg leading-relaxed max-w-xs mb-8 drop-shadow">
              Ground. Rail. Aerial. One predictive network that adapts to you — in real time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
            className="space-y-6"
          >
            <JourneySearch />
            <TransportModes />
          </motion.div>

          {/* Network stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="grid grid-cols-2 gap-3 mt-8"
          >
            {STAT_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 bg-background/50 backdrop-blur-md border border-surface/50 rounded-xl px-4 py-3"
                >
                  <Icon className="w-4 h-4 text-primary-cyan shrink-0" />
                  <div>
                    <div className="text-base font-bold text-primary-text leading-none">{item.value}</div>
                    <div className="text-[10px] text-secondary-text mt-0.5 tracking-wide">{item.label}</div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* ── MOBILE: Stacked layout ── */}
      <div className="flex md:hidden flex-col w-full relative">
        <div
          className="absolute inset-0 z-0 h-[60vh]"
          aria-label="3D global network globe"
          role="img"
        >
          <HomeWorld isDark={isDark} />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>

        <div className="relative z-10 w-full flex flex-col pt-[50vh]">
          <motion.div 
            className="px-5 pt-6 pb-4 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex w-1.5 h-1.5 rounded-full bg-primary-cyan animate-pulse" />
              <span className="text-[10px] font-bold text-primary-cyan tracking-[0.3em] uppercase drop-shadow-md">
                AI Mobility Network // 2100
              </span>
            </div>
            <h1
              className="text-4xl font-bold tracking-tighter leading-[0.88] text-primary-text mb-3 drop-shadow-lg"
              style={{ fontFamily: "Space Grotesk, Inter, sans-serif" }}
            >
              ONE <span className="text-primary-cyan">INTELLIGENT</span> NETWORK.
            </h1>
            <p className="text-secondary-text text-sm leading-relaxed drop-shadow">
              Ground. Rail. Aerial. One predictive network.
            </p>
          </motion.div>

          <motion.div 
            className="px-5 pb-8 space-y-5 bg-background"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
          >
            <JourneySearch />
            <TransportModes />
          </motion.div>
        </div>
      </div>

    </div>
  );
}
