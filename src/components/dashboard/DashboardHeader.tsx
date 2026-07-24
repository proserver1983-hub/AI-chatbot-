"use client";

import React from "react";
import { useStore } from "@/lib/store";
import { Search, Bell, ChevronRight, Menu } from "lucide-react";
import type { DashboardView } from "./Sidebar";

const viewLabels: Record<DashboardView, string> = {
  chatbots: "Chatbots",
  playground: "Playground",
  knowledge: "Knowledge",
  conversations: "Conversations",
  analytics: "Analytics",
  widget: "Widget",
  maintenance: "Maintenance",
  handover: "Ownership Transfer",
};

interface DashboardHeaderProps {
  currentView: DashboardView;
  onMobileMenu: () => void;
}

export default function DashboardHeader({ currentView, onMobileMenu }: DashboardHeaderProps) {
  const { currentUser, activeChatbotId, chatbots } = useStore();
  const activeBot = chatbots.find((b) => b.id === activeChatbotId);

  return (
    <header className="cf-header">
      <div className="cf-header-left">
        <button className="cf-mobile-menu-btn" onClick={onMobileMenu}>
          <Menu size={20} />
        </button>
        <nav className="cf-breadcrumbs">
          <span className="cf-crumb-root">ChatFlow</span>
          <ChevronRight size={14} className="cf-crumb-sep" />
          {currentUser && (
            <>
              <span className="cf-crumb-org">{currentUser.companyName}</span>
              <ChevronRight size={14} className="cf-crumb-sep" />
            </>
          )}
          {activeBot && currentView !== "chatbots" && currentView !== "maintenance" && (
            <>
              <span className="cf-crumb-bot">{activeBot.name}</span>
              <ChevronRight size={14} className="cf-crumb-sep" />
            </>
          )}
          <span className="cf-crumb-current">{viewLabels[currentView]}</span>
        </nav>
      </div>

      <div className="cf-header-right">
        <div className="cf-header-search">
          <Search size={15} />
          <input type="text" placeholder="Search..." />
        </div>
        <button className="cf-header-notif">
          <Bell size={17} />
          <span className="cf-notif-dot" />
        </button>
        <div className="cf-header-user">
          <div className="cf-header-avatar">
            {currentUser?.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
