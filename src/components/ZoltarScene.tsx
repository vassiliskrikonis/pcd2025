import { useEffect, useState, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Center, Environment, Preload } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

const MODEL_URL = '/models/Zoltar Machine.glb';

interface Props {
  visible: boolean;
  onModelStart?: () => void;
}

function Model({ onLoaded, mousePosition }: { onLoaded: () => void; mousePosition: THREE.Vector2 }) {
  const { scene } = useGLTF(MODEL_URL);
  const [hasStartedFade, setHasStartedFade] = useState(false);
  const hasTriggeredCallback = useRef(false);
  const FADE_DURATION = 6; // Duration in seconds

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.transparent = true;
        child.material.opacity = 0;
      }
    });
    setHasStartedFade(true);
  }, [scene]);

  useFrame((_, delta) => {
    if (!hasStartedFade) return;
    
    let allFaded = true;
    let hasChangedOpacity = false;
    
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material.opacity < 1) {
        const currentOpacity = child.material.opacity;
        const progress = currentOpacity / 1;
        
        const easeInProgress = progress * progress * progress;
        const nextEaseInProgress = (progress + (delta / FADE_DURATION)) ** 3;
        const opacityIncrement = nextEaseInProgress - easeInProgress;
        
        child.material.opacity += opacityIncrement;
        child.material.opacity = Math.min(child.material.opacity, 1);
        
        if (opacityIncrement > 0) {
          hasChangedOpacity = true;
        }
        
        allFaded = false;
      }
    });

    if (hasChangedOpacity && !hasTriggeredCallback.current) {
      onLoaded();
      hasTriggeredCallback.current = true;
    }

    if (allFaded) {
      setHasStartedFade(false);
    }

    // Update model rotation based on mouse position without any inertia
    const mouseRotationX = (mousePosition.x - 0.5) * Math.PI * 0.1;
    const mouseRotationY = (mousePosition.y - 0.5) * Math.PI * 0.05;
    const initialYRotation = -Math.PI / 4 + Math.PI / 18;
    scene.rotation.set(mouseRotationY, mouseRotationX + initialYRotation, 0);
  });

  return (
    <primitive 
      object={scene} 
      scale={2}
      position={[0, -2, -2]}
      rotation={[0, -Math.PI / 4 + Math.PI / 18, 0]} // Restore initial rotation
    />
  );
}

function CameraRig({ mousePosition }: { mousePosition: THREE.Vector2 }) {
  const { camera } = useThree();
  useFrame(() => {
    const targetX = (mousePosition.x - 0.5) * 0.5; // Subtle camera movement
    const targetY = (mousePosition.y - 0.5) * 0.5; // Subtle camera movement
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function ZoltarScene({ visible, onModelStart }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(false);
  const [mousePosition, setMousePosition] = useState(new THREE.Vector2(0.5, 0.5));

  useEffect(() => {
    if (isLoaded) {
      setIsFadingIn(true);
      onModelStart?.();
    }
  }, [isLoaded, onModelStart]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition(new THREE.Vector2(event.clientX / window.innerWidth, event.clientY / window.innerHeight));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1
    }}>
      {visible && (
        <>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'black',
            opacity: isFadingIn ? 1 : 0,
            transition: 'opacity 6s cubic-bezier(0.42, 0, 1, 1)',
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: isFadingIn ? 1 : 0,
            transition: 'opacity 6s cubic-bezier(0.42, 0, 1, 1)',
          }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={3} color="#ffcc99" />
                <spotLight position={[-10, 10, -10]} angle={0.3} penumbra={1} intensity={2} color="#99ccff" />
                <spotLight position={[0, 20, 0]} angle={0.5} penumbra={1} intensity={2.5} color="#ff6699" />
                <spotLight position={[0, -20, 0]} angle={0.5} penumbra={1} intensity={2.5} color="#6699ff" />
                <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={2} color="#ff9966" />
                <spotLight position={[-5, 5, -5]} angle={0.3} penumbra={1} intensity={2} color="#66ccff" />
                <Center>
                  <Model onLoaded={() => {
                    setIsLoaded(true);
                    setIsFadingIn(true);
                    onModelStart?.();
                  }} mousePosition={mousePosition} />
                </Center>
                <CameraRig mousePosition={mousePosition} />
                <EffectComposer>
                  <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} />
                  <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
                  <Vignette eskil={false} offset={0.1} darkness={1.1} />
                  <ChromaticAberration 
                    offset={new THREE.Vector2(0.001, 0.001)}
                    radialModulation={false}
                    modulationOffset={1}
                  />
                </EffectComposer>
                <Environment preset="sunset" />
                <Preload all />
              </Suspense>
            </Canvas>
          </div>
        </>
      )}
    </div>
  );
}