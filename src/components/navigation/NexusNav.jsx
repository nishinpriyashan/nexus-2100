import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Settings2, ChevronLeft, Rocket, AlertTriangle, Wallet, Car, Camera, Navigation, Map, Eye, EyeOff } from "lucide-react";
import SystemBadge from "../common/SystemBadge";
import NexusPassport from "./NexusPassport";
import ThemeToggle from "./ThemeToggle";
import VoiceCommandBar from "./VoiceCommandBar";
import EmergencySosModal from "../tracking/EmergencySosModal";
import DigitalWalletModal from "../journey/DigitalWalletModal";
import { useJourneyStore } from "../../store/journeyStore";

export default function NexusNav() {
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    activeJourney,
    setActiveJourney,
    isDriveMode,
    toggleDriveMode,
    cameraMode,
    setCameraMode,
    showGpsMap,
    setShowGpsMap,
    isHudVisible,
    setIsHudVisible,
  } = useJourneyStore();

  const showBack = location.pathname === "/journey" || location.pathname === "/tracking";

  const handleBack = () => {
    navigate("/");
  };

  const handleStart3DJourney = () => {
    if (!activeJourney) {
      setActiveJourney({ from: "Colombo Fort Station", to: "Kandy Central Hub" });
    }
    navigate("/tracking");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsPassportOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setIsPassportOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 py-2.5 md:px-8 md:py-3 backdrop-blur-xl bg-background/80 border-b border-border shadow-sm transition-colors duration-300"
      role="banner"
    >
      {/* Left — logo + back button + status */}
      <div className="flex items-center gap-2 md:gap-3">
        {showBack && (
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-secondary-text hover:text-primary-text hover:bg-surface-elevated transition-all focus-visible:ring-2 focus-visible:ring-primary-cyan focus-visible:outline-none cursor-pointer border border-border/50"
            aria-label="Go back to Home"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        <Link
          to="/"
          className="flex items-center gap-1.5 text-primary-text hover:text-primary-cyan transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-cyan rounded"
          aria-label="NEXUS 2100 — Return to Home"
        >
          <span className="font-bold text-lg md:text-xl tracking-wider" style={{ fontFamily: "Space Grotesk, Inter, sans-serif" }}>
            NEXUS
          </span>
          <span className="text-primary-cyan text-xs font-mono">// 2100</span>
        </Link>

        <div className="hidden lg:block border-l border-border h-4 mx-1" aria-hidden="true" />
        <SystemBadge className="hidden lg:inline-flex" />
      </div>

      {/* Center — Tracking Control Buttons (Visible on Tracking Page Header) */}
      {location.pathname === "/tracking" && (
        <div className="flex items-center gap-1 md:gap-1.5 bg-surface-elevated/90 backdrop-blur-md border border-border p-1 rounded-xl shadow-inner">
          <button
            onClick={toggleDriveMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              isDriveMode
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md animate-pulse"
                : "bg-primary-cyan/10 text-primary-cyan hover:bg-primary-cyan/20 border border-primary-cyan/30"
            }`}
            title="Drive Vehicle across Sri Lanka 2100 Universe"
          >
            <Car className="w-3.5 h-3.5" />
            <span>{isDriveMode ? "Exit Drive" : "🏎️ Drive Vehicle"}</span>
          </button>

          <button
            onClick={() => setCameraMode("falcon")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
              cameraMode === "falcon"
                ? "bg-primary-cyan text-slate-950 font-bold shadow-sm"
                : "text-secondary-text hover:text-primary-text hover:bg-surface"
            }`}
            title="Switch to Top-Down Falcon Overhead Camera"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Falcon</span>
          </button>

          <button
            onClick={() => setCameraMode("reality")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
              cameraMode === "reality"
                ? "bg-ai-violet text-white font-bold shadow-sm"
                : "text-secondary-text hover:text-primary-text hover:bg-surface"
            }`}
            title="Switch to Street Reality View"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Street View</span>
          </button>

          <button
            onClick={() => setShowGpsMap(!showGpsMap)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
              showGpsMap
                ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                : "text-secondary-text hover:text-primary-text hover:bg-surface"
            }`}
            title="Toggle Live OpenStreetMap GPS Path Map"
          >
            <Map className="w-3.5 h-3.5" />
            <span className="hidden md:inline">GPS Map</span>
          </button>

          <button
            onClick={() => setIsHudVisible(!isHudVisible)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-secondary-text hover:text-primary-text rounded-lg text-xs font-bold uppercase transition-all cursor-pointer hover:bg-surface"
            title="Toggle Dashboard HUD Overlay (Press H)"
          >
            {isHudVisible ? <EyeOff className="w-3.5 h-3.5 text-primary-cyan" /> : <Eye className="w-3.5 h-3.5 text-primary-cyan" />}
            <span className="hidden md:inline">{isHudVisible ? "Hide HUD" : "Show HUD"}</span>
          </button>
        </div>
      )}

      {/* Right — Voice Control, Emergency SOS, Digital Wallet, Start 3D & Passport Controls */}
      <nav className="flex items-center gap-1.5 md:gap-2.5" aria-label="Settings">
        {/* Voice Command Assistant Button */}
        <VoiceCommandBar />

        {/* PRD E32 [P0]: Emergency SOS Button */}
        <button
          onClick={() => setIsSosOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-warning/10 hover:bg-warning/20 border border-warning/30 text-warning font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
          title="Emergency SOS Broadcast & Trip Share (PRD E32)"
        >
          <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden xl:inline">SOS</span>
        </button>

        {/* PRD B11/B12 [P0]: Unified Digital Wallet & QR Pass */}
        <button
          onClick={() => setIsWalletOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-elevated hover:bg-surface border border-border text-primary-text font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
          title="Unified Digital Wallet & Scannable QR Boarding Pass (PRD B11/B12)"
        >
          <Wallet className="w-3.5 h-3.5 text-primary-cyan" />
          <span className="hidden xl:inline">Wallet</span>
        </button>

        {/* Start 3D Journey Button */}
        {location.pathname !== "/tracking" && (
          <button
            onClick={handleStart3DJourney}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-cyan hover:bg-primary-cyan/90 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
            title="Start 3D Journey Map Immediately"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Start 3D</span>
          </button>
        )}

        <ThemeToggle />

        <button
          onClick={() => setIsPassportOpen(!isPassportOpen)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-cyan cursor-pointer ${
            isPassportOpen
              ? "text-primary-cyan bg-primary-cyan/10 border-primary-cyan/30"
              : "text-secondary-text hover:text-primary-text hover:bg-surface border-border"
          }`}
          aria-label="NEXUS Passport Preferences"
          aria-expanded={isPassportOpen}
          aria-haspopup="dialog"
        >
          <span className="hidden md:inline text-[10px] font-bold tracking-widest uppercase">
            Passport
          </span>
          <Settings2 className="w-3.5 h-3.5" />
        </button>
      </nav>


      {/* Modals */}
      <NexusPassport isOpen={isPassportOpen} onClose={() => setIsPassportOpen(false)} />
      <EmergencySosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
      <DigitalWalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
    </header>
  );
}
