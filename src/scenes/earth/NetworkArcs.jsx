import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

/**
 * Global mobility network arcs on the Earth globe.
 * Represents NEXUS global connectivity.
 * Colors: cyan = active, violet = AI-optimized, green = accessible
 */

// Convert lat/lon to 3D position on sphere of given radius
function latLonToVec3(lat, lon, radius = 2.45) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Build a curved arc between two lat/lon points
function buildArc(lat1, lon1, lat2, lon2, segments = 48, arcHeight = 1.2) {
  const start = latLonToVec3(lat1, lon1);
  const end = latLonToVec3(lat2, lon2);
  const mid = new THREE.Vector3()
    .addVectors(start, end)
    .normalize()
    .multiplyScalar(2.45 * arcHeight);

  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  return curve.getPoints(segments);
}

// Major NEXUS network connections
const CONNECTIONS = [
  // Europe to Asia (cyan - active)
  { from: [51.5, -0.1], to: [35.7, 139.7], color: "#39E7FF", type: "active" },
  // Europe to North America (violet - AI)
  { from: [48.9, 2.3], to: [40.7, -74.0], color: "#8B5CFF", type: "ai" },
  // Amsterdam to Singapore (cyan)
  { from: [52.4, 4.9], to: [1.3, 103.8], color: "#39E7FF", type: "active" },
  // London to Dubai (green)
  { from: [51.5, -0.1], to: [25.2, 55.3], color: "#42FFB4", type: "success" },
  // Amsterdam to New York (violet)
  { from: [52.4, 4.9], to: [40.7, -74.0], color: "#8B5CFF", type: "ai" },
  // Regional: Amsterdam to Berlin (cyan, small)
  { from: [52.4, 4.9], to: [52.5, 13.4], color: "#39E7FF", type: "active" },
  // Regional: Paris to Madrid
  { from: [48.9, 2.3], to: [40.4, -3.7], color: "#39E7FF", type: "active" },
];

function Arc({ points, color, offset }) {
  const lineRef = useRef();

  useFrame(({ clock }) => {
    if (lineRef.current) {
      const t = clock.getElapsedTime();
      lineRef.current.material.opacity = 0.3 + Math.sin(t * 1.5 + offset) * 0.2;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={1.5}
      transparent
      opacity={0.4}
      depthWrite={false}
    />
  );
}

// Network node dots at city positions
function NetworkNode({ lat, lon, color, size = 0.025 }) {
  const pos = latLonToVec3(lat, lon);
  const pulseRef = useRef();

  useFrame(({ clock }) => {
    if (pulseRef.current) {
      const t = clock.getElapsedTime();
      pulseRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.3);
      pulseRef.current.material.opacity = 0.4 + Math.sin(t * 2) * 0.2;
    }
  });

  return (
    <group position={pos}>
      {/* Solid dot */}
      <mesh>
        <sphereGeometry args={[size, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Pulsing ring */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[size * 2.5, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function NetworkArcs({ isDark = true }) {
  const arcs = useMemo(() => {
    return CONNECTIONS.map((conn, i) => ({
      ...conn,
      points: buildArc(
        conn.from[0], conn.from[1],
        conn.to[0], conn.to[1],
        48,
        1.15 + (i % 3) * 0.05
      ),
    }));
  }, []);

  // Unique city nodes
  const nodes = useMemo(() => [
    { lat: 52.4, lon: 4.9, color: "#39E7FF" },   // Amsterdam
    { lat: 48.9, lon: 2.3, color: "#39E7FF" },   // Paris
    { lat: 51.5, lon: -0.1, color: "#8B5CFF" },  // London
    { lat: 52.5, lon: 13.4, color: "#39E7FF" },  // Berlin
    { lat: 35.7, lon: 139.7, color: "#8B5CFF" }, // Tokyo
    { lat: 40.7, lon: -74.0, color: "#8B5CFF" }, // New York
    { lat: 1.3, lon: 103.8, color: "#42FFB4" },  // Singapore
    { lat: 25.2, lon: 55.3, color: "#42FFB4" },  // Dubai
  ], []);

  return (
    <group>
      {arcs.map((arc, i) => (
        <Arc
          key={i}
          points={arc.points}
          color={isDark ? arc.color : arc.color}
          offset={i * 0.8}
        />
      ))}
      {nodes.map((node, i) => (
        <NetworkNode
          key={i}
          lat={node.lat}
          lon={node.lon}
          color={node.color}
        />
      ))}
    </group>
  );
}
