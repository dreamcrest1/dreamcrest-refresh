import { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveContent, ContentType, ContentItem } from '@/hooks/useLiveContent';
import { X, Quote, Lightbulb, Sparkles, Laugh, Cpu, Zap, MessageSquare } from 'lucide-react';
import * as THREE from 'three';

// Preload the model
useGLTF.preload('/models/clippy.glb');

// Icon mapping for content types
const iconForType: Record<ContentType, React.ElementType> = {
  quote: Quote,
  trivia: Lightbulb,
  fact: Sparkles,
  joke: Laugh,
  tech: Cpu,
  greeting: MessageSquare,
};

// 3D Clippy Model Component with fallback
function ClippyModel({ 
  onClick, 
  onDoubleClick, 
  celebrating 
}: { 
  onClick: () => void; 
  onDoubleClick: () => void;
  celebrating: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();
  
  // Try loading the model, fallback to basic geometry if it fails
  let modelScene: THREE.Object3D | null = null;
  try {
    const { scene } = useGLTF('/models/clippy.glb');
    modelScene = scene.clone();
  } catch (e) {
    console.warn('Could not load Clippy GLB model, using fallback');
  }
  
  // Animation state
  const [hovered, setHovered] = useState(false);
  const floatOffset = useRef(0);
  const clickBounce = useRef(0);
  const celebrationSpin = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Idle floating animation
    floatOffset.current += delta * 2;
    const floatY = Math.sin(floatOffset.current) * 0.15;
    
    // Click bounce decay
    clickBounce.current *= 0.9;
    
    // Celebration spin
    if (celebrating) {
      celebrationSpin.current += delta * 10;
    } else {
      celebrationSpin.current *= 0.95;
    }

    // Mouse following rotation (subtle)
    const targetRotationY = mouse.x * 0.4;
    const targetRotationX = -mouse.y * 0.2;
    
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetRotationY + celebrationSpin.current,
      0.1
    );
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      targetRotationX,
      0.1
    );

    // Position with float and bounce
    meshRef.current.position.y = floatY + clickBounce.current;

    // Hover scale
    const targetScale = hovered ? 1.15 : 1;
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1)
    );
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    clickBounce.current = 0.4;
    onClick();
  };

  const handleDoubleClick = (e: any) => {
    e.stopPropagation();
    onDoubleClick();
  };

  return (
    <group 
      ref={meshRef}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {modelScene ? (
        <primitive 
          object={modelScene} 
          scale={2.5}
          position={[0, -0.5, 0]}
        />
      ) : (
        // Fallback: Simple metallic paperclip shape
        <group>
          {/* Main paperclip body - curved metal */}
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[0.8, 0.08, 16, 32, Math.PI * 1.5]} />
            <meshStandardMaterial 
              color="#C0C0C0" 
              metalness={0.9} 
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0.4, -0.8, 0]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.4, 0.08, 16, 32, Math.PI]} />
            <meshStandardMaterial 
              color="#C0C0C0" 
              metalness={0.9} 
              roughness={0.2}
            />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.2, 0.3, 0.5]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.2, 0.3, 0.5]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          {/* Pupils */}
          <mesh position={[-0.2, 0.3, 0.62]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0.2, 0.3, 0.62]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </group>
      )}
    </group>
  );
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <Html center>
      <div className="text-primary animate-pulse text-2xl">📎</div>
    </Html>
  );
}

export function Clippy3D() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [celebrating, setCelebrating] = useState(false);
  const [content, setContent] = useState<ContentItem | null>(null);
  const { getContent, getGreeting, isLoading } = useLiveContent();
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initial greeting
  useEffect(() => {
    setContent(getGreeting());
  }, [getGreeting]);

  // Hide hint after first interaction
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-fetch content periodically
  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(async () => {
        if (!isMinimized) {
          const newContent = await getContent();
          setContent(newContent);
        }
      }, 45000);
    };
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isMinimized, getContent]);

  const handleClick = async () => {
    setShowHint(false);
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      const newContent = await getContent();
      setContent(newContent);
    }
  };

  const handleDoubleClick = () => {
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 2000);
  };

  const handleClose = () => {
    setIsMinimized(true);
  };

  const ContentIcon = content ? iconForType[content.type] : Sparkles;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* Speech Bubble */}
      <AnimatePresence>
        {!isMinimized && content && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="relative max-w-[280px] rounded-lg border-2 border-amber-600/30 bg-amber-50 p-4 shadow-lg"
            style={{
              background: 'linear-gradient(180deg, #fffef0 0%, #fef9c3 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)',
            }}
          >
            {/* Paper lines effect */}
            <div 
              className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden opacity-20"
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 23px, #a3c9f1 23px, #a3c9f1 24px)',
                backgroundSize: '100% 24px',
                backgroundPosition: '0 8px',
              }}
            />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-md hover:bg-red-600 transition-colors"
            >
              <X size={12} />
            </button>

            {/* Content header */}
            <div className="relative flex items-center gap-2 mb-2">
              <ContentIcon size={16} className="text-amber-700" />
              <span className="text-xs font-medium text-amber-700 capitalize">
                {content.type}
              </span>
              {content.isLive && (
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                  <Zap size={10} className="animate-pulse" />
                  Live
                </span>
              )}
            </div>

            {/* Content text */}
            <p className="relative text-sm text-amber-900 leading-relaxed font-serif">
              {isLoading ? (
                <span className="animate-pulse">Fetching wisdom...</span>
              ) : (
                content.text
              )}
            </p>

            {/* Source */}
            {content.source && (
              <p className="relative mt-2 text-xs text-amber-600 italic">
                — {content.source}
              </p>
            )}

            {/* Speech bubble tail */}
            <div 
              className="absolute -bottom-2 right-8 w-4 h-4 bg-gradient-to-b from-amber-50 to-yellow-100 border-b-2 border-r-2 border-amber-600/30 transform rotate-45"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Clippy Canvas */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="relative cursor-pointer"
        style={{ width: 140, height: 160 }}
      >
        {/* Click hint */}
        <AnimatePresence>
          {showHint && isMinimized && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="absolute -left-24 top-1/2 -translate-y-1/2 whitespace-nowrap bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium shadow-lg"
            >
              Click me! 📎
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification dot */}
        {isMinimized && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-md z-10"
          >
            <span className="absolute inset-0 animate-ping bg-red-400 rounded-full opacity-75" />
          </motion.div>
        )}

        {/* 3D Canvas */}
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          dpr={[1, 2]}
          style={{ background: 'transparent' }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <directionalLight position={[-5, 3, 0]} intensity={0.6} color="#ffeedd" />
          <pointLight position={[0, 0, 3]} intensity={0.5} />
          
          <Suspense fallback={<LoadingFallback />}>
            <ClippyModel 
              onClick={handleClick}
              onDoubleClick={handleDoubleClick}
              celebrating={celebrating}
            />
          </Suspense>
        </Canvas>

        {/* Attribution (small, unobtrusive) */}
        <a 
          href="https://sketchfab.com/3d-models/clippy-b76fc20a72e44574b9e7c27fae3d8e06"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-0 right-0 text-[8px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          title="3D Model by tylerbeall on Sketchfab"
        >
          3D: tylerbeall
        </a>
      </motion.div>
    </div>
  );
}
