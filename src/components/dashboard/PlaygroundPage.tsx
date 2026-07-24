"use client";

import React, { useState, useRef, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Send, RotateCcw, Save, Check, Bot, Sparkles } from "lucide-react";

export default function PlaygroundPage() {
  const { chatbots, activeChatbotId, updateChatbotSettings, sendMessage } = useStore();
  const bot = chatbots.find((b) => b.id === activeChatbotId);

  const [name, setName] = useState(bot?.name || "");
  const [avatar, setAvatar] = useState(bot?.avatar || "🤖");
  const [brandColor, setBrandColor] = useState(bot?.brandColor || "#2563eb");
  const [welcomeMessage, setWelcomeMessage] = useState(bot?.welcomeMessage || "");
  const [personality, setPersonality] = useState(bot?.personality || "");
  const [language, setLanguage] = useState(bot?.language || "English");
  const [saved, setSaved] = useState(false);

  // Chat preview state
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "bot"; text: string; timestamp: string }>>(bot ? [{ sender: "bot", text: bot.welcomeMessage, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }] : []);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatConvId, setChatConvId] = useState<string | undefined>(undefined);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

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
    updateChatbotSettings(bot.id, {
      name,
      avatar,
      brandColor,
      welcomeMessage,
      personality,
      language,
      businessInfo: bot.businessInfo,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const text = chatInput;
    setChatInput("");
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChatHistory((prev) => [...prev, { sender: "user", text, timestamp }]);
    setChatLoading(true);
    try {
      const res = await sendMessage(bot.id, text, chatConvId);
      setChatHistory((prev) => [...prev, { sender: "bot", text: res.reply, timestamp }]);
      setChatConvId(res.conversationId);
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  const handleReset = () => {
    setChatConvId(undefined);
    setChatHistory([{
      sender: "bot",
      text: welcomeMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
  };

  const avatarOptions = ["🤖", "✨", "💬", "👑", "💡", "⚡", "🎯", "🔥", "🌟", "🧠"];

  return (
    <div className="cf-playground" key={bot?.id}>
      {/* Left panel - Settings */}
      <div className="cf-playground-settings">
        <div className="cf-panel">
          <div className="cf-panel-header">
            <h2>Bot Configuration</h2>
            <button className={`cf-save-btn ${saved ? "saved" : ""}`} onClick={handleSave}>
              {saved ? <><Check size={14} /> Saved</> : <><Save size={14} /> Save Changes</>}
            </button>
          </div>

          <div className="cf-panel-body">
            {/* Name & Avatar row */}
            <div className="cf-field-row">
              <div className="cf-field">
                <label>Chatbot Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="cf-input"
                />
              </div>
              <div className="cf-field cf-field-sm">
                <label>Avatar</label>
                <div className="cf-avatar-grid">
                  {avatarOptions.map((a) => (
                    <button
                      key={a}
                      className={`cf-avatar-option ${avatar === a ? "selected" : ""}`}
                      onClick={() => setAvatar(a)}
                      type="button"
                    >
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
                </select>
              </div>
              <div className="cf-field">
                <label>Brand Color</label>
                <div className="cf-color-field">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="cf-color-picker"
                  />
                  <input
                    type="text"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="cf-input cf-color-text"
                  />
                </div>
              </div>
            </div>

            {/* Welcome message */}
            <div className="cf-field">
              <label>Welcome Message</label>
              <textarea
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                rows={3}
                className="cf-input cf-textarea"
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
              <h3>{name}</h3>
              <div className="cf-chat-header-status">
                <span className="cf-online-dot" />
                Online
              </div>
            </div>
            <button className="cf-chat-reset" onClick={handleReset} title="Reset conversation">
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
                        title="Regenerate"
                        onClick={async () => {
                          if (chatLoading) return;
                          const prevHistory = chatHistory.slice(0, -1);
                          const userMsg = chatHistory[chatHistory.length - 1];
                          if (!userMsg || userMsg.sender !== "user") return;
                          setChatHistory(prevHistory);
                          setChatLoading(true);
                          try {
                            const res = await sendMessage(bot.id, userMsg.text, chatConvId);
                            setChatHistory((prev) => [...prev, { sender: "bot", text: res.reply, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
                            setChatConvId(res.conversationId);
                          } catch (e) {
                            console.error(e);
                          } finally {
                            setChatLoading(false);
                          }
                        }}
                      >
                        <RotateCcw size={12} />
                      </button>
                      <button
                        className="cf-chat-action-btn"
                        title="Copy response"
                        onClick={() => {
                          navigator.clipboard.writeText(msg.text);
                          alert("Response copied to clipboard!");
                        }}
                      >
                        <Save size={12} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="cf-chat-msg bot">
                <div className="cf-chat-bubble cf-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form className="cf-chat-input-bar" onSubmit={handleSend}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
              className="cf-chat-input"
            />
            <button
              type="submit"
              className="cf-chat-send"
              style={{ background: chatInput.trim() ? brandColor : undefined }}
              disabled={!chatInput.trim()}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
