"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Float, Sparkles } from "@react-three/drei";
import { ARButton, XR, createXRStore } from "@react-three/xr";
import styles from "./page.module.css";
import { useAuraStore } from "../../store/useAuraStore";

const store = createXRStore();

// The holographic element placed physically in the user's room
function HolographicMonument({ theme }: { theme: 'minimal' | 'neon' | 'ethereal' }) {
  const isNeon = theme === 'neon';
  const isEthereal = theme === 'ethereal';
  
  return (
    <group position={[0, -0.5, -2]}>
      {/* Dynamic particles based on theme */}
      {isEthereal && <Sparkles count={150} scale={4} size={4} speed={0.2} opacity={0.6} color="#ffd447" />}
      {isNeon && <Sparkles count={80} scale={3} size={2} speed={1.5} opacity={0.8} color="#00ffff" />}
      
      {/* Floating Centerpiece */}
      <Float speed={isNeon ? 4 : 2} rotationIntensity={isNeon ? 0.8 : 0.2} floatIntensity={0.5}>
        <mesh position={[0, 1.2, 0]}>
          {isNeon ? <octahedronGeometry args={[0.5, 0]} /> : <torusGeometry args={[0.4, 0.1, 16, 32]} />}
          <meshStandardMaterial 
            color={isNeon ? "#ff00ff" : isEthereal ? "#ffffff" : "#222222"} 
            wireframe={isNeon}
            emissive={isNeon ? "#ff00ff" : isEthereal ? "#ffd447" : "#000000"}
            emissiveIntensity={isNeon ? 2 : isEthereal ? 0.5 : 0}
            roughness={isEthereal ? 0 : 0.4}
            metalness={isEthereal ? 1 : 0.8}
          />
        </mesh>
      </Float>

      {/* Abstract Stage Pedestal projected on physical floor */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1, 1.2, 0.2, 32]} />
        <meshStandardMaterial 
           color={isNeon ? "#111" : isEthereal ? "#fff" : "#111"}
           emissive={isNeon ? "#00ffff" : "#000"}
           emissiveIntensity={isNeon ? 0.2 : 0}
           wireframe={isNeon}
           roughness={0.2} 
           metalness={0.8} 
        />
      </mesh>

      {/* Shadow Catcher mapping onto real-world floor */}
      <ContactShadows position={[0, 0.01, 0]} opacity={0.6} scale={5} blur={2} far={2} color={isNeon ? "#ff00ff" : "#000"} />
      
      {/* Lighting specific to theme */}
      <ambientLight intensity={isEthereal ? 0.8 : 0.3} />
      {isNeon && (
        <pointLight position={[0, 2, 0]} color="#00ffff" intensity={2} distance={5} />
      )}
      {isEthereal && (
        <pointLight position={[0, 2, 0]} color="#ffd447" intensity={1.5} distance={5} />
      )}
    </group>
  );
}

export default function ARPreview() {
  const theme = useAuraStore((state) => state.layoutTheme);
  const setTheme = useAuraStore((state) => state.setLayoutTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Suppress WebGLRenderer resize error while in VR
    const originalError = console.error;
    console.error = (...args) => {
       if (typeof args[0] === 'string' && args[0].includes("Can't change size while VR device is presenting")) {
          return;
       }
       originalError.apply(console, args);
    };
    return () => {
       console.error = originalError;
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.container} style={{ background: 'transparent' }}>
      <header className={styles.header}>
        <Link href="/">
          <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            ← Exit Experience
          </button>
        </Link>
        <h2 className="text-gradient" style={{textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>True AR Passthrough</h2>
        <div style={{ width: '130px' }}></div>
      </header>
      
      {/* NATIVE WEBXR PASSTHROUGH TRIGGER - Premium HUD */}
        <div className={styles.arOverlay}>
          <div className={`${styles.hudCard} animate-fade-in`}>
            <div className={styles.scanLine}></div>
            
            <div className={styles.hudHeader}>
              <h2 className={styles.hudTitle}>SYSTEM INITIALIZED</h2>
              <p className={styles.hudSubtitle}>AuraEngine AR Protocol Ready</p>
            </div>

            <div className={styles.hudSteps}>
              <div className={styles.stepItem}>
                <div className={styles.stepIcon}>1</div>
                <div>
                  <span className={styles.stepText}>Initialize Camera</span>
                  <span className={styles.stepSubtext}>Grant environment access when prompted</span>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepIcon}>2</div>
                <div>
                  <span className={styles.stepText}>Scan Surface</span>
                  <span className={styles.stepSubtext}>Move device to map the floor geometry</span>
                </div>
              </div>
              <div className={styles.stepItem}>
                <div className={styles.stepIcon}>3</div>
                <div>
                  <span className={styles.stepText}>Deploy Blueprint</span>
                  <span className={styles.stepSubtext}>Tap to materialize the Yenege venue</span>
                </div>
              </div>
            </div>

            <button 
              className={styles.enterArBtn}
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.xr) {
                  store.enterAR().catch(err => {
                    console.error('AR error:', err);
                    alert('Could not start AR session. ' + err.message);
                  });
                } else {
                  alert("WebXR is not supported here. If you're on a phone, make sure you access this via HTTPS (start Next.js with --experimental-https). If on PC, ensure you have a WebXR Emulator extension.");
                }
              }}
            >
              <span>Initialize True AR</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            </button>
          </div>
        </div>

      <main className={styles.canvasContainer} style={{ background: 'transparent' }}>
        <Canvas camera={{ position: [0, 1.5, 2], fov: 60 }} style={{ background: 'transparent', pointerEvents: 'none' }}>
          <XR store={store}>
            <Suspense fallback={null}>
              <Environment preset={theme === 'minimal' ? 'city' : 'night'} />
              <HolographicMonument theme={theme} />
              <OrbitControls autoRotate autoRotateSpeed={0.5} enablePan={false} maxPolarAngle={Math.PI / 2 + 0.1} />
            </Suspense>
          </XR>
        </Canvas>

        {/* Dynamic Modding UI */}
        <div className={`glass-panel ${styles.controlPanel}`} style={{ background: 'rgba(10, 10, 10, 0.8)', pointerEvents: 'auto' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontFamily: 'Outfit, sans-serif' }}>Vibe Modder</h3>
          <div className={styles.buttons}>
            <button 
              className={`btn ${theme === 'minimal' ? 'btn-primary' : 'btn-outline'} ${styles.modBtn}`}
              onClick={() => setTheme('minimal')}
            >
              Minimal Noir
            </button>
            <button 
              className={`btn ${theme === 'neon' ? 'btn-primary' : 'btn-outline'} ${styles.modBtn}`}
              onClick={() => setTheme('neon')}
            >
              Neon Hackathon
            </button>
            <button 
              className={`btn ${theme === 'ethereal' ? 'btn-primary' : 'btn-outline'} ${styles.modBtn}`}
              onClick={() => setTheme('ethereal')}
            >
              Ethereal Yenege
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
