import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Settings2, ChevronLeft, Rocket, AlertTriangle, Wallet } from "lucide-react";
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
  const { activeJourney, setActiveJourney } = useJourneyStore();

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
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 md:px-12 md:py-4 backdrop-blur-md bg-background/60 border-b border-surface/50"
      role="banner"
    >
      {/* Left — logo + back button */}
      <div className="flex items-center gap-3 md:gap-4">
        {showBack && (
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-9 h-9 rounded-full text-secondary-text hover:text-primary-cyan hover:bg-primary-cyan/10 transition-all focus-visible:ring-2 focus-visible:ring-primary-cyan focus-visible:outline-none cursor-pointer"
            aria-label="Go back to Home"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <Link
          to="/"
          className="flex items-center gap-2 text-primary-text hover:text-primary-cyan transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-cyan rounded"
          aria-label="NEXUS 2100 — Return to Home"
        >
          <span className="font-bold text-xl tracking-wider" style={{ fontFamily: "Space Grotesk, Inter, sans-serif" }}>
            NEXUS
          </span>
          <span className="text-primary-cyan/60 text-sm font-mono mt-0.5">// 2100</span>
        </Link>

        <div className="hidden md:block border-l border-surface/80 h-5 mx-1" aria-hidden="true" />
        <SystemBadge className="hidden md:inline-flex" />
      </div>

      {/* Right — Voice Control, Emergency SOS, Digital Wallet, Start 3D & Passport Controls */}
      <nav className="flex items-center gap-2 md:gap-3" aria-label="Settings">
        {/* Voice Command Assistant Button */}
        <VoiceCommandBar />

        {/* PRD E32 [P0]: Emergency SOS Button */}
        <button
          onClick={() => setIsSosOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-warning/15 hover:bg-warning/25 border border-warning/40 text-warning font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
          title="Emergency SOS Broadcast & Trip Share (PRD E32)"
        >
          <AlertTriangle className="w-4 h-4 animate-pulse" />
          <span className="hidden xl:inline">Emergency SOS</span>
        </button>

        {/* PRD B11/B12 [P0]: Unified Digital Wallet & QR Pass */}
        <button
          onClick={() => setIsWalletOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-surface/80 hover:bg-surface border border-primary-cyan/40 text-primary-cyan font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
          title="Unified Digital Wallet & Scannable QR Boarding Pass (PRD B11/B12)"
        >
          <Wallet className="w-4 h-4" />
          <span className="hidden xl:inline">Wallet & QR Pass</span>
        </button>

        {/* Start 3D Journey Button */}
        <button
          onClick={handleStart3DJourney}
          className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-primary-cyan via-ai-violet to-primary-cyan hover:opacity-90 text-background font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer animate-pulse"
          title="Start 3D Journey Map Immediately"
        >
          <Rocket className="w-4 h-4" />
          <span className="hidden sm:inline">Start 3D Journey</span>
        </button>

        <ThemeToggle />

        <button
          onClick={() => setIsPassportOpen(!isPassportOpen)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-cyan cursor-pointer ${
            isPassportOpen
              ? "text-primary-cyan bg-primary-cyan/10 border-primary-cyan/30"
              : "text-secondary-text hover:text-primary-text hover:bg-surface/50 border-surface/50"
          }`}
          aria-label="NEXUS Passport Preferences"
          aria-expanded={isPassportOpen}
          aria-haspopup="dialog"
        >
          <span className="hidden md:inline text-[10px] font-bold tracking-widest uppercase">
            Passport
          </span>
          <Settings2 className="w-4 h-4" />
        </button>
      </nav>

      {/* Modals */}
      <NexusPassport isOpen={isPassportOpen} onClose={() => setIsPassportOpen(false)} />
      <EmergencySosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
      <DigitalWalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
    </header>
  );
}
