import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { VideoPlayer } from './components/VideoPlayer';
import './App.css';

export default function App() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-gray-900">
      {/* Animated generative background blobs */}
      <div className="bg-blobs">
        {[...Array(12)].map((_, i) => {
          const colors = ['#00b8a9', '#f8f3d4', '#f6416c', '#ffde7d'];
          const color = colors[i % colors.length];
          const size = `${Math.random() * 8 + 8}vmin`;
          const left = `${Math.random() * 90}%`;
          const top = `${Math.random() * 90}%`;
          const delay = `${-i * 1.2}s`;
          const tx = `${Math.random() * 60 - 30}vmin`;
          const ty = `${Math.random() * 60 - 30}vmin`;
          const tz = `${Math.random() * 30 + 30}vmin`;
          const rot = `${Math.random() * 720 - 360}deg`;
          return (
            <div
              key={i}
              className="blob"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${color} 15%, transparent 70%)`,
                width: size,
                height: size,
                left,
                top,
                animationDelay: delay,
                '--tx': tx,
                '--ty': ty,
                '--tz': tz,
                '--rot': rot,
              } as React.CSSProperties}
            />
          );
        })}
      </div>

      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[16, 9]} />
          <meshStandardMaterial color="#333" />
          <Html
            transform
            occlude
            position={[0, 0, 0.1]}
            style={{ width: '1600px', height: '900px' }}
          >
            <VideoPlayer />
          </Html>
        </mesh>

        <OrbitControls />
      </Canvas>
    </div>
  );
}
