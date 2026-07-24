"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import Sidebar, { DashboardView } from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import OverviewPage from "./OverviewPage";
import PlaygroundPage from "./PlaygroundPage";
import KnowledgePage from "./KnowledgePage";
import ConversationsPage from "./ConversationsPage";
import AnalyticsPage from "./AnalyticsPage";
import WidgetPage from "./WidgetPage";
import MaintenancePage from "./MaintenancePage";
import HandoverPage from "./HandoverPage";

export default function DashboardShell() {
  const router = useRouter();
  const { currentUser } = useStore();
  const [currentView, setCurrentView] = useState<DashboardView>("chatbots");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("chatflow_user");
      if (!storedUser && !currentUser) {
        router.push("/login");
      }
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="cf-loading-screen">
        <div className="cf-loading-spinner" />
        <p>Loading workspace...</p>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case "chatbots":
        return <OverviewPage onNavigate={setCurrentView} />;
      case "playground":
        return <PlaygroundPage />;
      case "knowledge":
        return <KnowledgePage />;
      case "conversations":
        return <ConversationsPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "widget":
        return <WidgetPage />;
      case "maintenance":
        return <MaintenancePage />;
      case "handover":
        return <HandoverPage />;
      default:
        return <OverviewPage onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="cf-dashboard">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onMobileOpen={() => setMobileOpen(true)}
      />
      <div className="cf-main-area">
        <DashboardHeader
          currentView={currentView}
          onMobileMenu={() => setMobileOpen(true)}
        />
        <div className="cf-content-area">
          {renderView()}
        </div>
      </div>
    </div>
  );
}
