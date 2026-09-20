import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Accessibility, Menu, ChevronLeft } from 'lucide-react';
import SystemBadge from '../common/SystemBadge';
import AccessibilityMenu from './AccessibilityMenu';

export default function NexusNav() {
  const [isA11yOpen, setIsA11yOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  const showBack = location.pathname === '/journey' || location.pathname === '/tracking';
  
  const handleBack = () => {
    if (location.pathname === '/tracking') navigate('/journey');
    else if (location.pathname === '/journey') navigate('/');
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsA11yOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header ref={navRef} className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-background/50 border-b border-surface/50">
      <div className="flex items-center gap-4 md:gap-6">
        
        {showBack && (
          <button 
            onClick={handleBack}
            className="flex items-center justify-center p-2 rounded-full text-secondary-text hover:text-primary-cyan hover:bg-primary-cyan/10 transition-all focus:outline-none focus:ring-2 focus:ring-primary-cyan"
            aria-label="Go Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <Link to="/" className="flex items-center gap-2 text-primary-text hover:text-primary-cyan transition-colors" aria-label="NEXUS 2100 Home">
          <span className="font-bold text-xl tracking-wider">NEXUS</span>
          <span className="text-primary-cyan/60 text-sm font-mono mt-1">// 2100</span>
        </Link>
        <div className="hidden md:block border-l border-surface h-6 mx-2"></div>
        <SystemBadge className="hidden md:inline-flex" />
      </div>

      <nav className="flex items-center gap-4">
        <button 
          onClick={() => setIsA11yOpen(!isA11yOpen)}
          className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-cyan flex items-center gap-2 ${isA11yOpen ? 'text-primary-cyan bg-primary-cyan/10' : 'text-secondary-text hover:text-primary-text hover:bg-surface'}`}
          aria-label="Accessibility Settings"
          aria-expanded={isA11yOpen}
        >
          <span className="hidden md:inline text-xs font-bold tracking-widest uppercase ml-2">Accessibility</span>
          <Accessibility className="w-5 h-5" />
        </button>
        <button 
          className="md:hidden p-2 text-secondary-text hover:text-primary-text hover:bg-surface rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-cyan"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </nav>
      
      <AccessibilityMenu isOpen={isA11yOpen} />
    </header>
  );
}
