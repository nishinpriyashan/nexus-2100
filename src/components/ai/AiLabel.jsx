import { Html } from '@react-three/drei';
import { Activity } from 'lucide-react';

export default function AiLabel({ position }) {
  return (
    <Html position={position} center className="pointer-events-none">
      <div className="flex flex-col items-center gap-1 opacity-80 mix-blend-screen">
        <div className="flex items-center gap-2 bg-background/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-primary-cyan/20">
          <Activity className="w-3 h-3 text-primary-cyan animate-pulse" />
          <span className="text-[10px] font-bold text-primary-cyan tracking-widest uppercase whitespace-nowrap">
            Nexus AI
          </span>
        </div>
        <div className="text-[8px] font-mono text-ai-violet/80 tracking-widest uppercase bg-background/40 backdrop-blur-md px-2 py-0.5 rounded-full">
          System Online
        </div>
      </div>
    </Html>
  );
}
