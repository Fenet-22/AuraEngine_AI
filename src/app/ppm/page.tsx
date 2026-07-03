"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import styles from "./page.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuraStore } from "../../store/useAuraStore";
import { useRouter } from "next/navigation";

export default function PPMInterface() {
  const { messages, sendMessage, setMessages, status } = useChat();

  const [input, setInput] = useState("");
  const setLayoutTheme = useAuraStore((state) => state.setLayoutTheme);
  const router = useRouter();

  // New State for Discovery Workflow
  const [discoveryMode, setDiscoveryMode] = useState<'landing' | 'chat'>('landing');

  const isLoading = status === "streaming";

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateBlueprint = async () => {
    if (messages.length === 0) return;
    setIsGenerating(true);
    
    try {
      // 1. Generate JSON
      const conversation = messages
        .map(
          (m) =>
            (m as any).content ||
            (m as any).text ||
            (Array.isArray(m.parts)
              ? m.parts
                  .filter((p) => p.type === "text")
                  .map((p) => (p as any).text || "")
                  .join("")
              : "")
        )
        .join("\n");

      const genRes = await fetch('/api/generate-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation })
      });
      const genData = await genRes.json();
      console.log(genData);
      
      if (genData.blueprint) {
        // 2. Save JSON
        const saveRes = await fetch('/api/save-blueprint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ blueprint: genData.blueprint, userEmail: "anonymous" })
        });
        const saveData = await saveRes.json();
        
        if (saveData.id) {
          router.push(`/blueprint/${saveData.id}`);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
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
      text: "Welcome to Yenege. I am your AI Event Architect. Describe your dream event, and I will design the perfect blueprint for you." 
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
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--accent-coral)' }}>Start Designing</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Describe your dream event, and instantly receive a complete event design, visualization, and proposal.</p>
            </div>
            
            <button 
              className="btn btn-primary" 
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', cursor: 'pointer', maxWidth: '300px', margin: '0 auto' }}
              onClick={startChat}
            >
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ffffff' }}>Launch AI Architect</span>
            </button>
          </div>
        )}

        {discoveryMode === 'chat' && (
          <div className={`glass-panel ${styles.chatWindow}`}>
            <div className={styles.messagesArea}>
              {messages.map((msg: UIMessage) => {
                const isHiddenPrompt = msg.role === "user" && msg.parts?.some(p => p.type === 'text' && p.text.includes("Please naturally summarize the system result"));
                if (isHiddenPrompt) return null;

                return (
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
                );
              })}

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
                  disabled={isLoading || isGenerating}
                  style={{ cursor: 'pointer' }}
                >
                  Send
                </button>
              </div>
              
              {messages.length > 2 && (
                 <button 
                   type="button" 
                   onClick={handleGenerateBlueprint}
                   disabled={isGenerating || isLoading}
                   className="btn btn-outline" 
                   style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', alignSelf: 'flex-start', cursor: 'pointer', borderColor: 'var(--accent-coral)', color: 'var(--text-primary)' }}
                 >
                   {isGenerating ? "Architecting Blueprint..." : "✨ I'm ready, Generate Event Blueprint"}
                 </button>
              )}
            </form>
          </div>
        )}
      </main>

      <div className={styles.bgGlow}></div>

    </div>
  );
}