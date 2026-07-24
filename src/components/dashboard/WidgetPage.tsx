"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import {
  Code,
  Copy,
  Check,
  Puzzle,
  Smartphone,
  Monitor,
  ExternalLink,
  MessageCircle,
  Palette,
} from "lucide-react";

export default function WidgetPage() {
  const { chatbots, activeChatbotId } = useStore();
  const bot = chatbots.find((b) => b.id === activeChatbotId);
  const [copied, setCopied] = useState(false);
  const [activeDevice, setActiveDevice] = useState<"desktop" | "mobile">("desktop");

  if (!bot) {
    return (
      <div className="cf-page cf-empty-page">
        <Puzzle size={48} />
        <h2>No chatbot selected</h2>
        <p>Select or create a chatbot to generate the embed widget code.</p>
      </div>
    );
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "https://chatflow-ai.vercel.app";
  const embedCode = `<script src="${origin}/chatflow-widget.js" bot-id="${bot.id}"></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="cf-page">
      <div className="cf-page-header">
        <div>
          <h1 className="cf-page-title">Widget Builder</h1>
          <p className="cf-page-desc">Embed your chatbot on any website with a single script tag.</p>
        </div>
      </div>

      <div className="cf-widget-layout">
        {/* Embed code section */}
        <div className="cf-widget-code-panel">
          <div className="cf-widget-section-header">
            <Code size={18} />
            <h3>Embed Code</h3>
          </div>
          <p className="cf-widget-desc">
            Paste this script tag just before the closing <code>&lt;/body&gt;</code> tag on your website. No additional CSS or frameworks required.
          </p>

          <div className="cf-code-block">
            <div className="cf-code-block-header">
              <span className="cf-code-block-lang">HTML</span>
              <button className={`cf-code-copy-btn ${copied ? "copied" : ""}`} onClick={handleCopy}>
                {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy Code</>}
              </button>
            </div>
            <pre className="cf-code-content">
              <code>{embedCode}</code>
            </pre>
          </div>

          {/* Steps */}
          <div className="cf-widget-steps">
            <h4>Integration Steps</h4>
            <div className="cf-step">
              <div className="cf-step-number">1</div>
              <div className="cf-step-content">
                <strong>Copy the embed code</strong>
                <p>Click the copy button above to copy the script tag to your clipboard.</p>
              </div>
            </div>
            <div className="cf-step">
              <div className="cf-step-number">2</div>
              <div className="cf-step-content">
                <strong>Paste into your website</strong>
                <p>Open your HTML file and paste the code right before the closing body tag.</p>
              </div>
            </div>
            <div className="cf-step">
              <div className="cf-step-number">3</div>
              <div className="cf-step-content">
                <strong>Deploy and test</strong>
                <p>The chat widget appears automatically in the bottom-right corner of your site.</p>
              </div>
            </div>
          </div>

          {/* Platform badges */}
          <div className="cf-platform-support">
            <h4>Compatible Platforms</h4>
            <div className="cf-platform-badges">
              {["WordPress", "Webflow", "Shopify", "Wix", "React", "HTML/CSS"].map((platform) => (
                <span key={platform} className="cf-platform-badge">{platform}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Preview section */}
        <div className="cf-widget-preview-panel">
          <div className="cf-widget-preview-header">
            <span>Live Preview</span>
            <div className="cf-device-toggle">
              <button
                className={activeDevice === "desktop" ? "active" : ""}
                onClick={() => setActiveDevice("desktop")}
              >
                <Monitor size={15} />
              </button>
              <button
                className={activeDevice === "mobile" ? "active" : ""}
                onClick={() => setActiveDevice("mobile")}
              >
                <Smartphone size={15} />
              </button>
            </div>
          </div>

          <div className={`cf-preview-device ${activeDevice}`}>
            <div className="cf-preview-browser-bar">
              <div className="cf-preview-dots">
                <span /><span /><span />
              </div>
              <div className="cf-preview-url">
                <span>https://</span>your-website.com
              </div>
            </div>
            <div className="cf-preview-content">
              <div className="cf-preview-page-content">
                <div className="cf-preview-nav" />
                <div className="cf-preview-hero">
                  <div className="cf-preview-hero-line w80" />
                  <div className="cf-preview-hero-line w60" />
                  <div className="cf-preview-hero-line w40" />
                </div>
                <div className="cf-preview-cards">
                  <div className="cf-preview-card" /><div className="cf-preview-card" /><div className="cf-preview-card" />
                </div>
              </div>

              {/* Chat widget bubble */}
              <div className="cf-preview-widget">
                <div className="cf-preview-widget-bubble" style={{ background: bot.brandColor }}>
                  <MessageCircle size={22} color="white" />
                </div>
              </div>
            </div>
          </div>

          {/* Widget info */}
          <div className="cf-preview-info">
            <div className="cf-preview-info-row">
              <Palette size={14} />
              <span>Brand color: <strong>{bot.brandColor}</strong></span>
            </div>
            <div className="cf-preview-info-row">
              <MessageCircle size={14} />
              <span>Bot: <strong>{bot.name}</strong></span>
            </div>
            <div className="cf-preview-info-row">
              <ExternalLink size={14} />
              <span>Position: <strong>Bottom Right</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
