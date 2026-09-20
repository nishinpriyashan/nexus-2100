import { Car, Train, Plane, Map as MapIcon } from 'lucide-react';

export default function TransportModes() {
  const modes = [
    { name: 'AUTONOMOUS', icon: Car },
    { name: 'MAGLEV', icon: Train },
    { name: 'AERO', icon: Plane },
    { name: 'SMART ROAD', icon: MapIcon },
  ];

  return (
    <div className="flex gap-6 mt-8 border-t border-surface/50 pt-6">
      {modes.map((mode) => {
        const Icon = mode.icon;
        return (
          <div key={mode.name} className="flex flex-col items-center gap-2 text-secondary-text hover:text-primary-cyan transition-colors cursor-default">
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-semibold tracking-widest">{mode.name}</span>
          </div>
        );
      })}
    </div>
  );
}
