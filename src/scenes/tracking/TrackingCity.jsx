import { useMemo, useState } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { createBuildingTexture, createEmissiveBuildingTexture } from '../../utils/buildingTextures';
import { SRI_LANKA_LANDMARKS } from '../../data/sriLankaLandmarks';
import { Building2, Info, Navigation2 } from 'lucide-react';

export default function TrackingCity({ count = 100, isDark = true, onSelectBuilding }) {
  const [hoveredBuilding, setHoveredBuilding] = useState(null);

  const { facadeTexture, emissiveTexture } = useMemo(() => {
    return {
      facadeTexture: createBuildingTexture(isDark),
      emissiveTexture: createEmissiveBuildingTexture()
    };
  }, [isDark]);

  // Standard procedural ambient buildings
  const buildings = useMemo(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 90;
      const z = (Math.random() - 0.5) * 90 - 10;
      
      // Leave space around roads and landmarks
      if (Math.abs(z) < 10 && Math.abs(x) < 35) continue;

      const width = Math.random() * 2 + 1.2;
      const depth = Math.random() * 2 + 1.2;
      const height = Math.random() * Math.random() * 24 + 4;
      
      const hasSpire = height > 12 && Math.random() > 0.4;
      const spireHeight = hasSpire ? Math.random() * 5 + 2 : 0;
      
      const hasCrown = height > 15 && Math.random() > 0.5;
      const crownColor = Math.random() > 0.5 ? '#39E7FF' : '#8B5CFF';

      list.push({
        id: `b-${i}`,
        position: [x, height / 2, z],
        width,
        height,
        depth,
        hasSpire,
        spireHeight,
        spirePos: [x, height + spireHeight / 2, z],
        hasCrown,
        crownColor,
        crownPos: [x, height + 0.3, z]
      });
    }
    return list;
  }, [count]);

  return (
    <group>
      {/* ── Sri Lanka Famous Landmark Skyscraper Models ── */}
      {SRI_LANKA_LANDMARKS.map((landmark) => (
        <group 
          key={landmark.id} 
          position={landmark.position}
          onPointerOver={() => setHoveredBuilding(landmark)}
          onPointerOut={() => setHoveredBuilding(null)}
          onClick={() => onSelectBuilding && onSelectBuilding(landmark)}
        >
          {/* Custom Mesh based on Landmark Type */}
          {landmark.id === 'lotus-tower-2100' && (
            <LotusTowerModel height={landmark.height} color={landmark.color} isDark={isDark} />
          )}

          {landmark.id === 'altair-2100' && (
            <AltairTowerModel height={landmark.height} color={landmark.color} isDark={isDark} />
          )}

          {landmark.id === 'wtc-colombo' && (
            <WtcTwinTowersModel height={landmark.height} color={landmark.color} isDark={isDark} />
          )}

          {(landmark.id === 'port-city-nexus' || landmark.id === 'cinnamon-life') && (
            <GrandComplexModel height={landmark.height} color={landmark.color} isDark={isDark} />
          )}

          {landmark.id === 'kandy-temple-2100' && (
            <KandyTempleModel height={landmark.height} color={landmark.color} />
          )}

          {landmark.id === 'galle-lighthouse-2100' && (
            <GalleLighthouseModel height={landmark.height} color={landmark.color} />
          )}

          {landmark.id === 'sigiriya-rock-2100' && (
            <SigiriyaRockModel height={landmark.height} color={landmark.color} />
          )}

          {/* Floating 3D Holographic Label Header */}
          <Html
            position={[0, landmark.height / 2 + 2, 0]}
            center
            distanceFactor={35}
            zIndexRange={[100, 0]}
          >
            <div 
              className={`flex flex-col items-center cursor-pointer transition-all duration-300 transform ${
                hoveredBuilding?.id === landmark.id ? 'scale-110' : 'scale-100'
              }`}
            >
              {/* Pulsing Landmark Beacon Pin */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-cyan-400/50 shadow-2xl text-white">
                <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: landmark.color }} />
                <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold tracking-wide whitespace-nowrap" style={{ fontFamily: 'Space Grotesk' }}>
                    {landmark.name}
                  </span>
                  <span className="text-[9px] text-slate-300 font-mono leading-none">
                    {landmark.localName}
                  </span>
                </div>
              </div>

              {/* Hover detail tooltip card */}
              {hoveredBuilding?.id === landmark.id && (
                <div className="mt-2 p-3 w-56 rounded-xl glass-card-dark text-white shadow-2xl text-left animate-fadeIn">
                  <div className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase mb-1 flex items-center gap-1">
                    <Info className="w-3 h-3 text-cyan-400" />
                    {landmark.type}
                  </div>
                  <div className="text-xs text-slate-200 leading-relaxed">
                    {landmark.description}
                  </div>
                </div>
              )}
            </div>
          </Html>
        </group>
      ))}

      {/* ── 3D Sri Lankan Tropical Coconut Palm Trees ── */}
      <SriLankaPalmTrees GrovesCount={35} />

      {/* ── Procedural Skyscraper Main City Grid ── */}
      {buildings.map((b) => (
        <group key={b.id}>
          <mesh position={b.position}>
            <boxGeometry args={[b.width, b.height, b.depth]} />
            <meshStandardMaterial
              map={facadeTexture}
              emissiveMap={emissiveTexture}
              emissive={isDark ? new THREE.Color('#39E7FF') : new THREE.Color('#0099CC')}
              emissiveIntensity={isDark ? 0.35 : 0.15}
              roughness={isDark ? 0.2 : 0.4}
              metalness={isDark ? 0.85 : 0.6}
            />
          </mesh>

          {b.hasSpire && (
            <mesh position={b.spirePos}>
              <cylinderGeometry args={[0.04, 0.12, b.spireHeight, 8]} />
              <meshBasicMaterial color={b.crownColor} />
            </mesh>
          )}

          {b.hasCrown && (
            <mesh position={b.crownPos} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[b.width * 0.45, 0.1, 8, 24]} />
              <meshBasicMaterial color={b.crownColor} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

/* ── Sri Lankan Coconut Palm Tree Forest Component ── */
function SriLankaPalmTrees({ GrovesCount = 30 }) {
  const trees = useMemo(() => {
    const list = [];
    for (let i = 0; i < GrovesCount; i++) {
      const x = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 80;
      const height = Math.random() * 2 + 3.5;
      list.push({ id: `tree-${i}`, pos: [x, height / 2, z], height });
    }
    return list;
  }, [GrovesCount]);

  return (
    <group>
      {trees.map((t) => (
        <group key={t.id} position={t.pos}>
          {/* Brown Palm Trunk */}
          <mesh>
            <cylinderGeometry args={[0.1, 0.18, t.height, 8]} />
            <meshStandardMaterial color="#8B5A2B" roughness={0.8} />
          </mesh>
          {/* Lush Green Palm Canopy */}
          <mesh position={[0, t.height / 2 + 0.4, 0]}>
            <coneGeometry args={[1.6, 1.2, 8]} />
            <meshStandardMaterial color="#2E8B57" roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ── Custom 3D Mesh for Kandy Sacred Temple of Tooth ── */
function KandyTempleModel({ height, color }) {
  return (
    <group>
      {/* Temple White Wall Base */}
      <mesh position={[0, height * 0.25, 0]}>
        <boxGeometry args={[4, height * 0.5, 3]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
      {/* Golden Roof Canopy */}
      <mesh position={[0, height * 0.65, 0]}>
        <coneGeometry args={[3.2, 2.5, 4]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} emissive="#FFD700" emissiveIntensity={0.5} />
      </mesh>
      {/* Kandy Lake Blue Water Surface */}
      <mesh position={[0, 0.05, 3.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7, 4]} />
        <meshStandardMaterial color="#0077BE" roughness={0.1} metalness={0.8} opacity={0.85} transparent />
      </mesh>
    </group>
  );
}

/* ── Custom 3D Mesh for Galle Lighthouse & Ramparts ── */
function GalleLighthouseModel({ height, color }) {
  return (
    <group>
      {/* White Lighthouse Tower */}
      <mesh position={[0, height * 0.45, 0]}>
        <cylinderGeometry args={[0.6, 1.1, height * 0.9, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
      </mesh>
      {/* Beacon Light Room */}
      <mesh position={[0, height * 0.95, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 1.2, 12]} />
        <meshStandardMaterial color="#39E7FF" emissive="#39E7FF" emissiveIntensity={0.8} />
      </mesh>
      {/* Galle Stone Rampart Wall */}
      <mesh position={[-2, height * 0.15, 0]}>
        <boxGeometry args={[4, height * 0.3, 1.5]} />
        <meshStandardMaterial color="#708090" roughness={0.9} />
      </mesh>
    </group>
  );
}

/* ── Custom 3D Mesh for Sigiriya Lion Rock Citadel ── */
function SigiriyaRockModel({ height, color }) {
  return (
    <group>
      {/* Massive Rock Plateau */}
      <mesh position={[0, height * 0.35, 0]}>
        <cylinderGeometry args={[4.5, 6, height * 0.7, 12]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.95} />
      </mesh>
      {/* Top Palace Gardens */}
      <mesh position={[0, height * 0.72, 0]}>
        <cylinderGeometry args={[4.4, 4.4, 0.4, 12]} />
        <meshStandardMaterial color="#2E8B57" roughness={0.5} />
      </mesh>
    </group>
  );
}

/* ── Custom 3D Mesh for Lotus Tower 2100 ── */
function LotusTowerModel({ height, color, isDark }) {
  return (
    <group>
      {/* Base Stem */}
      <mesh position={[0, height * 0.35, 0]}>
        <cylinderGeometry args={[0.3, 0.9, height * 0.7, 16]} />
        <meshStandardMaterial color="#0A1F38" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Lotus Petal Crown Pod */}
      <mesh position={[0, height * 0.75, 0]}>
        <sphereGeometry args={[1.6, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.9} emissive={color} emissiveIntensity={0.6} />
      </mesh>
      {/* Top Spire Antenna */}
      <mesh position={[0, height * 0.95, 0]}>
        <cylinderGeometry args={[0.05, 0.2, height * 0.3, 8]} />
        <meshBasicMaterial color="#39E7FF" />
      </mesh>
    </group>
  );
}

/* ── Custom 3D Mesh for Altair 2100 Slanted Twin Towers ── */
function AltairTowerModel({ height, color, isDark }) {
  return (
    <group>
      {/* Vertical Tower */}
      <mesh position={[-0.8, height / 2, 0]}>
        <boxGeometry args={[1.4, height, 1.4]} />
        <meshStandardMaterial color="#07111F" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Stepped Slanted Tower */}
      <mesh position={[0.8, height * 0.45, 0]} rotation={[0, 0, -Math.PI / 16]}>
        <boxGeometry args={[1.2, height * 0.9, 1.2]} />
        <meshStandardMaterial color="#0A1E36" roughness={0.15} metalness={0.85} />
      </mesh>
      {/* Suspended Skybridge */}
      <mesh position={[0, height * 0.65, 0]}>
        <boxGeometry args={[2.8, 0.4, 0.8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

/* ── Custom 3D Mesh for WTC Colombo Twin Towers ── */
function WtcTwinTowersModel({ height, color, isDark }) {
  return (
    <group>
      {/* Tower 1 */}
      <mesh position={[-0.9, height / 2, 0]}>
        <cylinderGeometry args={[0.9, 1.1, height, 8]} />
        <meshStandardMaterial color="#0A1F38" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Tower 2 */}
      <mesh position={[0.9, height / 2, 0]}>
        <cylinderGeometry args={[0.9, 1.1, height, 8]} />
        <meshStandardMaterial color="#0A1F38" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Connecting Atrium Skywalk */}
      <mesh position={[0, height * 0.5, 0]}>
        <boxGeometry args={[1.8, 0.5, 0.8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

/* ── Custom 3D Mesh for Grand Complex Towers ── */
function GrandComplexModel({ height, color, isDark }) {
  return (
    <group>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[2.4, height, 1.8]} />
        <meshStandardMaterial color="#071527" roughness={0.15} metalness={0.85} />
      </mesh>
      <mesh position={[0, height + 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.1, 0.15, 8, 24]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

