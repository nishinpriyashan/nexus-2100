import { useState, useEffect } from "react";
import { useJourneyStore } from "../../store/journeyStore";
import { routes } from "../../data/journeyData";
import { getRemainingMinutes, getSimulatedSpeed, getDistanceRemaining } from "../../utils/journeyUtils";
import JourneyProgress from "./JourneyProgress";
import NexusLiveMonitor from "./NexusLiveMonitor";
import LiveIndicator from "./LiveIndicator";
import JourneyGuardian from "./JourneyGuardian";
import JourneyForecast from "./JourneyForecast";
import InteractiveGpsMap from "./InteractiveGpsMap";
import GestureController from "./GestureController";
import { ArrowRight, Activity, Clock, Zap, Navigation, Eye, EyeOff, Maximize2, Map, Camera } from "lucide-react";

export default function TrackingHUD({
  progress,
  cameraMode,
  setCameraMode,
  cameraRotation,
  onRotateCamera,
  onResetCamera,
  onZoomCamera
}) {
  const { activeJourney, routeType, aiApplied } = useJourneyStore();
  const [isHudVisible, setIsHudVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showGpsMap, setShowGpsMap] = useState(false);

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
        setIsHudVisible((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showFullDetails = isHudVisible || isHovered;

  return (
    <div
      className="absolute inset-0 z-10 pointer-events-none p-4 md:p-8 flex flex-col justify-between transition-all duration-500"
      role="region"
      aria-label="Journey tracking dashboard"
      onMouseEnter={() => !isHudVisible && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Top Bar ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div 
          className="pointer-events-auto bg-surface/80 backdrop-blur-md border border-surface/80 rounded-2xl p-4 transition-all duration-300 hover:border-primary-cyan/40 shadow-xl"
          onMouseEnter={() => setIsHovered(true)}
        >
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[10px] font-mono text-primary-cyan/80 tracking-widest uppercase">
              Live Journey // NX-8407
            </span>
            <LiveIndicator />
          </div>
          <div
            className="flex items-center gap-3 text-2xl md:text-3xl font-bold tracking-tight text-primary-text"
            style={{ fontFamily: "Space Grotesk, Inter, sans-serif" }}
          >
            <span>{from}</span>
            <ArrowRight className="w-5 h-5 text-secondary-text shrink-0" aria-hidden="true" />
            <span>{to}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          <div className="flex items-center bg-surface/80 backdrop-blur-md border border-surface/80 p-1 rounded-xl shadow-lg">
            <button
              onClick={() => setCameraMode('falcon')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                cameraMode === 'falcon'
                  ? 'bg-primary-cyan text-background font-bold shadow'
                  : 'text-secondary-text hover:text-primary-text'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Falcon View</span>
            </button>

            <button
              onClick={() => setCameraMode('reality')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                cameraMode === 'reality'
                  ? 'bg-ai-violet text-white font-bold shadow animate-pulse'
                  : 'text-secondary-text hover:text-primary-text'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Street Reality View</span>
            </button>

            <button
              onClick={() => setShowGpsMap((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                showGpsMap
                  ? 'bg-success text-background font-bold shadow'
                  : 'text-secondary-text hover:text-primary-text'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>GPS Map</span>
            </button>
          </div>

          <button
            onClick={() => setIsHudVisible((prev) => !prev)}
            className="flex items-center gap-2 px-3.5 py-2 bg-surface/80 backdrop-blur-md border border-primary-cyan/30 hover:border-primary-cyan text-primary-text hover:text-primary-cyan rounded-xl transition-all shadow-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
            title="Toggle HUD Overlay (Press H)"
          >
            {isHudVisible ? (
              <>
                <EyeOff className="w-4 h-4 text-primary-cyan" />
                <span>Cinematic View</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-primary-cyan" />
                <span>Show Dashboard</span>
              </>
            )}
          </button>

          <div
            className={`flex gap-5 md:gap-6 bg-surface/40 backdrop-blur-md border border-surface/60 p-3 rounded-2xl transition-all duration-500 ${
              showFullDetails ? "opacity-100 scale-100 pointer-events-auto" : "opacity-30 scale-95 pointer-events-auto hover:opacity-100"
            }`}
          >
            <Stat label="ETA" value={currentRoute.arrival} Icon={Clock} className={themeColor} />
            <Stat label="Remaining" value={`${remainingMin}m`} Icon={Activity} />
            <Stat label="Speed" value={`${speed}`} unit="km/h" Icon={Zap} />
          </div>
        </div>
      </div>

      {/* ── Floating Widgets: GPS Map & Anchored Right Sidebar Gesture Controller ── */}
      <div className="absolute top-28 right-6 z-20 pointer-events-auto flex flex-col gap-4 items-end">
        {showGpsMap && (
          <div className="w-80 md:w-96 animate-fadeIn shadow-2xl">
            <InteractiveGpsMap progress={progress} />
          </div>
        )}

        {/* Anchored Right-Side Gesture Controller */}
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

      {/* ── Bottom Floating Cards ── */}
      <div
        className={`flex flex-col lg:flex-row justify-between items-end gap-5 pointer-events-auto transition-all duration-500 transform ${
          showFullDetails
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-12 pointer-events-none"
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
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
          <button
            onClick={() => setIsHudVisible(true)}
            onMouseEnter={() => setIsHovered(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-surface/80 backdrop-blur-lg border border-primary-cyan/50 text-primary-cyan hover:bg-primary-cyan/20 rounded-full shadow-2xl transition-all text-xs font-bold tracking-widest uppercase cursor-pointer animate-bounce"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Hover / Click to Expand Details</span>
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
