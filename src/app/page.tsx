import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div style={{ 
          padding: "5rem 4rem", 
          maxWidth: "850px", 
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 30px 60px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          borderRadius: "32px",
          position: "relative",
          zIndex: 10
        }} className="animate-fade-in">
          <h1 className={styles.title}>
            Architect Your <br />
            <span className="text-gradient">Total Sensory Reality</span>
          </h1>
          <p className={styles.description}>
            Yenege translates abstract visions into unforgettable events and travel experiences using
            advanced Psychological Preference Mapping and WebXR.
          </p>
          <div className={styles.actions}>
            <Link href="/ppm">
              <button className="btn btn-primary" style={{ marginRight: '1rem' }}>
                Begin Discovery
              </button>
            </Link>
            <Link href="/ar-preview">
              <button className="btn btn-outline">
                Enter Atmosphere
              </button>
            </Link>
          </div>
          <div style={{ marginTop: "3rem" }}>
            <Link href="/saved-designs" style={{ textDecoration: 'none' }}>
              <span style={{ 
                color: '#a1a1aa', 
                fontSize: '0.9rem', 
                borderBottom: '1px solid rgba(255,255,255,0.2)',
                paddingBottom: '2px',
                fontWeight: '500'
              }}>
                View Your Saved Designs →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative blurred auric elements */}
      <div className={styles.auraGold}></div>
      <div className={styles.auraCoral}></div>
    </main>
  );
}
