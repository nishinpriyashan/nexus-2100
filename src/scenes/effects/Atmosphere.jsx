export default function Atmosphere() {
  return (
    <>
      <ambientLight intensity={0.2} color="#F4FAFF" />
      <directionalLight 
        position={[10, 20, 5]} 
        intensity={1.5} 
        color="#39E7FF" 
      />
      <directionalLight 
        position={[-10, -5, -5]} 
        intensity={1} 
        color="#8B5CFF" 
      />
      <pointLight position={[0, 0, 0]} intensity={2} color="#39E7FF" distance={20} />
      
      {/* Background Fog to blend geometry nicely */}
      <fog attach="fog" args={['#030711', 10, 40]} />
    </>
  );
}
