import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Zap, Car, TramFront, Check, Clock, Users, ArrowRight, ShieldCheck, Leaf, Activity } from 'lucide-react';
import { useJourneyStore } from '../../store/journeyStore';

/**
 * Uber-Style Ride Booking & Transport Option Selector Component
 * Features PRD Features:
 * - Dynamic LKR Pricing
 * - Vehicle Occupancy / Density Meters (PRD E31) [P1]
 * - CO2 Carbon Savings Indicator (PRD F36) [P1]
 * - 1-Click "Confirm & Start 3D Journey" Launch
 */
export default function TransportFareSelector() {
  const { activeJourney, setActiveJourney, setRouteType } = useJourneyStore();
  const navigate = useNavigate();

  const [selectedVehicle, setSelectedVehicle] = useState('maglev');

  const from = activeJourney?.from || 'Colombo Fort Station';
  const to = activeJourney?.to || 'Kandy Central Hub';

  const VEHICLE_OPTIONS = [
    {
      id: 'aerolink',
      routeType: 'aiOptimized',
      name: 'AeroLink Air Taxi',
      tier: 'PREMIUM SKY',
      icon: Plane,
      priceLKR: 4500,
      duration: '12 min',
      capacity: '2 Seats',
      occupancy: 'LOW · 28%',
      occupancyColor: 'text-success bg-success/10 border-success/30',
      co2Saved: '14.2 kg CO₂',
      tag: 'FASTEST SKY ROUTE',
      color: 'border-ai-violet text-ai-violet bg-ai-violet/10'
    },
    {
      id: 'maglev',
      routeType: 'fastest',
      name: 'Colombo-Kandy Maglev Bullet',
      tier: 'HIGH SPEED RAIL',
      icon: Zap,
      priceLKR: 1850,
      duration: '20 min',
      capacity: 'Comfort Pod',
      occupancy: 'MODERATE · 54%',
      occupancyColor: 'text-warning bg-warning/10 border-warning/30',
      co2Saved: '12.8 kg CO₂',
      tag: 'POPULAR',
      color: 'border-primary-cyan text-primary-cyan bg-primary-cyan/10'
    },
    {
      id: 'evpod',
      routeType: 'accessible',
      name: 'Autonomous EV Shuttle',
      tier: 'UBER-STYLE EV POD',
      icon: Car,
      priceLKR: 850,
      duration: '35 min',
      capacity: '4 Seats',
      occupancy: 'LOW · 18%',
      occupancyColor: 'text-success bg-success/10 border-success/30',
      co2Saved: '10.5 kg CO₂',
      tag: '100% STEP-FREE',
      color: 'border-success text-success bg-success/10'
    },
    {
      id: 'ecotram',
      routeType: 'eco',
      name: 'Smart Eco-Tram',
      tier: 'GREEN ECO RAIL',
      icon: TramFront,
      priceLKR: 420,
      duration: '45 min',
      capacity: 'Shared Rail',
      occupancy: 'MODERATE · 62%',
      occupancyColor: 'text-warning bg-warning/10 border-warning/30',
      co2Saved: '16.5 kg CO₂',
      tag: '94% SOLAR POWERED',
      color: 'border-warning text-warning bg-warning/10'
    },
  ];

  const handleConfirmAndStart3D = (vehicle) => {
    const selected = vehicle || VEHICLE_OPTIONS.find((v) => v.id === selectedVehicle);
    setRouteType(selected.routeType);
    setActiveJourney({ from, to });

    setTimeout(() => {
      navigate('/tracking');
    }, 400);
  };

  return (
    <div className="w-full bg-surface/90 backdrop-blur-2xl border border-primary-cyan/40 rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col space-y-5 animate-fadeIn">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-surface/80 pb-4">
        <div>
          <span className="text-[10px] font-mono text-primary-cyan uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary-cyan" />
            NEXUS Uber Ride Selector // Sri Lanka
          </span>
          <div className="flex items-center gap-2 text-lg md:text-xl font-bold text-primary-text" style={{ fontFamily: 'Space Grotesk' }}>
            <span>{from}</span>
            <ArrowRight className="w-4 h-4 text-secondary-text" />
            <span>{to}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Carbon Saved Badge */}
          <span className="px-3 py-1 bg-success/15 border border-success/30 rounded-full text-[11px] font-mono font-bold text-success flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5" />
            12.8 kg CO₂ Saved
          </span>
        </div>
      </div>

      {/* ── 4 Transport Vehicle Options Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {VEHICLE_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedVehicle === option.id;

          return (
            <div
              key={option.id}
              onClick={() => setSelectedVehicle(option.id)}
              className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-surface border-primary-cyan shadow-xl scale-[1.02]'
                  : 'bg-background/60 border-surface/80 hover:border-primary-cyan/40 hover:bg-surface/50'
              }`}
            >
              {/* Badge & Occupancy Meter */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border ${option.color}`}>
                  {option.tag}
                </span>

                {/* Occupancy Indicator */}
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${option.occupancyColor} flex items-center gap-1`}>
                  <Activity className="w-2.5 h-2.5" />
                  {option.occupancy}
                </span>
              </div>

              {/* Title & Icon */}
              <div className="flex items-center gap-3 my-2">
                <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-primary-cyan/20 text-primary-cyan' : 'bg-surface/80 text-secondary-text'}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary-text leading-snug" style={{ fontFamily: 'Space Grotesk' }}>
                    {option.name}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-secondary-text mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-primary-cyan" />
                      {option.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-secondary-text" />
                      {option.capacity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Selector Circle */}
              <div className="flex items-center justify-between pt-3 border-t border-surface/60 mt-2">
                <div>
                  <span className="text-xs text-secondary-text mr-1">LKR</span>
                  <span className="text-xl font-bold font-mono text-primary-text">{option.priceLKR.toLocaleString()}</span>
                </div>

                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                  isSelected ? 'bg-primary-cyan border-primary-cyan text-background' : 'border-surface/80'
                }`}>
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 1-Click Action Button ── */}
      <button
        onClick={() => handleConfirmAndStart3D()}
        className="w-full py-4 bg-gradient-to-r from-primary-cyan via-ai-violet to-primary-cyan hover:opacity-95 text-background font-bold text-sm md:text-base uppercase tracking-widest rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 cursor-pointer animate-pulse"
      >
        <span>Confirm & Start 3D Journey Map</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
