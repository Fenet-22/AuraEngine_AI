"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuraStore } from '../../store/useAuraStore';
import styles from './page.module.css';
import Link from 'next/link';

export default function AuthPage() {
  const router = useRouter();
  const login = useAuraStore(state => state.login);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    dietaryAllergies: '',
    professionalInterests: '',
    technicalSkills: ''
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isLogin ? 'login' : 'signup',
          ...formData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      
      login(data.user);
      router.push('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/">
          <button className="btn btn-outline" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
            ← Back
          </button>
        </Link>
        <h2 className="text-gradient">AuraEngine Identity</h2>
        <div style={{ width: "80px" }}></div>
      </header>

      <main className={styles.main}>
        <div className={`glass-panel animate-fade-in ${styles.formCard}`}>
          <h1 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>
            {isLogin ? 'Welcome Back' : 'Create Your Profile'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>
            {isLogin 
              ? 'Enter your credentials to connect to the venue network.' 
              : 'Provide your details to enable hyper-personalization.'}
          </p>

          {error && (
            <div style={{ background: 'rgba(255, 107, 107, 0.1)', border: '1px solid var(--accent-coral)', color: 'var(--accent-coral)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input 
                type="email" 
                required 
                className={styles.input} 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {!isLogin && (
              <>
                <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    required 
                    className={styles.input} 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Dietary Restrictions / Allergies</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Peanuts, Gluten-free"
                    className={styles.input} 
                    value={formData.dietaryAllergies}
                    onChange={e => setFormData({...formData, dietaryAllergies: e.target.value})}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Professional Interests</label>
                  <input 
                    type="text" 
                    placeholder="e.g. AI, Web3, FinTech"
                    className={styles.input} 
                    value={formData.professionalInterests}
                    onChange={e => setFormData({...formData, professionalInterests: e.target.value})}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Technical Skills</label>
                  <input 
                    type="text" 
                    placeholder="e.g. React, Python, Three.js"
                    className={styles.input} 
                    value={formData.technicalSkills}
                    onChange={e => setFormData({...formData, technicalSkills: e.target.value})}
                  />
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ marginTop: '1rem' }}>
              {isLoading ? 'Connecting...' : (isLogin ? 'Login to Network' : 'Initialize Profile')}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              {isLogin ? "Don't have a profile yet? " : "Already initialized? "}
            </span>
            <button 
              type="button" 
              onClick={() => setIsLogin(!isLogin)}
              style={{ background: 'none', border: 'none', color: 'var(--accent-coral)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
