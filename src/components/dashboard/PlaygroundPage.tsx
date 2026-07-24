"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useStore } from "@/lib/store";
import { Send, RotateCcw, Save, Check, Bot, Sparkles, Copy, RefreshCw } from "lucide-react";

interface PreviewMsg {
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export default function PlaygroundPage() {
  const { chatbots, activeChatbotId, updateChatbotSettings, sendMessage } = useStore();
  const bot = chatbots.find((b) => b.id === activeChatbotId);

  // --- Form state synced from bot
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🤖");
  const [brandColor, setBrandColor] = useState("#6366f1");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [personality, setPersonality] = useState("");
  const [language, setLanguage] = useState("English");
  const [businessInfo, setBusinessInfo] = useState("");
  const [saved, setSaved] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // --- Chat preview
  const [chatHistory, setChatHistory] = useState<PreviewMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatConvId, setChatConvId] = useState<string | undefined>(undefined);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync form fields when bot changes (fixes stale state bug)
  useEffect(() => {
    if (!bot) return;
    setName(bot.name);
    setAvatar(bot.avatar);
    setBrandColor(bot.brandColor);
    setWelcomeMessage(bot.welcomeMessage);
    setPersonality(bot.personality);
    setLanguage(bot.language);
    setBusinessInfo(bot.businessInfo);
    setChatHistory([
      {
        sender: "bot",
        text: bot.welcomeMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setChatConvId(undefined);
  }, [bot?.id]); // only on bot id change

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, chatLoading]);

  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => setSaved(false), 2500);
      return () => clearTimeout(t);
    }
  }, [saved]);

  useEffect(() => {
    if (copiedIdx !== null) {
      const t = setTimeout(() => setCopiedIdx(null), 2000);
      return () => clearTimeout(t);
    }
  }, [copiedIdx]);

  if (!bot) {
    return (
      <div className="cf-page cf-empty-page">
        <Bot size={48} />
        <h2>No chatbot selected</h2>
        <p>Select or create a chatbot from the sidebar to start editing.</p>
      </div>
    );
  }

  const handleSave = () => {
    // validate color
    const isHex = /^#[0-9A-Fa-f]{6}$/.test(brandColor);
    if (!isHex) {
      alert("Brand color must be a valid HEX code, e.g. #6366f1");
      return;
    }
    updateChatbotSettings(bot.id, {
      name: name.trim() || bot.name,
      avatar,
      brandColor,
      welcomeMessage: welcomeMessage.trim() || bot.welcomeMessage,
      personality: personality.trim(),
      language,
      businessInfo: businessInfo.trim(),
    });
    setSaved(true);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const text = chatInput.trim();
    setChatInput("");
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChatHistory((prev) => [...prev, { sender: "user", text, timestamp }]);
    setChatLoading(true);
    try {
      const res = await sendMessage(bot.id, text, chatConvId);
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: res.reply, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ]);
      setChatConvId(res.conversationId);
    } catch (err) {
      console.error("Playground send failed", err);
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry — something went wrong sending that message. Please try again.", timestamp },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleReset = () => {
    setChatConvId(undefined);
    setChatHistory([
      {
        sender: "bot",
        text: welcomeMessage || bot.welcomeMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const handleRegenerate = useCallback(
    async (botAnswerIdx: number) => {
      if (chatLoading) return;
      // Find the last user message before this bot answer
      let lastUserIdx = -1;
      for (let i = botAnswerIdx - 1; i >= 0; i--) {
        if (chatHistory[i].sender === "user") {
          lastUserIdx = i;
          break;
        }
      }
      if (lastUserIdx === -1) return;
      const userMsg = chatHistory[lastUserIdx];
      // Remove this bot answer and any trailing messages after it
      setChatHistory((prev) => prev.slice(0, botAnswerIdx));
      setChatLoading(true);
      try {
        const res = await sendMessage(bot.id, userMsg.text, chatConvId);
        setChatHistory((prev) => [
          ...prev,
          { sender: "bot", text: res.reply, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
        ]);
        setChatConvId(res.conversationId);
      } catch (e) {
        console.error(e);
      } finally {
        setChatLoading(false);
      }
    },
    [chatHistory, chatLoading, bot.id, chatConvId, sendMessage]
  );

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      setCopiedIdx(idx);
    }
  };

  const avatarOptions = ["🤖", "✨", "💬", "👑", "💡", "⚡", "🎯", "🔥", "🌟", "🧠", "🚀", "💎"];

  return (
    <div className="cf-playground" key={bot.id}>
      {/* Left panel - Settings */}
      <div className="cf-playground-settings">
        <div className="cf-panel">
          <div className="cf-panel-header">
            <h2>Bot Configuration</h2>
            <button className={`cf-save-btn ${saved ? "saved" : ""}`} onClick={handleSave} type="button">
              {saved ? (
                <>
                  <Check size={14} /> Saved
                </>
              ) : (
                <>
                  <Save size={14} /> Save Changes
                </>
              )}
            </button>
          </div>

          <div className="cf-panel-body">
            {/* Name & Avatar */}
            <div className="cf-field-row">
              <div className="cf-field">
                <label>Chatbot Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="cf-input" placeholder="e.g. ApexBot" />
              </div>
              <div className="cf-field cf-field-sm">
                <label>Avatar</label>
                <div className="cf-avatar-grid">
                  {avatarOptions.map((a) => (
                    <button key={a} className={`cf-avatar-option ${avatar === a ? "selected" : ""}`} onClick={() => setAvatar(a)} type="button">
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Language & Color */}
            <div className="cf-field-row">
              <div className="cf-field">
                <label>Language</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="cf-input">
                  <option value="English">English</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                  <option value="German">German (Deutsch)</option>
                  <option value="Japanese">Japanese (日本語)</option>
                  <option value="Arabic">Arabic (العربية)</option>
                </select>
              </div>
              <div className="cf-field">
                <label>Brand Color</label>
                <div className="cf-color-field">
                  <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="cf-color-picker" />
                  <input type="text" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="cf-input cf-color-text" placeholder="#6366f1" />
                </div>
              </div>
            </div>

            {/* Welcome message */}
            <div className="cf-field">
              <label>Welcome Message</label>
              <textarea value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} rows={3} className="cf-input cf-textarea" placeholder="First message visitors see..." />
            </div>

            {/* Business Info */}
            <div className="cf-field">
              <label>Business Info / System Context</label>
              <textarea
                value={businessInfo}
                onChange={(e) => setBusinessInfo(e.target.value)}
                rows={4}
                className="cf-input cf-textarea"
                placeholder="Describe your company, products, pricing, support hours, etc. This is used as RAG context."
              />
            </div>

            {/* Personality */}
            <div className="cf-field">
              <label>
                <Sparkles size={13} className="cf-label-icon" />
                AI Personality & Instructions
              </label>
              <textarea
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                rows={5}
                className="cf-input cf-textarea"
                placeholder="Define the tone, style, and behavioral guidelines for your chatbot..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Chat preview */}
      <div className="cf-playground-preview">
        <div className="cf-chat-preview-container">
          <div className="cf-chat-header" style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}cc 100%)` }}>
            <div className="cf-chat-header-avatar">{avatar}</div>
            <div className="cf-chat-header-info">
              <h3>{name || bot.name}</h3>
              <div className="cf-chat-header-status">
                <span className="cf-online-dot" />
                Online
              </div>
            </div>
            <button className="cf-chat-reset" onClick={handleReset} title="Reset conversation" type="button">
              <RotateCcw size={15} />
            </button>
          </div>

          <div className="cf-chat-messages">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`cf-chat-msg ${msg.sender}`}>
                <div className="cf-chat-bubble" style={msg.sender === "user" ? { background: brandColor } : {}}>
                  {msg.text}
                </div>
                <div className="cf-chat-msg-actions">
                  <span className="cf-chat-time">{msg.timestamp}</span>
                  {msg.sender === "bot" && (
                    <>
                      <button
                        className="cf-chat-action-btn"
                        title="Regenerate response"
                        type="button"
                        onClick={() => handleRegenerate(idx)}
                        disabled={chatLoading}
                      >
                        <RefreshCw size={12} />
                      </button>
                      <button
                        className="cf-chat-action-btn"
                        title={copiedIdx === idx ? "Copied!" : "Copy response"}
                        type="button"
                        onClick={() => handleCopy(msg.text, idx)}
                      >
                        {copiedIdx === idx ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="cf-chat-msg bot">
                <div className="cf-chat-bubble cf-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form className="cf-chat-input-bar" onSubmit={handleSend}>
            <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a message..." className="cf-chat-input" disabled={chatLoading} />
            <button type="submit" className="cf-chat-send" style={{ background: chatInput.trim() ? brandColor : undefined }} disabled={!chatInput.trim() || chatLoading}>
              <Send size={16} />
            </button>
          </form>
        </div>
        <div className="cf-preview-hint">
          Preview uses live store logic: brand color, avatar, and API with conversation memory. Save changes to persist.
        </div>
      </div>
    </div>
  );
}
