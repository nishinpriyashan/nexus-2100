import { Activity } from 'lucide-react';

export default function SystemBadge({ text = "NETWORK ONLINE", className = "" }) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary-cyan/30 bg-primary-cyan/10 backdrop-blur-sm ${className}`}>
      <Activity className="w-4 h-4 text-primary-cyan" />
      <span className="text-xs font-semibold text-primary-cyan tracking-widest uppercase">
        {text}
      </span>
    </div>
  );
}
