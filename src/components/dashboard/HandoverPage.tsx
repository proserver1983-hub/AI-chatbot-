"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import {
  Package,
  Download,
  FileText,
  Database,
  Code,
  BookOpen,
  FileCheck,
  Lock,
  Check,
  AlertCircle,
  Shield,
  Box,
  FolderOpen,
  Loader2,
  Crown,
} from "lucide-react";

interface PackageItem {
  icon: React.ReactNode;
  name: string;
  desc: string;
}

export default function HandoverPage() {
  const { currentUser, chatbots, conversations, activeChatbotId, startOwnershipTransfer } = useStore();
  const bot = chatbots.find((b) => b.id === activeChatbotId);
  const [packaging, setPackaging] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const botConversations = useMemo(() => {
    if (!bot) return [];
    return conversations.filter((c) => c.chatbotId === bot.id);
  }, [conversations, bot]);

  const botLeads = useMemo(() => {
    return botConversations
      .filter((c) => c.lead && (c.lead.email || c.lead.phone || c.lead.name))
      .map((c) => ({
        id: c.id,
        conversationId: c.id,
        name: c.lead?.name || "",
        email: c.lead?.email || "",
        phone: c.lead?.phone || "",
        createdAt: c.timestamp,
      }));
  }, [botConversations]);

  if (!currentUser) return null;

  if (!bot) {
    return (
      <div className="cf-page cf-empty-page">
        <Package size={48} />
        <h2>No chatbot selected</h2>
        <p>Select a chatbot to initiate the ownership transfer process.</p>
      </div>
    );
  }

  const safeFileName = `${currentUser.companyName.replace(/[^a-zA-Z0-9]/g, "_")}_ChatFlow_Handover.zip`;

  const handleTriggerHandover = async () => {
    setPackaging(true);
    setError(null);
    setSuccess(false);
    try {
      const requestBody = {
        clientId: currentUser.id,
        clientName: currentUser.name,
        companyName: currentUser.companyName,
        botId: bot.id,
        botName: bot.name,
        brandColor: bot.brandColor,
        welcomeMessage: bot.welcomeMessage,
        personality: bot.personality,
        businessInfo: bot.businessInfo,
        language: bot.language,
        avatar: bot.avatar,
        faqs: bot.faqs,
        urls: bot.urls,
        pdfs: bot.pdfs,
        leads: botLeads,
        conversations: botConversations.map((c) => ({
          id: c.id,
          browser: c.browser,
          location: c.location,
          timestamp: c.timestamp,
          lead: c.lead,
          messages: c.messages,
        })),
      };

      const response = await fetch("/api/admin/ownership-transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with ${response.status}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) throw new Error("Empty bundle received from server");

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = safeFileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setSuccess(true);
      // Use dedicated store method for consistency
      startOwnershipTransfer(currentUser.id);
    } catch (err) {
      console.error("Handover packaging failed", err);
      setError(err instanceof Error ? err.message : "Error packaging handover files.");
    } finally {
      setPackaging(false);
    }
  };

  const packageContents: PackageItem[] = [
    { icon: <Code size={16} />, name: "Source-Code.zip", desc: "Full standalone Next.js app, API routes, dependencies & widget" },
    { icon: <FileText size={16} />, name: "Widget-Code.txt", desc: "Custom embed tag + integration guide for WordPress/Webflow/etc" },
    { icon: <Database size={16} />, name: "Database-Export.sql", desc: "PostgreSQL schema + INSERTs for clients, chatbots, FAQs, leads, conversations" },
    { icon: <BookOpen size={16} />, name: "Setup-Guide.pdf", desc: "Local deployment, Vercel, Docker, env vars, troubleshooting" },
    { icon: <FileCheck size={16} />, name: "Documentation.pdf", desc: "Architecture, API, widget lifecycle, RAG prompt design" },
    { icon: <Shield size={16} />, name: "Ownership-Agreement.pdf", desc: "Legal IP transfer, copyright, 30-day handover support clause" },
  ];

  const isAlreadyTransferred = currentUser.subscription.plan === "Full Ownership" && currentUser.subscription.status === "Completed";

  return (
    <div className="cf-page">
      <div className="cf-page-header">
        <div>
          <h1 className="cf-page-title">Ownership Transfer</h1>
          <p className="cf-page-desc">Transfer full source code and data ownership. Self-host your chatbot with zero recurring platform costs.</p>
        </div>
        {isAlreadyTransferred && (
          <div className="cf-handover-badge completed">
            <Crown size={14} /> Completed — Full Ownership Handed Over
          </div>
        )}
      </div>

      {/* Transfer banner */}
      <div className="cf-handover-banner">
        <div className="cf-handover-banner-icon">
          <Lock size={24} />
        </div>
        <div className="cf-handover-banner-body">
          <h3>Full Code Ownership Handover — {bot.name}</h3>
          <p>
            Triggering the transfer compiles a complete commercial bundle named <code className="cf-handover-filename">{safeFileName}</code> containing
            everything needed to decouple from our SaaS platform and self-host independently. Includes {botLeads.length} captured leads and{" "}
            {botConversations.length} conversations.
          </p>
        </div>
      </div>

      {error && (
        <div className="cf-handover-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="cf-handover-success">
          <Check size={16} />
          <span>
            Transfer bundle compiled and downloaded successfully. Client status updated to <strong>Full Ownership — Completed</strong>. The ZIP contains your standalone
            source, DB export, and legal agreement.
          </span>
        </div>
      )}

      <div className="cf-handover-layout">
        {/* Package contents */}
        <div className="cf-handover-contents-card">
          <div className="cf-handover-contents-header">
            <FolderOpen size={18} />
            <h3>Package Contents</h3>
            <span className="cf-handover-count">{packageContents.length} files</span>
          </div>
          <div className="cf-handover-file-tree">
            <div className="cf-handover-root-file">
              <Box size={16} />
              <span>{safeFileName}</span>
              <span className="cf-handover-meta">
                {bot.faqs.length} FAQs • {botLeads.length} leads • {botConversations.length} convs
              </span>
            </div>
            <div className="cf-handover-files-list">
              {packageContents.map((item, idx) => (
                <div key={idx} className="cf-handover-file-item">
                  <div className="cf-handover-file-icon">{item.icon}</div>
                  <div className="cf-handover-file-info">
                    <span className="cf-handover-file-name">{item.name}</span>
                    <span className="cf-handover-file-desc">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cf-handover-client-summary">
            <h4>Current Bundle Data</h4>
            <ul>
              <li>
                <strong>Client:</strong> {currentUser.name} ({currentUser.email})
              </li>
              <li>
                <strong>Company:</strong> {currentUser.companyName}
              </li>
              <li>
                <strong>Chatbot:</strong> {bot.name} — {bot.avatar} — {bot.brandColor}
              </li>
              <li>
                <strong>Knowledge:</strong> {bot.faqs.length} FAQs, {bot.pdfs.length} PDFs, {bot.urls.length} URLs
              </li>
              <li>
                <strong>Leads:</strong> {botLeads.length} captured
              </li>
              <li>
                <strong>Conversations:</strong> {botConversations.length} sessions
              </li>
            </ul>
          </div>
        </div>

        {/* Transfer action */}
        <div className="cf-handover-action-card">
          <div className="cf-handover-action-header">
            <Download size={20} />
            <h3>Compile & Download</h3>
          </div>
          <p className="cf-handover-action-desc">
            Clicking the button below will compile your active configurations, fetch recent captured leads, generate database structures, and package all transfer
            documents into a downloadable ZIP file. Your subscription status will be set to <strong>Full Ownership — Completed</strong>.
          </p>

          <div className="cf-handover-checklist">
            <div className="cf-check-item">
              <Check size={13} /> Source code with OpenAI integration
            </div>
            <div className="cf-check-item">
              <Check size={13} /> Widget embed code personalized
            </div>
            <div className="cf-check-item">
              <Check size={13} /> Postgres SQL dump (RLS compatible)
            </div>
            <div className="cf-check-item">
              <Check size={13} /> Setup guide + architecture docs
            </div>
            <div className="cf-check-item">
              <Check size={13} /> Legal IP transfer agreement
            </div>
          </div>

          <button className="cf-handover-trigger-btn" onClick={handleTriggerHandover} disabled={packaging} type="button">
            {packaging ? (
              <>
                <Loader2 size={16} className="cf-spin" />
                <span>Compiling Assets...</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>{isAlreadyTransferred ? "Re-Download Ownership Bundle" : "Initiate Full Ownership Transfer"}</span>
              </>
            )}
          </button>

          <p className="cf-handover-note">
            <AlertCircle size={13} />
            This action updates your client record to &quot;Full Ownership&quot; and &quot;Completed&quot;. You can re-download anytime.
          </p>

          <div className="cf-handover-security">
            <Shield size={14} />
            <span>ZIP is generated server-side with JSZip, sanitized inputs, and no temporary disk writes.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
