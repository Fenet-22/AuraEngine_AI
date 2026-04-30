"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import styles from "./ConciergeWidget.module.css";

import { useAuraStore } from "../store/useAuraStore";

export default function ConciergeWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const setLayoutTheme = useAuraStore((state) => state.setLayoutTheme);

  const { messages, sendMessage, status } = useChat();

  const isLoading = status === "streaming";

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className={styles.widgetContainer}>
      {isOpen && (
        <div className={`glass-panel animate-fade-in ${styles.chatWindow}`}>
          <div className={styles.chatHeader}>
            <div className={styles.pulseDot}></div>
            <span className={styles.headerTitle}>Yenege Concierge</span>
            <button className={styles.closeBtn} onClick={toggleChat}>
              ×
            </button>
          </div>

          <div className={styles.messageList}>
            {messages.map((m: UIMessage) => (
              <div
                key={m.id}
                className={`${styles.messageWrapper} ${m.role === "user" ? styles.userRow : styles.aiRow
                  }`}
              >
                <div
                  className={`${styles.messageBubble} ${m.role === "user"
                      ? styles.userBubble
                      : styles.aiBubble
                    }`}
                >
                  {m.parts?.map((part, i) => {
                    if (part.type === "text") {
                      return <span key={i}>{part.text}</span>;
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className={`${styles.messageWrapper} ${styles.aiRow}`}>
                <div
                  className={`${styles.messageBubble} ${styles.aiBubble} ${styles.typing}`}
                >
                  ...
                </div>
              </div>
            )}
          </div>

          <form className={styles.inputForm} onSubmit={handleSubmit}>
            <input
              type="text"
              className={styles.input}
              placeholder="Ask the concierge..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={isLoading}
            >
              &uarr;
            </button>
          </form>
        </div>
      )}

      {!isOpen && (
        <button
          className={`btn btn-primary ${styles.triggerBtn}`}
          onClick={toggleChat}
        >
          <div className={styles.pulseDot}></div>
          <span className={styles.triggerText}>Concierge</span>
        </button>
      )}
    </div>
  );
}