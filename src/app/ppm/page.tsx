"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import styles from "./page.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuraStore } from "../../store/useAuraStore";

export default function PPMInterface() {
  const { messages, sendMessage, setMessages, status } = useChat();

  const [input, setInput] = useState("");
  const [vibe, setVibe] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const setLayoutTheme = useAuraStore((state) => state.setLayoutTheme);

  // New State for Discovery Workflow
  const [discoveryMode, setDiscoveryMode] = useState<'landing' | 'quiz' | 'chat'>('landing');

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState({ occasion: '', mood: '', elements: '' });

  const isLoading = status === "streaming";

  // Generate structured vibe when user clicks generate
  const fetchVibeMapping = async (customMessages = messages) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/vibe-mapper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: customMessages }),
      });

      const data = await response.json();
      console.log("Vibe Generated Data:", data);
      
      setVibe(data);
      setLayoutTheme(data.theme); // Update the global WebXR store
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = `I want to host an event for a ${quizAnswers.occasion}. I'm aiming for a ${quizAnswers.mood || 'custom'} mood, and it must include: ${quizAnswers.elements}.`;
    
    // Add the prompt to the chat and immediately trigger vibe generation
    const quizMessages = [{ id: 'quiz-1', role: 'user', text: prompt }] as any;
    setMessages(quizMessages);
    fetchVibeMapping(quizMessages);
    setDiscoveryMode('chat'); // jump to chat/result view
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage({ text: input });
    setInput("");
  };

  const startChat = () => {
    setMessages([{ 
      id: 'welcome-msg', 
      role: 'assistant', 
      text: "Welcome to Yenege. Let's design your ultimate travel or event experience. What core emotion should your guests feel?" 
    } as any]);
    setDiscoveryMode('chat');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/">
          <button
            className="btn btn-outline"
            style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
          >
            ← Back
          </button>
        </Link>
        <h2 className="text-gradient">
          Discovery AI
        </h2>
        <div style={{ width: "80px" }}></div>
      </header>

      <main className={styles.chatContainer}>
        {discoveryMode === 'landing' && (
          <div className={`glass-panel animate-fade-in`} style={{ padding: '2rem', textAlign: 'center', margin: 'auto', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--accent-coral)' }}>Uncover Your Vibe</h3>
              <p style={{ color: 'var(--text-secondary)' }}>How would you like to begin designing your experience?</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button 
                className="btn btn-outline" 
                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                onClick={() => setDiscoveryMode('quiz')}
              >
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Take a Quiz</span>
                <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>Answer 3 quick questions to instantly generate your layout.</span>
              </button>
              
              <button 
                className="btn btn-primary" 
                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                onClick={startChat}
              >
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'black' }}>Direct Prompt</span>
                <span style={{ fontSize: '0.85rem', opacity: 0.8, color: '#333' }}>Chat directly with our Concierge to hash out the details.</span>
              </button>
            </div>
          </div>
        )}

        {discoveryMode === 'quiz' && (
          <form onSubmit={handleQuizSubmit} className={`glass-panel animate-fade-in`} style={{ padding: '2rem', margin: 'auto', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>Style & Vibe Quiz</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>What is the occasion?</label>
              <input type="text" className={styles.inputField} placeholder="e.g. A hacker meetup, wedding, tech conference" required value={quizAnswers.occasion} onChange={e => setQuizAnswers({...quizAnswers, occasion: e.target.value})} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>What&apos;s the primary mood?</label>
              <select className={styles.inputField} style={{ background: 'var(--glass-bg)', color: 'white' }} required value={quizAnswers.mood} onChange={e => setQuizAnswers({...quizAnswers, mood: e.target.value})}>
                <option value="">Select mood</option>
                <option value="dark and mysterious">Dark & Mysterious</option>
                <option value="bright and ethereal">Bright & Ethereal</option>
                <option value="neon cyberpunk">Neon Cyberpunk</option>
                <option value="minimalist corporate">Minimalist Corporate</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Any must-have elements?</label>
              <input type="text" className={styles.inputField} placeholder="e.g. Lots of plants, dark lighting, a main stage" required value={quizAnswers.elements} onChange={e => setQuizAnswers({...quizAnswers, elements: e.target.value})} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', cursor: 'pointer' }}>Map My Vibe →</button>
          </form>
        )}

        {discoveryMode === 'chat' && (
          <div className={`glass-panel ${styles.chatWindow}`}>
            <div className={styles.messagesArea}>
              {messages.map((msg: UIMessage) => (
                <div
                  key={msg.id}
                  className={`${styles.messageWrapper} ${msg.role === "user"
                      ? styles.userWrapper
                      : styles.aiWrapper
                    }`}
                >
                  <div
                    className={`${styles.message} ${msg.role === "user"
                        ? styles.userMessage
                        : styles.aiMessage
                      }`}
                  >
                    {msg.parts?.map((part, i) => {
                      if (part.type === "text") {
                        return <span key={`${msg.id}-text-${i}`}>{part.text}</span>;
                      }
                      return null;
                    })}
                    {/* Fallback if parts is absent */}
                    {!msg.parts && typeof (msg as any).text === 'string' && (
                       <span>{(msg as any).text}</span>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className={`${styles.messageWrapper} ${styles.aiWrapper}`}>
                  <div
                    className={`${styles.message} ${styles.aiMessage} ${styles.typingIndicator}`}
                  >
                    <span className={styles.dot}></span>
                    <span className={styles.dot}></span>
                    <span className={styles.dot}></span>
                  </div>
                </div>
              )}
              {isGenerating && (
                <div style={{ textAlign: 'center', opacity: 0.7, padding: '1rem', color: 'var(--accent-gold)' }}>
                  Architecting your venue blueprint...
                </div>
              )}
            </div>

            <form className={styles.inputArea} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', width: '100%', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your vision..."
                  className={styles.inputField}
                  style={{ flex: 1 }}
                />
                <button
                  type="submit"
                  className={`btn btn-primary ${styles.sendBtn}`}
                  disabled={isLoading}
                  style={{ cursor: 'pointer' }}
                >
                  Send
                </button>
              </div>
              
              {/* Manual AR Generation Trigger */}
              {messages.length > 1 && !vibe && !isGenerating && (
                 <button 
                   type="button" 
                   onClick={() => fetchVibeMapping()} 
                   className="btn btn-outline" 
                   style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', alignSelf: 'flex-start', cursor: 'pointer', borderColor: 'var(--accent-coral)', color: 'var(--text-primary)' }}
                 >
                   ✨ Im ready, Generate AR Blueprint
                 </button>
              )}
            </form>
          </div>
        )}
      </main>

      <div className={styles.bgGlow}></div>

      {vibe && discoveryMode === 'chat' && (
        <div style={{ position: "fixed", bottom: "2rem", width: "100%", display: "flex", justifyContent: "center", zIndex: 100 }}>
          <div className="glass-panel animate-fade-in" style={{ padding: "1.5rem", textAlign: "center", border: "1px solid var(--accent-coral)" }}>
            <h3 style={{ marginBottom: "0.5rem" }}>Venue Blueprint Generated!</h3>
            <p style={{ marginBottom: "1rem", color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "400px" }}>
              The Yenege AI Architect has mapped your vibe to a <strong style={{color:"var(--accent-gold)"}}>{vibe.theme}</strong> physical venue structure.
            </p>
            <Link href="/ar-preview">
              <button className="btn btn-primary" style={{ width: "100%", fontWeight: "bold", cursor: 'pointer' }}>
                Enter 3D Venue (AR)
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}