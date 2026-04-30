import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className="glass-panel animate-fade-in" style={{ padding: "4rem", maxWidth: "800px", textAlign: "center" }}>
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
        </div>
      </div>

      {/* Decorative blurred auric elements */}
      <div className={styles.auraGold}></div>
      <div className={styles.auraCoral}></div>
    </main>
  );
}
