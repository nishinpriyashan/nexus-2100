import { useJourneyStore } from "../../store/journeyStore";
import { routes } from "../../data/journeyData";
import { getRemainingMinutes, getSimulatedSpeed, getDistanceRemaining } from "../../utils/journeyUtils";
import JourneyProgress from "./JourneyProgress";
import NexusLiveMonitor from "./NexusLiveMonitor";
import LiveIndicator from "./LiveIndicator";
import JourneyGuardian from "./JourneyGuardian";
import JourneyForecast from "./JourneyForecast";
import { ArrowRight, Activity, Clock, Zap, Navigation } from "lucide-react";

export default function TrackingHUD({ progress }) {
  const { activeJourney, routeType, aiApplied } = useJourneyStore();
  const from = activeJourney?.from || "Naaldwijk";
  const to = activeJourney?.to || "Amsterdam";

  const currentRoute = routes[routeType] || routes.fastest;
  const remainingMin = getRemainingMinutes(currentRoute, progress);
  const speed = getSimulatedSpeed(progress);
  const distRemaining = getDistanceRemaining(progress);
  const themeColor = aiApplied ? "text-ai-violet" : "text-primary-cyan";

  return (
    <div
      className="absolute inset-0 z-10 pointer-events-none p-4 md:p-10 flex flex-col justify-between"
      role="region"
      aria-label="Journey tracking dashboard"
    >
      {/* ── Top Row ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        {/* Journey title */}
        <div className="pointer-events-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-mono text-primary-cyan/70 tracking-widest uppercase">
              Live Journey // NX-8407
            </span>
            <LiveIndicator />
          </div>
          <div
            className="flex items-center gap-3 text-3xl md:text-5xl font-bold tracking-tight"
            style={{ fontFamily: "Space Grotesk, Inter, sans-serif" }}
          >
            <span className="text-primary-text">{from}</span>
            <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-secondary-text shrink-0" aria-hidden="true" />
            <span className="text-primary-text">{to}</span>
          </div>
        </div>

        {/* Stats panel */}
        <div
          className="flex gap-5 md:gap-8 bg-surface/30 backdrop-blur-md border border-surface/60 p-4 rounded-2xl pointer-events-auto"
          aria-label="Journey statistics"
          aria-live="polite"
        >
          <Stat label="ETA" value={currentRoute.arrival} Icon={Clock} className={themeColor} />
          <Stat label="Remaining" value={`${remainingMin}m`} Icon={Activity} />
          <Stat label="Speed" value={`${speed}`} unit="km/h" Icon={Zap} />
          <Stat label="Distance" value={distRemaining} unit="km" Icon={Navigation} className="hidden md:flex" />
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="flex flex-col lg:flex-row justify-between items-end gap-5 pointer-events-auto">
        {/* Progress + Monitor */}
        <div className="w-full lg:w-[55%] xl:w-3/5 flex flex-col gap-4">
          <JourneyProgress
            progress={progress}
            route={currentRoute}
            themeColor={themeColor}
          />
          <NexusLiveMonitor route={currentRoute} />
        </div>

        {/* Guardian panel */}
        <div className="w-full lg:w-80 xl:w-96 flex flex-col justify-end">
          <JourneyForecast progress={progress} />
          <JourneyGuardian />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, unit, Icon, className = "text-primary-text" }) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] uppercase tracking-widest text-secondary-text mb-1 flex items-center gap-1">
        <Icon className="w-3 h-3" aria-hidden="true" />
        {label}
      </span>
      <span className={`text-lg md:text-xl font-mono font-bold leading-none ${className}`}>
        {value}
        {unit && <span className="text-xs text-secondary-text ml-1">{unit}</span>}
      </span>
    </div>
  );
}
