import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Settings2, ChevronLeft } from "lucide-react";
import SystemBadge from "../common/SystemBadge";
import NexusPassport from "./NexusPassport";
import ThemeToggle from "./ThemeToggle";

export default function NexusNav() {
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const showBack = location.pathname === "/journey" || location.pathname === "/tracking";

  const handleBack = () => {
    if (location.pathname === "/tracking") navigate("/journey");
    else if (location.pathname === "/journey") navigate("/");
  };

  // Close passport menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsPassportOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
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
            className="flex items-center justify-center w-9 h-9 rounded-full text-secondary-text hover:text-primary-cyan hover:bg-primary-cyan/10 transition-all focus-visible:ring-2 focus-visible:ring-primary-cyan focus-visible:outline-none"
            aria-label="Go back"
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

      {/* Right — controls */}
      <nav className="flex items-center gap-2 md:gap-3" aria-label="Settings">
        {/* Note: ThemeToggle is somewhat redundant with Passport now, but kept for quick access */}
        <ThemeToggle />

        <button
          onClick={() => setIsPassportOpen(!isPassportOpen)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-cyan ${
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

      {/* NEXUS Passport dialog */}
      <NexusPassport isOpen={isPassportOpen} onClose={() => setIsPassportOpen(false)} />
    </header>
  );
}
