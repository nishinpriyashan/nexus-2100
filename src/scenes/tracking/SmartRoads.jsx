import { useMemo } from 'react';

/**
 * 3D Smart Road Network with multi-lane asphalt highways, glowing cyan lane dividers,
 * crosswalk markings, and futuristic street lights.
 */
export default function SmartRoads({ isDark = true }) {
  const roadColor = isDark ? '#060E18' : '#D1DBE8';
  const markingColor = isDark ? '#39E7FF' : '#0099CC';

  // Road lines parallel to the maglev tracks
  const roadLines = useMemo(() => {
    return [
      { z: -8, width: 4.5, length: 120 },
      { z: 8, width: 4.5, length: 120 },
      { x: 0, width: 120, length: 4.5 } // Cross boulevard
    ];
  }, []);

  // Street light positions
  const streetLights = useMemo(() => {
    const list = [];
    for (let x = -50; x <= 50; x += 15) {
      list.push([x, 0, -10.5]);
      list.push([x, 0, 5.5]);
    }
    return list;
  }, []);

  return (
    <group>
      {/* ── Main Asphalt Road Strips ── */}
      {roadLines.map((road, i) => (
        <mesh
          key={`road-${i}`}
          position={[road.x || 0, 0.02, road.z || 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[road.width, road.length]} />
          <meshStandardMaterial color={roadColor} roughness={0.9} metalness={0.1} />
        </mesh>
      ))}

      {/* ── Glowing Center Line Dividers ── */}
      <mesh position={[0, 0.03, -8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 0.15]} />
        <meshBasicMaterial color={markingColor} transparent opacity={0.8} />
      </mesh>

      <mesh position={[0, 0.03, 8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 0.15]} />
        <meshBasicMaterial color={markingColor} transparent opacity={0.8} />
      </mesh>

      {/* Crosswalk Boulevard Lines */}
      {[-15, 0, 15].map((xPos, idx) => (
        <group key={`crosswalk-${idx}`} position={[xPos, 0.035, 0]}>
          {[-1.5, -0.75, 0, 0.75, 1.5].map((offset, i) => (
            <mesh key={i} position={[offset, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.35, 3.5]} />
              <meshBasicMaterial color="#FFFFFF" transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      ))}

      {/* ── Futuristic Streetlight Poles ── */}
      {streetLights.map((pos, i) => (
        <group key={`light-${i}`} position={pos}>
          {/* Vertical Pole */}
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 3.6, 8]} />
            <meshStandardMaterial color="#0A1F38" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Overhanging Lamp Arm */}
          <mesh position={[0, 3.6, 0.4]} rotation={[Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.0, 8]} />
            <meshStandardMaterial color="#0A1F38" />
          </mesh>
          {/* Glowing Light Fixture */}
          <mesh position={[0, 3.8, 0.7]}>
            <boxGeometry args={[0.2, 0.08, 0.3]} />
            <meshBasicMaterial color={markingColor} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
