"use client";

import { Suspense, useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { XR, createXRStore, useXRHitTest } from "@react-three/xr";
import * as THREE from "three";
import styles from "./page.module.css";
import { useAuraStore } from "../../store/useAuraStore";
import { generateEventLayout, LayoutPoint } from "../../lib/layoutEngine";
import EventQuiz from "../../components/EventQuiz";

const store = createXRStore();

//
// 🟢 RETICLE (placement indicator)
//
function Reticle({ onSelect }: { onSelect: (pos: THREE.Vector3) => void }) {
  const ref = useRef<THREE.Mesh>(null!);
  const matrixHelper = useMemo(() => new THREE.Matrix4(), []);

  useXRHitTest((results, getWorldMatrix) => {
    if (!ref.current) return;
    if (results.length === 0) {
      ref.current.visible = false;
      return;
    }
    getWorldMatrix(matrixHelper, results[0]);
    ref.current.visible = true;
    ref.current.position.setFromMatrixPosition(matrixHelper);
  }, "viewer");

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.03;
  });

  return (
    <mesh
      ref={ref}
      visible={false}
      onClick={() => {
        if (ref.current) {
          onSelect(ref.current.position.clone());
        }
      }}
    >
      <ringGeometry args={[0.15, 0.2, 32]} />
      <meshBasicMaterial color="cyan" />
    </mesh>
  );
}

//
// 🟢 EVENT OBJECTS
//
function Table({ point, style }: { point: LayoutPoint; style: string }) {
  return (
    <group position={point.position}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.7, 32]} />
        <meshStandardMaterial color="#eee" />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.65, 0.65, 0.05, 32]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
    </group>
  );
}

function Chair({ point }: { point: LayoutPoint }) {
  return (
    <group position={point.position} rotation={point.rotation}>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.4, 0.5, 0.4]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0, 0.7, -0.18]}>
        <boxGeometry args={[0.4, 0.6, 0.05]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
}

function Stage({ point }: { point: LayoutPoint }) {
  return (
    <mesh position={point.position}>
      <boxGeometry args={point.scale || [4, 0.4, 2]} />
      <meshStandardMaterial color="#111" />
    </mesh>
  );
}

//
// 🟢 EVENT SCENE (OFFSET BY ANCHOR)
//
function EventScene({ anchor }: { anchor: THREE.Vector3 }) {
  const { eventConfig } = useAuraStore();

  const layout = useMemo(() => {
    return generateEventLayout(eventConfig);
  }, [eventConfig]);

  return (
    <group position={anchor}>
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 5, 0]} intensity={1} />

      {layout.map((point) => {
        if (point.type === "table")
          return <Table key={point.id} point={point} style={eventConfig.style} />;
        if (point.type === "chair")
          return <Chair key={point.id} point={point} />;
        if (point.type === "stage")
          return <Stage key={point.id} point={point} />;
        return null;
      })}

      <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={20} blur={2} />
    </group>
  );
}

//
// 🟢 MAIN COMPONENT
//
export default function ARPreview() {
  const [showQuiz, setShowQuiz] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [anchor, setAnchor] = useState<THREE.Vector3 | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.container}>
      {showQuiz ? (
        <div className={styles.quizOverlay}>
          <EventQuiz onComplete={() => setShowQuiz(false)} />
        </div>
      ) : (
        <>
          <header className={styles.header}>
            <button className="btn btn-outline" onClick={() => setShowQuiz(true)}>
              ← Back to Quiz
            </button>
            <h2>AR Event Placement</h2>
            <div style={{ width: "100px" }}></div>
          </header>

          <div className={styles.arOverlay}>
            {!anchor ? (
              <div className={styles.hudCard}>
                <h2>Scan Floor & Tap to Place</h2>
                <button onClick={() => store.enterAR()}>
                  Enter AR
                </button>
              </div>
            ) : (
              <div className={styles.hudCard}>
                <h2>Event Placed ✅</h2>
                <button onClick={() => setAnchor(null)}>
                  Reset Placement
                </button>
              </div>
            )}
          </div>

          <main className={styles.canvasContainer}>
            <Canvas camera={{ position: [0, 1.6, 0], fov: 60 }}>
              <XR store={store}>
                <Suspense fallback={null}>
                  {!anchor && (
                    <Reticle onSelect={(pos) => setAnchor(pos)} />
                  )}

                  {anchor && <EventScene anchor={anchor} />}
                </Suspense>
              </XR>
            </Canvas>
          </main>
        </>
      )}
    </div>
  );
}