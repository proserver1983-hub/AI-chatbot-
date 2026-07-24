"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore, Chatbot } from "@/lib/store";
import {
  Bot,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  BookOpen,
  BarChart3,
  Settings,
  Puzzle,
  Wrench,
  Package,
  LogOut,
  Plus,
  ShieldAlert,
  Home,
  Users,
  X,
  Menu,
  Search,
  Sparkles,
} from "lucide-react";

export type DashboardView =
  | "chatbots"
  | "playground"
  | "knowledge"
  | "conversations"
  | "analytics"
  | "widget"
  | "maintenance"
  | "handover";

interface SidebarProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onMobileOpen: () => void;
}

export default function Sidebar({
  currentView,
  onViewChange,
  mobileOpen,
  onMobileClose,
  onMobileOpen,
}: SidebarProps) {
  const {
    currentUser,
    chatbots,
    activeChatbotId,
    setActiveChatbotId,
    addChatbot,
    duplicateChatbot,
    deleteChatbot,
    setCurrentUser,
  } = useStore();

  const [botDropdownOpen, setBotDropdownOpen] = useState(true);
  const [showNewBotForm, setShowNewBotForm] = useState(false);
  const [newBotName, setNewBotName] = useState("");
  const [botContextId, setBotContextId] = useState<string | null>(null);

  const router_push = (view: DashboardView) => {
    onViewChange(view);
    onMobileClose();
  };

  if (!currentUser) return null;

  const clientBots = chatbots.filter((b) => b.clientId === currentUser.id);
  const activeBot = chatbots.find((b) => b.id === activeChatbotId);

  const handleCreateBot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBotName.trim()) return;
    const bot = addChatbot(currentUser.id, newBotName);
    setActiveChatbotId(bot.id);
    setNewBotName("");
    setShowNewBotForm(false);
  };

  const navItems: { id: DashboardView; label: string; icon: React.ReactNode; requiresBot?: boolean; accent?: boolean }[] = [
    { id: "chatbots", label: "Chatbots", icon: <Home size={18} /> },
    { id: "playground", label: "Playground", icon: <MessageCircle size={18} />, requiresBot: true },
    { id: "knowledge", label: "Knowledge", icon: <BookOpen size={18} />, requiresBot: true },
    { id: "conversations", label: "Conversations", icon: <Users size={18} />, requiresBot: true },
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={18} />, requiresBot: true },
    { id: "widget", label: "Widget", icon: <Puzzle size={18} />, requiresBot: true },
    { id: "maintenance", label: "Maintenance", icon: <Wrench size={18} /> },
    { id: "handover", label: "Ownership Transfer", icon: <Package size={18} />, requiresBot: true, accent: true },
  ];

  const sidebarContent = (
    <div className="cf-sidebar-inner">
      {/* Workspace header */}
      <div className="cf-sidebar-header">
        <div className="cf-workspace-brand">
          <div className="cf-brand-icon">
            <Bot size={18} />
          </div>
          <div className="cf-workspace-info">
            <span className="cf-workspace-name">ChatFlow</span>
            <span className="cf-workspace-org">{currentUser.companyName}</span>
          </div>
        </div>
        <button className="cf-mobile-close" onClick={onMobileClose}>
          <X size={18} />
        </button>
      </div>

      {/* Chatbots dropdown */}
      <div className="cf-sidebar-section">
        <button
          className="cf-section-toggle"
          onClick={() => setBotDropdownOpen(!botDropdownOpen)}
        >
          <span className="cf-section-label">My Chatbots</span>
          {botDropdownOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        {botDropdownOpen && (
          <div className="cf-bot-list">
            {clientBots.length === 0 && (
              <p className="cf-empty-hint">No chatbots yet. Create one below.</p>
            )}
            {clientBots.map((bot) => (
              <div
                key={bot.id}
                className={`cf-bot-item ${bot.id === activeChatbotId ? "active" : ""}`}
                onClick={() => setActiveChatbotId(bot.id)}
                onMouseEnter={() => setBotContextId(bot.id)}
                onMouseLeave={() => setBotContextId(null)}
              >
                <div className="cf-bot-avatar" style={{ background: `${bot.brandColor}15`, color: bot.brandColor }}>
                  {bot.avatar}
                </div>
                <div className="cf-bot-info">
                  <span className="cf-bot-name">{bot.name}</span>
                  <span className="cf-bot-lang">{bot.language}</span>
                </div>
                {botContextId === bot.id && (
                  <div className="cf-bot-actions">
                    <button
                      title="Duplicate"
                      onClick={(e) => { e.stopPropagation(); duplicateChatbot(bot.id); }}
                    >
                      <Sparkles size={13} />
                    </button>
                    <button
                      title="Delete"
                      onClick={(e) => { e.stopPropagation(); if (confirm(`Delete ${bot.name}?`)) deleteChatbot(bot.id); }}
                    >
                      <X size={13} />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {showNewBotForm ? (
              <form className="cf-new-bot-form" onSubmit={handleCreateBot}>
                <input
                  type="text"
                  placeholder="Chatbot name..."
                  value={newBotName}
                  onChange={(e) => setNewBotName(e.target.value)}
                  autoFocus
                  className="cf-new-bot-input"
                />
                <div className="cf-new-bot-actions">
                  <button type="submit" className="cf-btn-create">Create</button>
                  <button type="button" className="cf-btn-cancel" onClick={() => setShowNewBotForm(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <button className="cf-add-bot-btn" onClick={() => setShowNewBotForm(true)}>
                <Plus size={15} />
                <span>New Chatbot</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="cf-nav">
        <span className="cf-nav-heading">Workspace</span>
        {navItems.map((item) => {
          const disabled = item.requiresBot && clientBots.length === 0;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              className={`cf-nav-item ${isActive ? "active" : ""} ${disabled ? "disabled" : ""} ${item.accent ? "accent" : ""}`}
              onClick={() => !disabled && router_push(item.id)}
              disabled={disabled}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.accent && <span className="cf-nav-badge">★</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="cf-sidebar-footer">
        {currentUser.role === "admin" && (
          <Link href="/admin" className="cf-admin-link">
            <ShieldAlert size={16} />
            <span>Admin Panel</span>
          </Link>
        )}
        <div className="cf-user-card">
          <div className="cf-user-avatar">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="cf-user-info">
            <span className="cf-user-name">{currentUser.name}</span>
            <span className="cf-user-plan">{currentUser.subscription.plan}</span>
          </div>
          <button
            className="cf-logout-btn"
            onClick={() => { setCurrentUser(null); window.location.href = "/"; }}
            title="Log out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button className="cf-mobile-toggle" onClick={onMobileOpen}>
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="cf-sidebar-overlay" onClick={onMobileClose} />
      )}

      {/* Sidebar */}
      <aside className={`cf-sidebar ${mobileOpen ? "open" : ""}`}>
        {sidebarContent}
      </aside>
    </>
  );
}
