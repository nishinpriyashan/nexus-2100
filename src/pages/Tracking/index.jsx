import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { MapPin, Clock, Zap } from "lucide-react";
import { useJourneyStore } from "../../store/journeyStore";
import { routes } from "../../data/journeyData";
import { getRemainingMinutes, getActiveMode, getSimulatedSpeed } from "../../utils/journeyUtils";
import TrackingWorld from "../../scenes/tracking/TrackingWorld";
import TrackingHUD from "../../components/tracking/TrackingHUD";
import JourneyGuardian from "../../components/tracking/JourneyGuardian";
import JourneyForecast from "../../components/tracking/JourneyForecast";
import LiveIndicator from "../../components/tracking/LiveIndicator";
import JourneyProgress from "../../components/tracking/JourneyProgress";

export default function Tracking() {
  const { passport, activeJourney, routeType } = useJourneyStore();
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0.05);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!activeJourney) navigate("/");
  }, [activeJourney, navigate]);

  useEffect(() => {
    let lastTime = performance.now();
    const animate = (time) => {
      const deltaTime = time - lastTime;
      lastTime = time;
      setProgress((prev) => {
        const next = prev + deltaTime * 0.000012;
        return next >= 1 ? 1 : next;
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, []);

  if (!activeJourney) return null;

  const currentRoute = routes[routeType] || routes.fastest;
  const remaining = getRemainingMinutes(currentRoute, progress);
  const activeMode = getActiveMode(currentRoute, progress);
  const speed = getSimulatedSpeed(progress);

  // SIMPLIFIED INTERFACE MODE — clean "You Are On The Train" experience
  if (passport.experience === 'simplified') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-sm w-full space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <LiveIndicator />
          </div>

          <div className="bg-surface/30 border border-surface rounded-2xl p-8 space-y-4">
            <div className="text-[11px] font-bold text-secondary-text tracking-widest uppercase">
              Current Transport
            </div>
            <div className="text-3xl font-bold text-primary-cyan" style={{ fontFamily: "Space Grotesk, Inter, sans-serif" }}>
              {activeMode.toUpperCase()}
            </div>

            <div className="h-px bg-surface/80 my-4" />

            <div className="text-[11px] font-bold text-secondary-text tracking-widest uppercase">
              Destination
            </div>
            <div className="text-2xl font-bold text-primary-text">
              {activeJourney.to}
            </div>

            <div className="h-px bg-surface/80 my-4" />

            <div className="text-5xl font-bold font-mono text-primary-text">
              {remaining}
            </div>
            <div className="text-secondary-text text-sm tracking-widest uppercase">
              Minutes Remaining
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-bold text-success tracking-widest uppercase">
              Your Journey Is On Time
            </span>
          </div>

          <JourneyProgress progress={progress} route={currentRoute} themeColor="text-primary-cyan" />
          <JourneyGuardian />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      {/* ── Desktop Layout: 3D world full-screen, HUD overlay ── */}
      <div className="hidden md:block">
        {/* 3D world */}
        <div className="absolute inset-0 z-0">
          <TrackingWorld progress={progress} />
        </div>
        {/* HUD overlay */}
        <TrackingHUD progress={progress} />
      </div>

      {/* ── Mobile Layout: Stacked panels ── */}
      <div className="flex md:hidden flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 bg-background/80 border-b border-surface/50 backdrop-blur-md">
          <div>
            <div className="text-xs text-secondary-text">Tracking</div>
            <div className="text-base font-bold text-primary-text">
              {activeJourney.from} → {activeJourney.to}
            </div>
          </div>
          <LiveIndicator />
        </div>

        {/* ETA stats bar */}
        <div className="grid grid-cols-3 divide-x divide-surface/50 bg-surface/20 border-b border-surface/50">
          {[
            { label: "ETA", value: currentRoute.arrival, Icon: Clock },
            { label: "Mode", value: activeMode.split(" ")[0], Icon: Zap },
            { label: "Speed", value: `${speed} km/h`, Icon: MapPin },
          ].map(({ label, value, Icon }) => (
            <div key={label} className="flex flex-col items-center py-3 px-2">
              <Icon className="w-3.5 h-3.5 text-primary-cyan mb-1" />
              <div className="text-sm font-bold font-mono text-primary-text leading-none">{value}</div>
              <div className="text-[9px] text-secondary-text tracking-widest uppercase mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* 3D map — constrained height */}
        <div className="w-full" style={{ height: "50vw", minHeight: "200px", maxHeight: "300px" }}>
          <TrackingWorld progress={progress} />
        </div>

        {/* Progress */}
        <div className="px-4 py-3">
          <JourneyProgress progress={progress} route={currentRoute} themeColor="text-primary-cyan" />
        </div>

        {/* Guardian & Forecast */}
        <div className="px-4 pb-6">
          <JourneyForecast progress={progress} />
          <div className="text-[10px] font-bold text-secondary-text tracking-widest uppercase mb-2 mt-4">
            Journey Guardian
          </div>
          <JourneyGuardian />
        </div>
      </div>
    </div>
  );
}
