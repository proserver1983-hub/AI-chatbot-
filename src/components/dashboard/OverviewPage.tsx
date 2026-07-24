"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import type { DashboardView } from "./Sidebar";
import {
  Plus,
  Search,
  Pencil,
  Copy,
  Trash2,
  Bot,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Clock,
} from "lucide-react";

interface OverviewPageProps {
  onNavigate: (view: DashboardView) => void;
}

export default function OverviewPage({ onNavigate }: OverviewPageProps) {
  const {
    currentUser,
    chatbots,
    conversations,
    activeChatbotId,
    setActiveChatbotId,
    addChatbot,
    duplicateChatbot,
    deleteChatbot,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [newBotName, setNewBotName] = useState("");
  const [showForm, setShowForm] = useState(false);

  if (!currentUser) return null;

  const clientBots = chatbots.filter((b) => b.clientId === currentUser.id);
  const filteredBots = clientBots.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBotName.trim()) return;
    const bot = addChatbot(currentUser.id, newBotName);
    setActiveChatbotId(bot.id);
    setNewBotName("");
    setShowForm(false);
  };

  // Aggregate stats
  const totalMessages = conversations
    .filter((c) => clientBots.some((b) => b.id === c.chatbotId))
    .reduce((sum, c) => sum + c.messages.length, 0);
  const totalLeads = conversations
    .filter((c) => clientBots.some((b) => b.id === c.chatbotId) && c.lead !== null).length;

  return (
    <div className="cf-page">
      {/* Hero Section */}
      <div className="cf-page-hero">
        <div className="cf-hero-text">
          <span className="cf-hero-badge">
            <Sparkles size={13} />
            {currentUser.companyName} Workspace
          </span>
          <h1 className="cf-hero-title">Welcome back, {currentUser.name.split(" ")[0]}</h1>
          <p className="cf-hero-sub">
            Manage your AI chatbots, train them on your knowledge base, and deploy across all your channels.
          </p>
        </div>
        <button className="cf-hero-cta" onClick={() => setShowForm(true)}>
          <Plus size={16} />
          Create Chatbot
        </button>
      </div>

      {/* Stats */}
      <div className="cf-stats-row">
        <div className="cf-stat-card">
          <div className="cf-stat-icon blue">
            <Bot size={18} />
          </div>
          <div className="cf-stat-body">
            <span className="cf-stat-value">{clientBots.length}</span>
            <span className="cf-stat-label">Active Chatbots</span>
          </div>
        </div>
        <div className="cf-stat-card">
          <div className="cf-stat-icon green">
            <Zap size={18} />
          </div>
          <div className="cf-stat-body">
            <span className="cf-stat-value">{totalMessages}</span>
            <span className="cf-stat-label">Messages Sent</span>
          </div>
        </div>
        <div className="cf-stat-card">
          <div className="cf-stat-icon purple">
            <Globe size={18} />
          </div>
          <div className="cf-stat-body">
            <span className="cf-stat-value">{totalLeads}</span>
            <span className="cf-stat-label">Leads Captured</span>
          </div>
        </div>
        <div className="cf-stat-card">
          <div className="cf-stat-icon amber">
            <Clock size={18} />
          </div>
          <div className="cf-stat-body">
            <span className="cf-stat-value">{currentUser.subscription.status}</span>
            <span className="cf-stat-label">{currentUser.subscription.plan}</span>
          </div>
        </div>
      </div>

      {/* Search + Create Bar */}
      <div className="cf-toolbar">
        <div className="cf-search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search chatbots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="cf-toolbar-right">
          <span className="cf-count">{clientBots.length} chatbot{clientBots.length !== 1 ? "s" : ""}</span>
          <button className="cf-btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={15} /> New Chatbot
          </button>
        </div>
      </div>

      {/* New bot form */}
      {showForm && (
        <form className="cf-create-form" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Enter chatbot name..."
            value={newBotName}
            onChange={(e) => setNewBotName(e.target.value)}
            autoFocus
            className="cf-create-input"
          />
          <button type="submit" className="cf-btn-primary">
            Create
          </button>
          <button type="button" className="cf-btn-ghost" onClick={() => setShowForm(false)}>
            Cancel
          </button>
        </form>
      )}

      {/* Bot List */}
      <div className="cf-bot-grid">
        {filteredBots.length === 0 && (
          <div className="cf-empty-state">
            <div className="cf-empty-icon">
              <Bot size={40} />
            </div>
            <h3>No chatbots found</h3>
            <p>Create your first AI chatbot to get started.</p>
            <button className="cf-btn-primary" onClick={() => setShowForm(true)}>
              <Plus size={15} /> Create Chatbot
            </button>
          </div>
        )}

        {filteredBots.map((bot) => {
          const botConvs = conversations.filter((c) => c.chatbotId === bot.id);
          const botLeads = botConvs.filter((c) => c.lead !== null);

          return (
            <div
              key={bot.id}
              className={`cf-bot-card ${bot.id === activeChatbotId ? "selected" : ""}`}
              onClick={() => setActiveChatbotId(bot.id)}
            >
              <div className="cf-bot-card-header">
                <div className="cf-bot-card-avatar" style={{ background: `${bot.brandColor}15`, color: bot.brandColor }}>
                  {bot.avatar}
                </div>
                <div className="cf-bot-card-status">
                  <span className="cf-status-dot" />
                  <span>Active</span>
                </div>
              </div>
              <div className="cf-bot-card-body">
                <h3 className="cf-bot-card-name">{bot.name}</h3>
                <p className="cf-bot-card-desc">{bot.language} · {bot.faqs.length} FAQs · {bot.urls.length} URLs</p>
              </div>
              <div className="cf-bot-card-stats">
                <span>{botConvs.length} conversations</span>
                <span>{botLeads.length} leads</span>
              </div>
              <div className="cf-bot-card-actions">
                <button
                  className="cf-card-action-btn primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveChatbotId(bot.id);
                    onNavigate("playground");
                  }}
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  className="cf-card-action-btn"
                  onClick={(e) => { e.stopPropagation(); duplicateChatbot(bot.id); }}
                  title="Duplicate"
                >
                  <Copy size={14} />
                </button>
                <button
                  className="cf-card-action-btn danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete "${bot.name}"?`)) deleteChatbot(bot.id);
                  }}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      {clientBots.length > 0 && (
        <div className="cf-quick-actions">
          <h3>Quick Actions</h3>
          <div className="cf-qa-grid">
            <button className="cf-qa-card" onClick={() => onNavigate("playground")}>
              <Pencil size={18} />
              <span>Edit Chatbot</span>
              <ArrowRight size={14} className="cf-qa-arrow" />
            </button>
            <button className="cf-qa-card" onClick={() => onNavigate("knowledge")}>
              <Globe size={18} />
              <span>Train Knowledge</span>
              <ArrowRight size={14} className="cf-qa-arrow" />
            </button>
            <button className="cf-qa-card" onClick={() => onNavigate("widget")}>
              <Sparkles size={18} />
              <span>Get Embed Code</span>
              <ArrowRight size={14} className="cf-qa-arrow" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
