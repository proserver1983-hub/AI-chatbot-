"use client";

import React, { useState } from "react";
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
  ArrowRight,
  Shield,
  Box,
  FolderOpen,
} from "lucide-react";

export default function HandoverPage() {
  const { currentUser, chatbots, conversations, activeChatbotId, updateClientProfile } = useStore();
  const bot = chatbots.find((b) => b.id === activeChatbotId);
  const [packaging, setPackaging] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handleTriggerHandover = async () => {
    setPackaging(true);
    try {
      const currentLeads = conversations
        .filter((c) => c.chatbotId === bot.id && c.lead !== null)
        .map((c) => ({ id: c.id, ...c.lead }));
      const currentConversations = conversations.filter((c) => c.chatbotId === bot.id);

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
        faqs: bot.faqs,
        leads: currentLeads,
        conversations: currentConversations,
      };

      const response = await fetch("/api/admin/ownership-transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `${currentUser.companyName.replace(/[^a-zA-Z0-9]/g, "_")}_ChatFlow_Handover.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setSuccess(true);

        updateClientProfile(currentUser.id, {
          subscription: {
            ...currentUser.subscription,
            plan: "Full Ownership",
            status: "Completed",
            supportStatus: "Full Support Handed Over",
          },
        });
      } else {
        alert("Failed to build handover package. Server responded with error.");
      }
    } catch (err) {
      console.error(err);
      alert("Error packaging handover files.");
    } finally {
      setPackaging(false);
    }
  };

  const zipName = `${currentUser.companyName.replace(/[^a-zA-Z0-9]/g, "_")}_ChatFlow_Handover.zip`;

  const packageContents = [
    { icon: <Code size={16} />, name: "Source-Code.zip", desc: "Full standalone Next.js app, API routes, and dependencies" },
    { icon: <FileText size={16} />, name: "Widget-Code.txt", desc: "Custom integration keys and embed tag setup" },
    { icon: <Database size={16} />, name: "Database-Export.sql", desc: "PostgreSQL dump with clients, FAQs, and conversation data" },
    { icon: <BookOpen size={16} />, name: "Setup-Guide.pdf", desc: "Local deployment and configuration instructions" },
    { icon: <FileCheck size={16} />, name: "Documentation.pdf", desc: "Architecture docs and visual configuration guide" },
    { icon: <Shield size={16} />, name: "Ownership-Agreement.pdf", desc: "Legal copyright transfer agreement" },
  ];

  return (
    <div className="cf-page">
      <div className="cf-page-header">
        <div>
          <h1 className="cf-page-title">Ownership Transfer</h1>
          <p className="cf-page-desc">
            Transfer full source code and data ownership. Self-host your chatbot with zero recurring platform costs.
          </p>
        </div>
      </div>

      {/* Transfer banner */}
      <div className="cf-handover-banner">
        <div className="cf-handover-banner-icon">
          <Lock size={24} />
        </div>
        <div className="cf-handover-banner-body">
          <h3>Full Code Ownership Handover</h3>
          <p>
            Triggering the transfer compiles a complete commercial bundle named{" "}
            <code className="cf-handover-filename">{zipName}</code> containing everything needed
            to decouple from our SaaS platform and self-host independently.
          </p>
        </div>
      </div>

      <div className="cf-handover-layout">
        {/* Package contents */}
        <div className="cf-handover-contents-card">
          <div className="cf-handover-contents-header">
            <FolderOpen size={18} />
            <h3>Package Contents</h3>
          </div>
          <div className="cf-handover-file-tree">
            <div className="cf-handover-root-file">
              <Box size={16} />
              <span>{zipName}</span>
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
        </div>

        {/* Transfer action */}
        <div className="cf-handover-action-card">
          <div className="cf-handover-action-header">
            <Download size={20} />
            <h3>Compile & Download</h3>
          </div>
          <p className="cf-handover-action-desc">
            Clicking the button below will compile your active configurations, fetch recent captured leads,
            generate database structures, and package all transfer documents into a downloadable ZIP file.
          </p>

          {success && (
            <div className="cf-handover-success">
              <Check size={16} />
              <span>Transfer bundle compiled and downloaded successfully. System status updated.</span>
            </div>
          )}

          <button
            className="cf-handover-trigger-btn"
            onClick={handleTriggerHandover}
            disabled={packaging}
          >
            {packaging ? (
              <>
                <div className="cf-spinner" />
                <span>Compiling Assets...</span>
              </>
            ) : (
              <>
                <Download size={16} />
                <span>Initiate Full Ownership Transfer</span>
              </>
            )}
          </button>

          <p className="cf-handover-note">
            <AlertCircle size={13} />
            This action updates your subscription status to "Full Ownership" and "Completed".
          </p>
        </div>
      </div>
    </div>
  );
}
