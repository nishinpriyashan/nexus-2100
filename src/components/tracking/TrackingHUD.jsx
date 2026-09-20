import { useState, useEffect } from "react";
import { useJourneyStore } from "../../store/journeyStore";
import { routes } from "../../data/journeyData";
import { getRemainingMinutes, getSimulatedSpeed } from "../../utils/journeyUtils";
import JourneyProgress from "./JourneyProgress";
import NexusLiveMonitor from "./NexusLiveMonitor";
import LiveIndicator from "./LiveIndicator";
import JourneyGuardian from "./JourneyGuardian";
import JourneyForecast from "./JourneyForecast";
import InteractiveGpsMap from "./InteractiveGpsMap";
import GestureController from "./GestureController";
import { ArrowRight, Activity, Clock, Zap, Navigation, Eye, EyeOff, Maximize2, Map, Camera, Car } from "lucide-react";


export default function TrackingHUD({
  progress,
  cameraRotation,
  onRotateCamera,
  onResetCamera,
  onZoomCamera
}) {
  const {
    activeJourney,
    routeType,
    aiApplied,
    isDriveMode,
    toggleDriveMode,
    cameraMode,
    setCameraMode,
    showGpsMap,
    setShowGpsMap,
    isHudVisible,
    setIsHudVisible,
  } = useJourneyStore();

  const [isHovered, setIsHovered] = useState(false);

  const from = activeJourney?.from || "Colombo Fort Station";
  const to = activeJourney?.to || "Kandy Central Hub";

  const currentRoute = routes[routeType] || routes.fastest;
  const remainingMin = getRemainingMinutes(currentRoute, progress);
  const speed = getSimulatedSpeed(progress);
  const themeColor = aiApplied ? "text-ai-violet" : "text-primary-cyan";

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'h' || e.key === 'H') {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
        setIsHudVisible(!isHudVisible);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHudVisible, setIsHudVisible]);

  const showFullDetails = isHudVisible || isHovered;

  return (
    <div
      className="absolute inset-0 z-10 pointer-events-none p-4 md:p-8 flex flex-col justify-between transition-all duration-500"
      role="region"
      aria-label="Journey tracking dashboard"
    >
      {/* ── Top Bar (Trip Summary & Live Stats) ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-12 md:pt-14">
        {/* Trip Title Card */}
        <div 
          className="pointer-events-auto glass-card-dark rounded-2xl p-3.5 transition-all duration-300 shadow-lg border border-border"
          onMouseEnter={() => setIsHovered(true)}
        >
          <div className="flex items-center gap-2.5 mb-1">
            <span className="text-[10px] font-mono text-primary-cyan tracking-widest uppercase">
              Live Journey // NX-8407
            </span>
            <LiveIndicator />
          </div>
          <div
            className="flex items-center gap-2.5 text-xl md:text-2xl font-bold tracking-tight text-primary-text"
            style={{ fontFamily: "Space Grotesk, Inter, sans-serif" }}
          >
            <span>{from}</span>
            <ArrowRight className="w-4 h-4 text-secondary-text shrink-0" aria-hidden="true" />
            <span>{to}</span>
          </div>
        </div>

        {/* Live Trip Telemetry Stats */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div
            className={`flex gap-5 md:gap-6 glass-card-dark p-3 rounded-2xl transition-all duration-500 border border-border ${
              showFullDetails ? "opacity-100 scale-100 pointer-events-auto" : "opacity-40 scale-95 pointer-events-auto hover:opacity-100"
            }`}
          >
            <Stat label="ETA" value={currentRoute.arrival} Icon={Clock} className={themeColor} />
            <Stat label="Remaining" value={`${remainingMin}m`} Icon={Activity} />
            <Stat label="Speed" value={`${speed}`} unit="km/h" Icon={Zap} />
          </div>
        </div>
      </div>

      {/* ── Left Corner Widget: Real OpenStreetMap GPS Path Map (When toggled or active) ── */}
      {(showGpsMap || isHudVisible) && (
        <div className="absolute top-36 left-6 z-30 pointer-events-auto">
          <div className="w-80 md:w-96 animate-fadeIn shadow-2xl">
            <InteractiveGpsMap progress={progress} />
          </div>
        </div>
      )}

      {/* ── Right Corner Widget: Anchored Right Sidebar Gesture Controller ── */}
      <div className="absolute top-36 right-6 z-20 pointer-events-auto flex flex-col gap-4 items-end">
        <div className="w-72 md:w-80 shadow-2xl">
          <GestureController
            cameraMode={cameraMode}
            onSwitchMode={setCameraMode}
            onRotateCamera={onRotateCamera}
            onResetCamera={onResetCamera}
            onZoomCamera={onZoomCamera}
          />
        </div>
      </div>


      {/* ── Bottom Mouse Trigger Zone (Auto-Hides Dashboard until Hovered) ── */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-28 z-30 pointer-events-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />

      {/* ── Bottom Floating Dashboard (Auto-Hides Down, Appears on Hover) ── */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`flex flex-col lg:flex-row justify-between items-end gap-5 pointer-events-auto transition-all duration-500 transform z-40 ${
          showFullDetails
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-24 pointer-events-none"
        }`}
      >
        <div className="w-full lg:w-[55%] xl:w-3/5 flex flex-col gap-4">
          <JourneyProgress
            progress={progress}
            route={currentRoute}
            themeColor={themeColor}
          />
          <NexusLiveMonitor route={currentRoute} />
        </div>

        <div className="w-full lg:w-80 xl:w-96 flex flex-col justify-end">
          <JourneyForecast progress={progress} />
          <JourneyGuardian />
        </div>
      </div>

      {!showFullDetails && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
          <button
            onMouseEnter={() => setIsHovered(true)}
            onClick={() => setIsHudVisible(true)}
            className="flex items-center gap-2 px-5 py-2.5 glass-card-dark text-cyan-300 hover:text-white hover:border-cyan-400 rounded-full shadow-2xl transition-all text-xs font-bold tracking-widest uppercase cursor-pointer animate-bounce border border-cyan-500/40"
          >
            <Maximize2 className="w-4 h-4 text-cyan-400" />
            <span>Hover Bottom to Reveal Dashboard</span>
          </button>
        </div>
      )}
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
      <span className={`text-lg font-mono font-bold leading-none ${className}`}>
        {value}
        {unit && <span className="text-xs text-secondary-text ml-1">{unit}</span>}
      </span>
    </div>
  );
}
