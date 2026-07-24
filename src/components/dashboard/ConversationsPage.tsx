"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import {
  Bot,
  MessageSquare,
  Search,
  Mail,
  Phone,
  MapPin,
  Clock,
  Monitor,
  User,
} from "lucide-react";

export default function ConversationsPage() {
  const { chatbots, conversations, activeChatbotId, deleteConversation } = useStore();
  const bot = chatbots.find((b) => b.id === activeChatbotId);

  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  if (!bot) {
    return (
      <div className="cf-page cf-empty-page">
        <MessageSquare size={48} />
        <h2>No chatbot selected</h2>
        <p>Select or create a chatbot to view conversations.</p>
      </div>
    );
  }

  const botConvs = conversations
    .filter((c) => c.chatbotId === bot.id)
    .filter((c) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      if (c.lead?.name?.toLowerCase().includes(q)) return true;
      if (c.lead?.email?.toLowerCase().includes(q)) return true;
      if (c.messages.some((m) => m.text.toLowerCase().includes(q))) return true;
      return false;
    })
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  const selectedConv = conversations.find((c) => c.id === selectedConvId);

  const handleExportConv = () => {
    if (!selectedConv) return;
    const csvRows = [
      ["ID", "Bot ID", "Client ID", "Lead Name", "Lead Email", "Lead Phone", "Location", "Browser", "Timestamp", "Message Sender", "Message Text", "Message Time"],
      ...selectedConv.messages.map((m) => [
        selectedConv.id,
        selectedConv.chatbotId,
        selectedConv.clientId,
        selectedConv.lead?.name || "",
        selectedConv.lead?.email || "",
        selectedConv.lead?.phone || "",
        selectedConv.location,
        selectedConv.browser,
        selectedConv.timestamp,
        m.sender,
        m.text,
        m.timestamp,
      ]),
    ];
    const csvContent = csvRows.map((r) => r.map((c) => `"${String(c || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversation-${selectedConv.id}.csv`;
    a.click();
    a.remove();
  };

  const handleDeleteConv = () => {
    if (!selectedConv || !confirm("Delete this conversation permanently?")) return;
    deleteConversation(selectedConv.id);
    setSelectedConvId(null);
  };

  return (
    <div className="cf-page">
      <div className="cf-page-header">
        <div>
          <h1 className="cf-page-title">Conversations</h1>
          <p className="cf-page-desc">Review all chatbot interactions, captured leads, and conversation logs.</p>
        </div>
        <div className="cf-conv-summary">
          <div className="cf-conv-stat">
            <span className="cf-conv-stat-value">{botConvs.length}</span>
            <span className="cf-conv-stat-label">Total</span>
          </div>
          <div className="cf-conv-stat">
            <span className="cf-conv-stat-value">{botConvs.filter(c => c.lead).length}</span>
            <span className="cf-conv-stat-label">With Leads</span>
          </div>
        </div>
      </div>

      <div className="cf-conv-layout">
        {/* Conversation list */}
        <div className="cf-conv-list-panel">
          <div className="cf-conv-search">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="cf-conv-list">
            {botConvs.length === 0 ? (
              <div className="cf-conv-empty">
                <MessageSquare size={28} />
                <p>No conversations recorded yet.</p>
                <span>Test the chatbot in the Playground to generate conversations.</span>
              </div>
            ) : (
              botConvs.map((conv) => (
                <div
                  key={conv.id}
                  className={`cf-conv-item ${conv.id === selectedConvId ? "active" : ""}`}
                  onClick={() => setSelectedConvId(conv.id)}
                >
                  <div className="cf-conv-item-top">
                    <div className="cf-conv-item-name">
                      {conv.lead ? (
                        <><User size={13} /> {conv.lead.name}</>
                      ) : (
                        <><Monitor size={13} /> Anonymous</>
                      )}
                    </div>
                    <span className="cf-conv-item-time">
                      <Clock size={11} /> {conv.timestamp}
                    </span>
                  </div>
                  <div className="cf-conv-item-preview">
                    {conv.messages[conv.messages.length - 1]?.text.slice(0, 80)}...
                  </div>
                  <div className="cf-conv-item-meta">
                    <span>{conv.messages.length} messages</span>
                    {conv.lead && <span className="cf-lead-badge">Lead</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Conversation detail */}
        <div className="cf-conv-detail-panel">
          {!selectedConv ? (
            <div className="cf-conv-detail-empty">
              <MessageSquare size={36} />
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the list to view its full message history.</p>
            </div>
          ) : (
            <>
              {/* Lead info */}
              {selectedConv.lead && (
                <div className="cf-conv-lead-card">
                  <h4>Captured Lead</h4>
                  <div className="cf-conv-lead-details">
                    {selectedConv.lead.name && (
                      <div className="cf-conv-lead-row">
                        <User size={14} />
                        <span>{selectedConv.lead.name}</span>
                      </div>
                    )}
                    {selectedConv.lead.email && (
                      <div className="cf-conv-lead-row">
                        <Mail size={14} />
                        <span>{selectedConv.lead.email}</span>
                      </div>
                    )}
                    {selectedConv.lead.phone && (
                      <div className="cf-conv-lead-row">
                        <Phone size={14} />
                        <span>{selectedConv.lead.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="cf-conv-messages">
                <div className="cf-conv-messages-header">
                  <span className="cf-conv-session-info">
                    <MapPin size={13} /> {selectedConv.location}
                    <span className="cf-conv-sep">·</span>
                    <Monitor size={13} /> {selectedConv.browser}
                  </span>
                  <span className="cf-conv-time-info">
                    <Clock size={13} /> {selectedConv.timestamp}
                  </span>
                  <div className="cf-conv-actions">
                    <button onClick={handleExportConv} className="cf-btn-ghost" title="Export CSV">Export</button>
                    <button onClick={handleDeleteConv} className="cf-btn-ghost" title="Delete">Delete</button>
                  </div>
                </div>

                <div className="cf-conv-msg-list">
                  {selectedConv.messages.map((msg) => (
                    <div key={msg.id} className={`cf-conv-msg ${msg.sender}`}>
                      <div className="cf-conv-msg-sender">
                        {msg.sender === "bot" ? (
                          <span className="cf-conv-sender-bot"><Bot size={12} /> {bot.name}</span>
                        ) : (
                          <span className="cf-conv-sender-user"><User size={12} /> Visitor</span>
                        )}
                        <span className="cf-conv-msg-time">{msg.timestamp}</span>
                      </div>
                      <div className="cf-conv-msg-bubble">
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
