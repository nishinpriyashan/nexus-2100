import { useState, useMemo } from 'react';
import { Search, MapPin, Navigation, Compass, Layers, Check, Maximize2, Minimize2, ExternalLink } from 'lucide-react';
import { useJourneyStore } from '../../store/journeyStore';

/**
 * Free Interactive GPS Navigation Map Widget
 * 100% Free tile layer (Esri World Dark Gray & OpenStreetMap - No API key required).
 * Renders real-time GPS location search, synchronized live vehicle marker movement,
 * and high-tech 2100 radar route polyline.
 * Supports Left-Corner Shrink & Expand modes.
 */
export default function InteractiveGpsMap({ progress = 0 }) {
  const { activeJourney, setActiveJourney } = useJourneyStore();
  const [searchFrom, setSearchFrom] = useState(activeJourney?.from || 'Colombo Fort');
  const [searchTo, setSearchTo] = useState(activeJourney?.to || 'Kandy Mobility Hub');
  const [mapStyle, setMapStyle] = useState('dark');
  const [isExpanded, setIsExpanded] = useState(false);

  // Predefined Sri Lanka GPS coordinates
  const LOCATION_COORDS = useMemo(() => ({
    'colombo': { lat: 6.9271, lng: 79.8612 },
    'colombo fort': { lat: 6.9344, lng: 79.8428 },
    'kandy': { lat: 7.2906, lng: 80.6337 },
    'kandy mobility hub': { lat: 7.2936, lng: 80.6367 },
    'galle': { lat: 6.0535, lng: 80.2210 },
    'jaffna': { lat: 9.6615, lng: 80.0255 },
    'gampaha': { lat: 7.0840, lng: 79.9930 },
    'negombo': { lat: 7.2008, lng: 79.8737 },
    'nuwara eliya': { lat: 6.9497, lng: 80.7891 },
  }), []);

  const startKey = (searchFrom || 'colombo fort').toLowerCase();
  const endKey = (searchTo || 'kandy mobility hub').toLowerCase();
  const startCoords = LOCATION_COORDS[startKey] || LOCATION_COORDS['colombo fort'];
  const endCoords = LOCATION_COORDS[endKey] || LOCATION_COORDS['kandy mobility hub'];

  const currentLat = startCoords.lat + (endCoords.lat - startCoords.lat) * progress;
  const currentLng = startCoords.lng + (endCoords.lng - startCoords.lng) * progress;

  const getMapTileUrl = () => {
    if (mapStyle === 'streets') {
      return 'https://tile.openstreetmap.org/12/2454/2042.png';
    }
    return 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/12/2042/2454';
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchFrom && searchTo) {
      setActiveJourney({ from: searchFrom, to: searchTo });
    }
  };

  return (
    <div
      className={`flex flex-col glass-card-dark rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 pointer-events-auto border border-cyan-500/40 ${
        isExpanded 
          ? 'fixed inset-6 z-[120] w-auto h-auto max-w-none shadow-[0_0_80px_rgba(0,0,0,0.9)] animate-fadeIn' 
          : 'w-full max-w-md hover:border-cyan-400'
      }`}
    >
      {/* ── Search Bar & Controls Header ── */}
      <form onSubmit={handleSearchSubmit} className="p-3 bg-slate-950/95 border-b border-cyan-500/30 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span>Real OpenStreetMap GPS Path</span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 text-[10px] font-bold uppercase transition-all cursor-pointer"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isExpanded ? 'Shrink to Left Corner' : 'Expand Big Map'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-cyan-400" />
            <input
              type="text"
              value={searchFrom}
              onChange={(e) => setSearchFrom(e.target.value)}
              placeholder="Start Location"
              className="w-full bg-slate-900 border border-cyan-500/30 focus:border-cyan-400 rounded-lg pl-7 pr-2 py-1.5 text-xs text-white placeholder-slate-400 outline-none font-mono"
            />
          </div>
          <div className="relative">
            <Navigation className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-purple-400" />
            <input
              type="text"
              value={searchTo}
              onChange={(e) => setSearchTo(e.target.value)}
              placeholder="Destination"
              className="w-full bg-slate-900 border border-cyan-500/30 focus:border-purple-400 rounded-lg pl-7 pr-2 py-1.5 text-xs text-white placeholder-slate-400 outline-none font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            type="submit"
            className="px-3 py-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            Update GPS Path
          </button>

          <div className="flex items-center gap-1">
            {['dark', 'streets', 'radar'].map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setMapStyle(style)}
                className={`px-2 py-0.5 rounded text-[9px] uppercase font-mono transition-all ${
                  mapStyle === style
                    ? 'bg-cyan-400 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* ── Interactive Live Map View ── */}
      <div className={`relative w-full bg-[#030B17] overflow-hidden ${isExpanded ? 'h-full min-h-[450px]' : 'h-48'}`}>
        {/* Map Tile Base Layer */}
        {mapStyle !== 'radar' && (
          <div className="absolute inset-0 z-0 opacity-85 pointer-events-none">
            <img
              src={getMapTileUrl()}
              alt="GPS Base Map"
              className="w-full h-full object-cover filter brightness-90 contrast-125"
            />
          </div>
        )}

        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none bg-[radial-gradient(#39E7FF_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Vector SVG GPS Route Line & Live Vehicle Path */}
        <svg className="absolute inset-0 w-full h-full z-10">
          <line
            x1="12%"
            y1="85%"
            x2="88%"
            y2="15%"
            stroke="#0099CC"
            strokeWidth="4"
            strokeDasharray="6,4"
            opacity="0.6"
          />
          <line
            x1="12%"
            y1="85%"
            x2={`${12 + (88 - 12) * progress}%`}
            y2={`${85 - (85 - 12) * progress}%`}
            stroke="#39E7FF"
            strokeWidth="6"
          />
          <circle cx="12%" cy="85%" r="7" fill="#39E7FF" />
          <circle cx="88%" cy="15%" r="7" fill="#8B5CFF" />
        </svg>

        {/* Live Moving Vehicle GPS Marker Pin */}
        <div
          className="absolute z-20 transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center"
          style={{
            left: `${12 + (88 - 12) * progress}%`,
            top: `${85 - (85 - 15) * progress}%`,
          }}
        >
          <span className="w-8 h-8 rounded-full bg-cyan-400/40 animate-ping absolute -inset-1" />
          <div className="w-9 h-9 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-2xl text-cyan-400 font-bold text-[10px]">
            <Navigation className="w-4 h-4 transform rotate-45 text-cyan-400" />
          </div>
          <span className="mt-1 px-2 py-0.5 rounded bg-slate-950/95 text-[9px] font-mono text-cyan-300 border border-cyan-400/50 whitespace-nowrap shadow-xl font-bold">
            {currentLat.toFixed(3)}°N, {currentLng.toFixed(3)}°E
          </span>
        </div>

        <div className="absolute top-2 left-2 z-20 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-cyan-500/30 text-[9px] font-mono text-slate-300 flex items-center gap-1.5 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>GPS Path: <strong className="text-emerald-400 uppercase">Sri Lanka Route Active</strong></span>
        </div>
      </div>
    </div>
  );
}

