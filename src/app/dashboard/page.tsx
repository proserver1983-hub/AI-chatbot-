"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore, Chatbot, ClientProfile } from "@/lib/store";
import { 
  Bot, 
  Sparkles, 
  Database, 
  Code, 
  FileText, 
  MessageSquare, 
  Sliders, 
  LineChart, 
  Settings, 
  Download, 
  Wrench, 
  CheckCircle, 
  Users, 
  LogOut, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Send, 
  Globe, 
  Clipboard, 
  Layers, 
  Menu, 
  X,
  Smartphone,
  Calendar,
  CreditCard,
  Lock,
  Search,
  Check,
  MoreHorizontal,
  Pencil,
  Copy
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const store = useStore();
  const { 
    currentUser: rawCurrentUser, 
    clients,
    chatbots, 
    conversations, 
    activeChatbotId, 
    setCurrentUser, 
    setActiveChatbotId,
    addChatbot,
    duplicateChatbot,
    deleteChatbot,
    updateChatbotSettings,
    addFAQ,
    deleteFAQ,
    addURL,
    deleteURL,
    addPDF,
    deletePDF,
    sendMessage,
    updateClientProfile
  } = store;

  const currentUser = rawCurrentUser!;

  // Tabs structure
  type TabId = "overview" | "builder" | "knowledge" | "widget" | "analytics" | "subscription" | "handover";
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  
  // Navigation Mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form states for adding items
  const [newBotName, setNewBotName] = useState("");
  const [botSearch, setBotSearch] = useState("");
  const [faqQ, setFaqQ] = useState("");
  const [faqA, setFaqA] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [pdfSize, setPdfSize] = useState("1.5 MB");

  // Local state for chatbot builder parameters (synchronized to store when saved)
  const [botName, setBotName] = useState("");
  const [botAvatar, setBotAvatar] = useState("🤖");
  const [botBrandColor, setBotBrandColor] = useState("#6366f1");
  const [botWelcomeMessage, setBotWelcomeMessage] = useState("");
  const [botPersonality, setBotPersonality] = useState("");
  const [botLanguage, setBotLanguage] = useState("English");
  const [botBusinessInfo, setBotBusinessInfo] = useState("");

  // Widget preview interactive simulation states
  const [previewMsg, setPreviewMsg] = useState("");
  const [previewChatHistory, setPreviewHistory] = useState<Array<{ sender: "user" | "bot"; text: string; timestamp: string }>>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewConvId, setPreviewConvId] = useState<string | undefined>(undefined);

  // Clipboard copy feedback
  const [copied, setCopied] = useState(false);

  // Ownership Handover status
  const [packagingHandover, setPackagingHandover] = useState(false);
  const [handoverSuccess, setHandoverSuccess] = useState(false);

  // Safeguard: Redirect if not logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("chatflow_user");
      if (!storedUser && !currentUser) {
        router.push("/login");
      }
    }
  }, [currentUser, router]);

  // Sync builder states when active chatbot updates
  const activeBot = chatbots.find(b => b.id === activeChatbotId);
  useEffect(() => {
    if (activeBot) {
      setBotName(activeBot.name);
      setBotAvatar(activeBot.avatar);
      setBotBrandColor(activeBot.brandColor);
      setBotWelcomeMessage(activeBot.welcomeMessage);
      setBotPersonality(activeBot.personality);
      setBotLanguage(activeBot.language);
      setBotBusinessInfo(activeBot.businessInfo);
      
      // Reset preview chat history
      setPreviewHistory([
        {
          sender: "bot",
          text: activeBot.welcomeMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setPreviewConvId(undefined);
    }
  }, [activeChatbotId, activeBot]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400 font-mono">Securing corporate workspace...</p>
        </div>
      </div>
    );
  }

  // Statistics filters
  const clientBots = chatbots.filter(b => b.clientId === currentUser.id);
  const clientBotIds = clientBots.map(b => b.id);
  const clientConversations = conversations.filter(c => clientBotIds.includes(c.chatbotId));
  const totalLeads = clientConversations.filter(c => c.lead !== null).map(c => c.lead);
  
  let totalMsgCount = 0;
  clientConversations.forEach(c => {
    totalMsgCount += c.messages.length;
  });

  // Handle building saves
  const handleSaveBuilder = () => {
    if (!activeChatbotId) return;
    updateChatbotSettings(activeChatbotId, {
      name: botName,
      avatar: botAvatar,
      brandColor: botBrandColor,
      welcomeMessage: botWelcomeMessage,
      personality: botPersonality,
      language: botLanguage,
      businessInfo: botBusinessInfo
    });
    alert("Chatbot settings updated successfully!");
  };

  // Add training materials handlers
  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatbotId || !faqQ || !faqA) return;
    addFAQ(activeChatbotId, faqQ, faqA);
    setFaqQ("");
    setFaqA("");
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatbotId || !urlInput) return;
    addURL(activeChatbotId, urlInput);
    setUrlInput("");
  };

  const handleAddPdf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatbotId || !pdfName) return;
    addPDF(activeChatbotId, pdfName, pdfSize);
    setPdfName("");
  };

  // Handle Widget Preview Messaging
  const handleSendPreviewMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewMsg || !activeChatbotId) return;

    const userText = previewMsg;
    setPreviewMsg("");

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setPreviewHistory(prev => [...prev, { sender: "user", text: userText, timestamp }]);
    setPreviewLoading(true);

    try {
      const response = await sendMessage(activeChatbotId, userText, previewConvId);
      setPreviewHistory(prev => [...prev, { sender: "bot", text: response.reply, timestamp }]);
      setPreviewConvId(response.conversationId);
    } catch (err) {
      console.error(err);
    } finally {
      setPreviewLoading(false);
    }
  };

  // Handle Clipboard copies
  const handleCopyEmbed = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle Packaging and downloading Handover ZIP
  const handleTriggerHandover = async () => {
    if (!activeBot) {
      alert("No active chatbot configuration to package.");
      return;
    }
    
    setPackagingHandover(true);
    
    try {
      const currentLeads = conversations
        .filter(c => c.chatbotId === activeBot.id && c.lead !== null)
        .map(c => ({ id: c.id, ...c.lead }));

      const currentConversations = conversations
        .filter(c => c.chatbotId === activeBot.id);

      const requestBody = {
        clientId: currentUser.id,
        clientName: currentUser.name,
        companyName: currentUser.companyName,
        botId: activeBot.id,
        botName: activeBot.name,
        brandColor: activeBot.brandColor,
        welcomeMessage: activeBot.welcomeMessage,
        personality: activeBot.personality,
        businessInfo: activeBot.businessInfo,
        faqs: activeBot.faqs,
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
        setHandoverSuccess(true);
        
        // Also update subscription status to completed on the local store
        updateClientProfile(currentUser.id, {
          subscription: {
            ...currentUser.subscription,
            plan: "Full Ownership",
            status: "Completed",
            supportStatus: "Full Support Handed Over"
          }
        });
      } else {
        alert("Failed to build digital package. Server responded with error.");
      }
    } catch (err) {
      console.error(err);
      alert("Error packaging ZIP files.");
    } finally {
      setPackagingHandover(false);
    }
  };

  const handleCreateChatbotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBotName) return;
    const bot = addChatbot(currentUser.id, newBotName);
    setNewBotName("");
    alert(`Chatbot "${bot.name}" generated with preloaded templates!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    router.push("/");
  };

  // Embed template code
  const embedCodeSnippet = `<script src="${typeof window !== "undefined" ? window.location.origin : "https://chatflow-ai.vercel.app"}/chatflow-widget.js" bot-id="${activeChatbotId || "bot-apex"}"></script>`;

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans">
      
      {/* 1. SIDEBAR NAVIGATION - DESKTOP */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900/60 border-r border-slate-800/80 p-5 shrink-0 select-none">
        {/* Brand Header */}
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg premium-gradient flex items-center justify-center">
            <Bot className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-md text-white">ChatFlow</span>
            <span className="text-[10px] text-indigo-400 font-bold ml-1 px-1.5 py-0.2 bg-indigo-500/10 rounded-full border border-indigo-500/20">WORKSPACE</span>
          </div>
        </div>

        {/* Workspace Quick-Chooser */}
        <div className="mb-6 px-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">ACTIVE SESSIONS</label>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">{currentUser?.companyName}</p>
              <p className="text-[10px] text-slate-500 truncate">{currentUser?.name}</p>
            </div>
            {currentUser.role === 'admin' && (
              <span className="text-[9px] bg-rose-500/15 text-rose-300 font-bold px-1.5 py-0.5 rounded border border-rose-500/20 shrink-0">Admin</span>
            )}
          </div>
        </div>

        {/* Active Chatbot Quick Selector */}
        <div className="mb-6 px-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">ACTIVE CHATBOT</label>
          {clientBots.length === 0 ? (
            <p className="text-[10px] text-rose-400 italic">No chatbots built. Please create one below!</p>
          ) : (
            <select 
              value={activeChatbotId || ""} 
              onChange={(e) => setActiveChatbotId(e.target.value)}
              className="w-full bg-slate-950 text-xs border border-slate-850 p-2.5 rounded-xl font-medium focus:outline-none focus:border-indigo-500 text-slate-200 cursor-pointer"
            >
              {clientBots.map(b => (
                <option key={b.id} value={b.id}>{b.avatar} {b.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 space-y-1">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all ${activeTab === "overview" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:bg-slate-850/50 hover:text-white"}`}
          >
            <Layers className="w-4 h-4" /> Workspace Overview
          </button>
          
          <button 
            onClick={() => setActiveTab("builder")}
            disabled={clientBots.length === 0}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all ${activeTab === "builder" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:bg-slate-850/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"}`}
          >
            <Sliders className="w-4 h-4" /> Appearance & Prompt
          </button>

          <button 
            onClick={() => setActiveTab("knowledge")}
            disabled={clientBots.length === 0}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all ${activeTab === "knowledge" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:bg-slate-850/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"}`}
          >
            <Database className="w-4 h-4" /> Knowledge Base Training
          </button>

          <button 
            onClick={() => setActiveTab("widget")}
            disabled={clientBots.length === 0}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all ${activeTab === "widget" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:bg-slate-850/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"}`}
          >
            <Code className="w-4 h-4" /> Widget & Embed Script
          </button>

          <button 
            onClick={() => setActiveTab("analytics")}
            disabled={clientBots.length === 0}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all ${activeTab === "analytics" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:bg-slate-850/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"}`}
          >
            <LineChart className="w-4 h-4" /> Analytics & Leads
          </button>

          <button 
            onClick={() => setActiveTab("subscription")}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all ${activeTab === "subscription" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:bg-slate-850/50 hover:text-white"}`}
          >
            <Wrench className="w-4 h-4" /> Managed Maintenance
          </button>

          <button 
            onClick={() => setActiveTab("handover")}
            disabled={clientBots.length === 0}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all ${activeTab === "handover" ? "bg-purple-600 text-white shadow-md shadow-purple-600/10 border border-purple-500/20 animate-pulse-slow" : "text-slate-400 hover:bg-slate-850/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"}`}
          >
            <Download className="w-4 h-4" /> Ownership Handover
          </button>
        </nav>

        {/* Bottom Panel */}
        <div className="border-t border-slate-800/80 pt-4 space-y-2">
          {currentUser.role === 'admin' && (
            <Link 
              href="/admin"
              className="w-full text-center py-2 rounded-xl text-xs font-bold bg-pink-950/40 text-pink-300 border border-pink-500/20 flex items-center justify-center gap-2"
            >
              <Users className="w-3.5 h-3.5" /> Back to Admin Panel
            </Link>
          )}
          <button 
            onClick={handleLogout}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 flex items-center gap-3 transition-all"
          >
            <LogOut className="w-4 h-4" /> Terminate Session
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & NAVIGATION */}
      <div className="lg:hidden flex flex-col w-full min-h-screen">
        <header className="glass-card mx-2 my-2 px-4 py-3 flex items-center justify-between border-slate-850">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            <span className="font-extrabold text-sm text-white">ChatFlow Workspace</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-300 hover:text-white">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {mobileMenuOpen && (
          <div className="glass-card mx-2 p-4 bg-slate-900 border-slate-800 space-y-3 z-50">
            <div>
              <span className="text-[10px] text-slate-500 font-bold block mb-1">SESSION ACTIVE</span>
              <p className="text-xs font-bold text-white">{currentUser.companyName}</p>
            </div>
            {clientBots.length > 0 && (
              <div>
                <span className="text-[10px] text-slate-500 font-bold block mb-1">SELECT BOT</span>
                <select 
                  value={activeChatbotId || ""} 
                  onChange={(e) => setActiveChatbotId(e.target.value)}
                  className="w-full bg-slate-950 text-xs border border-slate-800 p-2 rounded"
                >
                  {clientBots.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button onClick={() => { setActiveTab("overview"); setMobileMenuOpen(false); }} className={`p-2.5 rounded text-left ${activeTab === "overview" ? "bg-indigo-600 text-white" : "bg-slate-950 text-slate-400"}`}>Overview</button>
              <button onClick={() => { setActiveTab("builder"); setMobileMenuOpen(false); }} className={`p-2.5 rounded text-left ${activeTab === "builder" ? "bg-indigo-600 text-white" : "bg-slate-950 text-slate-400"}`}>Appearance</button>
              <button onClick={() => { setActiveTab("knowledge"); setMobileMenuOpen(false); }} className={`p-2.5 rounded text-left ${activeTab === "knowledge" ? "bg-indigo-600 text-white" : "bg-slate-950 text-slate-400"}`}>Knowledge</button>
              <button onClick={() => { setActiveTab("widget"); setMobileMenuOpen(false); }} className={`p-2.5 rounded text-left ${activeTab === "widget" ? "bg-indigo-600 text-white" : "bg-slate-950 text-slate-400"}`}>Widget</button>
              <button onClick={() => { setActiveTab("analytics"); setMobileMenuOpen(false); }} className={`p-2.5 rounded text-left ${activeTab === "analytics" ? "bg-indigo-600 text-white" : "bg-slate-950 text-slate-400"}`}>Analytics</button>
              <button onClick={() => { setActiveTab("subscription"); setMobileMenuOpen(false); }} className={`p-2.5 rounded text-left ${activeTab === "subscription" ? "bg-indigo-600 text-white" : "bg-slate-950 text-slate-400"}`}>Maintenance</button>
              <button onClick={() => { setActiveTab("handover"); setMobileMenuOpen(false); }} className={`p-2.5 rounded text-left col-span-2 text-center bg-purple-950 border border-purple-500/20 text-purple-300`}>Handover ZIP Center</button>
            </div>
            <button onClick={handleLogout} className="w-full text-center p-2 rounded text-xs font-bold bg-rose-500/10 text-rose-400">Logout</button>
          </div>
        )}

        <div className="flex-1 p-4 overflow-y-auto">
          {renderTabContent()}
        </div>
      </div>

      {/* DESKTOP CONTENT AREA */}
      <main className="hidden lg:flex flex-col flex-1 min-w-0 overflow-y-auto bg-slate-950 dark-gradient-bg">
        <header className="h-16 border-b border-slate-800/60 px-8 flex items-center justify-between shrink-0 bg-slate-900/10">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold text-slate-200 capitalize tracking-wider">
              {activeTab === "overview" && "Workspace Overview"}
              {activeTab === "builder" && `Design Customizer — ${activeBot?.name}`}
              {activeTab === "knowledge" && `Knowledge Training Corpus — ${activeBot?.name}`}
              {activeTab === "widget" && `HTML Embed Script Generator — ${activeBot?.name}`}
              {activeTab === "analytics" && `Audit Trails & Organic Leads — ${activeBot?.name}`}
              {activeTab === "subscription" && "Managed Maintenance SLA Panel"}
              {activeTab === "handover" && "Digital Source Code & Handover ZIP Center"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 font-medium">Uptime Guarantee: <span className="text-emerald-400 font-bold">99.99%</span></span>
            <div className="w-[1px] h-4 bg-slate-800" />
            <span className="text-xs font-bold text-indigo-300 px-2.5 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/10">Server Status: Online</span>
          </div>
        </header>

        <div className="flex-1 p-8">
          {renderTabContent()}
        </div>
      </main>

    </div>
  );

  // Tab router
  function renderTabContent() {
    switch (activeTab) {
      case "overview":
        return renderOverviewTab();
      case "builder":
        return renderBuilderTab();
      case "knowledge":
        return renderKnowledgeTab();
      case "widget":
        return renderWidgetTab();
      case "analytics":
        return renderAnalyticsTab();
      case "subscription":
        return renderSubscriptionTab();
      case "handover":
        return renderHandoverTab();
      default:
        return renderOverviewTab();
    }
  }

  // OVERVIEW TAB
  function renderOverviewTab() {
    const query = botSearch;
    const filteredBots = clientBots.filter(b => b.name.toLowerCase().includes(query.toLowerCase()));
    return (
      <div className="workspace-home">
        <div className="workspace-welcome">
          <div><p className="workspace-kicker">{currentUser.companyName} / Workspace</p><h2>Chatbots</h2><p>Manage your AI assistants, knowledge, and deployments from one place.</p></div>
          <button className="workspace-create" onClick={() => document.getElementById("new-chatbot")?.focus()}><Plus size={16} /> Create chatbot</button>
        </div>
        <div className="workspace-toolbar">
          <div className="workspace-search"><Search size={17} /><input id="new-chatbot" placeholder="Search chatbots" value={query} onChange={e => setBotSearch(e.target.value)} /></div>
          <span className="workspace-count">{clientBots.length} chatbot{clientBots.length === 1 ? "" : "s"}</span>
        </div>
        <div className="chatbot-list">
          {filteredBots.map((b, index) => {
            const client = clients.find(c => c.id === b.clientId);
            return <article className="chatbot-row" key={b.id} onClick={() => setActiveChatbotId(b.id)}>
              <div className="bot-avatar" style={{ background: `${b.brandColor}18`, color: b.brandColor }}>{b.avatar}</div>
              <div className="bot-details"><h3>{b.name}</h3><p>{client?.companyName || "Workspace assistant"} · {b.language}</p></div>
              <span className="status-badge"><i /> Live</span><div className="updated"><small>Last updated</small><b>{index === 0 ? "Today" : "Jul 21, 2026"}</b></div>
              <div className="row-actions"><button title="Edit" onClick={(e) => { e.stopPropagation(); setActiveChatbotId(b.id); setActiveTab("builder"); }}><Pencil size={15} /></button><button title="Duplicate" onClick={(e) => { e.stopPropagation(); duplicateChatbot(b.id); }}><Copy size={15} /></button><button title="Delete" onClick={(e) => { e.stopPropagation(); if (confirm(`Delete ${b.name}?`)) deleteChatbot(b.id); }}><Trash2 size={15} /></button></div>
            </article>;
          })}
        </div>
        <div className="workspace-models"><span>Service model</span><strong>Managed AI Chatbot Service</strong><strong>Full Ownership Transfer</strong></div>
        <form onSubmit={handleCreateChatbotSubmit} className="create-inline"><input placeholder="Name your new chatbot" value={newBotName} onChange={e => setNewBotName(e.target.value)} required /><button><Plus size={15}/> Add chatbot</button></form>
      </div>
    );
  }

  // BUILDER TAB
  function renderBuilderTab() {
    if (!activeBot) return null;
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-fade-in">
        {/* Settings column */}
        <div className="glass-card border-slate-800 p-6 space-y-6">
          <div className="border-b border-slate-850 pb-4">
            <h3 className="font-extrabold text-white text-base">Appearance & System Identity</h3>
            <p className="text-slate-500 text-xs mt-1">Configure brand alignments, welcome triggers, and AI response style guidelines.</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chatbot Name</label>
                <input 
                  type="text" 
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-xs glass-input"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avatar Emoji</label>
                <select 
                  value={botAvatar}
                  onChange={(e) => setBotAvatar(e.target.value)}
                  className="w-full p-2.5 rounded-lg text-xs bg-slate-950 border border-slate-800/80 text-white cursor-pointer focus:outline-none focus:border-indigo-500"
                >
                  <option value="🤖">🤖 Robot</option>
                  <option value="✨">✨ sparkle</option>
                  <option value="💬">💬 Chat</option>
                  <option value="👑">👑 Luxury Crown</option>
                  <option value="💡">💡 Idea Bulb</option>
                  <option value="⚡">⚡ Bolt</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Language</label>
                <select 
                  value={botLanguage}
                  onChange={(e) => setBotLanguage(e.target.value)}
                  className="w-full p-2.5 rounded-lg text-xs bg-slate-950 border border-slate-800/80 text-white cursor-pointer focus:outline-none focus:border-indigo-500"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                  <option value="German">German (Deutsch)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Brand Hex Color</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={botBrandColor}
                    onChange={(e) => setBotBrandColor(e.target.value)}
                    className="w-10 h-10 p-1 border-0 bg-transparent rounded cursor-pointer"
                  />
                  <input 
                    type="text" 
                    value={botBrandColor}
                    onChange={(e) => setBotBrandColor(e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-lg text-xs font-mono glass-input"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Initial Welcome Greeting</label>
              <textarea 
                rows={3}
                value={botWelcomeMessage}
                onChange={(e) => setBotWelcomeMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs glass-input"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System AI Personality instructions</label>
              <textarea 
                rows={4}
                value={botPersonality}
                onChange={(e) => setBotPersonality(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs glass-input"
                placeholder="Instruct the bot on how to answer, tone details, and guidelines..."
              />
            </div>

            <button 
              onClick={handleSaveBuilder}
              className="w-full py-3.5 rounded-xl font-bold text-white premium-gradient hover:opacity-95 transition-all text-xs flex items-center justify-center gap-2 glow-btn"
            >
              Save Appearance Settings
            </button>
          </div>
        </div>

        {/* Live preview visual column */}
        <div className="glass-card border-slate-800 p-6 flex flex-col h-[560px]">
          <div className="border-b border-slate-850 pb-4 mb-4 flex items-center justify-between shrink-0">
            <div>
              <h3 className="font-extrabold text-white text-base">Real-Time Assistant Sandbox</h3>
              <p className="text-slate-500 text-xs">Verify your visual parameters and prompt responses live.</p>
            </div>
            <span className="text-[10px] bg-slate-900 border border-slate-800 text-indigo-400 font-bold px-2.5 py-1 rounded">Sandbox Mode</span>
          </div>

          {/* Interactive Simulated Device Widget */}
          <div className="flex-1 flex flex-col bg-slate-950 border border-slate-850 rounded-xl overflow-hidden shadow-xl max-w-[380px] mx-auto w-full relative">
            
            {/* Header matches brand color dynamically */}
            <div 
              style={{ background: `linear-gradient(135deg, ${botBrandColor} 0%, rgba(13,17,23,0.95) 100%)` }}
              className="p-4 flex items-center gap-3 text-white border-b border-white/5"
            >
              <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-lg">{botAvatar}</div>
              <div>
                <h4 className="font-bold text-xs">{botName}</h4>
                <div className="flex items-center gap-1 text-[9px] text-emerald-400 mt-0.5 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block animate-pulse" /> Active Online
                </div>
              </div>
            </div>

            {/* Simulated chats logs viewport */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#090d12] text-xs">
              {previewChatHistory.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : ''}`}>
                  <div 
                    style={m.sender === 'user' ? { backgroundColor: botBrandColor } : {}}
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-xl leading-relaxed ${m.sender === 'user' ? 'text-white' : 'bg-[#1f2937] text-slate-200'}`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {previewLoading && (
                <div className="flex">
                  <div className="bg-[#1f2937] text-slate-400 max-w-[80%] px-3.5 py-2 rounded-xl flex items-center gap-1 text-[10px]">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Message input */}
            <form onSubmit={handleSendPreviewMsg} className="p-3 bg-[#0d1117] border-t border-slate-900 flex gap-2">
              <input 
                type="text" 
                placeholder="Ask anything..." 
                value={previewMsg}
                onChange={(e) => setPreviewMsg(e.target.value)}
                className="flex-1 bg-[#161b22] text-xs text-white border border-slate-800 rounded-lg px-3 py-2.5 outline-none focus:border-indigo-500"
              />
              <button 
                type="submit" 
                style={{ backgroundColor: botBrandColor }}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-white font-bold transition-all shrink-0 hover:opacity-90"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // KNOWLEDGE TAB
  function renderKnowledgeTab() {
    if (!activeBot) return null;
    return (
      <div className="space-y-8 animate-fade-in">
        
        {/* Top Business general prompt info */}
        <div className="glass-card p-6 border-slate-800 bg-slate-900/40">
          <div className="border-b border-slate-850 pb-4 mb-4">
            <h3 className="font-extrabold text-white text-base">Corporate Knowledge Grounding</h3>
            <p className="text-slate-500 text-xs mt-1">This context acts as the primary knowledge ceiling for custom AI completions, ensuring the chatbot doesn&apos;t hallucinate about services.</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">General Corporate & Business Information</label>
              <textarea 
                rows={5}
                value={botBusinessInfo}
                onChange={(e) => setBotBusinessInfo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs glass-input"
                placeholder="Type details about pricing, address, policies, packages, support timelines, products..."
              />
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => {
                  updateChatbotSettings(activeBot.id, { businessInfo: botBusinessInfo });
                  alert("Corporate base knowledge updated!");
                }}
                className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/10"
              >
                Sync Business Info
              </button>
            </div>
          </div>
        </div>

        {/* PDFs, URLs, Manual FAQs */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* PDF files uploads list */}
          <div className="glass-card border-slate-800 flex flex-col h-[400px]">
            <div className="p-5 border-b border-slate-850 shrink-0">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-pink-400" /> Upload PDF Manuals
              </h3>
            </div>
            {/* list */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3">
              {activeBot.pdfs.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">No corporate manuals added yet.</div>
              ) : (
                activeBot.pdfs.map(p => (
                  <div key={p.id} className="p-3 bg-slate-950/60 border border-slate-850 rounded-lg flex items-center justify-between text-xs">
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{p.name}</p>
                      <p className="text-[10px] text-slate-500">{p.size} • {p.status}</p>
                    </div>
                    <button 
                      onClick={() => deletePDF(activeBot.id, p.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-rose-500/10 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
            {/* form */}
            <form onSubmit={handleAddPdf} className="p-4 bg-slate-900/60 border-t border-slate-850 flex gap-2 shrink-0">
              <input 
                type="text" 
                placeholder="Manual_Specifications.pdf"
                value={pdfName}
                onChange={(e) => setPdfName(e.target.value)}
                className="flex-1 px-3 py-2 rounded text-xs bg-slate-950 border border-slate-800 text-white outline-none"
                required
              />
              <button className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold transition-all shrink-0">
                Add
              </button>
            </form>
          </div>

          {/* Website URLs crawler */}
          <div className="glass-card border-slate-800 flex flex-col h-[400px]">
            <div className="p-5 border-b border-slate-850 shrink-0">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" /> Crawl Website URLs
              </h3>
            </div>
            {/* list */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3">
              {activeBot.urls.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">No website links scraped yet.</div>
              ) : (
                activeBot.urls.map(u => (
                  <div key={u.id} className="p-3 bg-slate-950/60 border border-slate-850 rounded-lg flex items-center justify-between text-xs">
                    <p className="font-mono text-slate-300 truncate min-w-0 mr-3">{u.url}</p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/10">Crawled</span>
                      <button 
                        onClick={() => deleteURL(activeBot.id, u.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* form */}
            <form onSubmit={handleAddUrl} className="p-4 bg-slate-900/60 border-t border-slate-850 flex gap-2 shrink-0">
              <input 
                type="url" 
                placeholder="https://company.io/docs"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded text-xs bg-slate-950 border border-slate-800 text-white outline-none"
                required
              />
              <button className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold transition-all shrink-0">
                Scrape
              </button>
            </form>
          </div>

          {/* Manual FAQs additions list */}
          <div className="glass-card border-slate-800 flex flex-col h-[400px]">
            <div className="p-5 border-b border-slate-850 shrink-0">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" /> Standard Q&A FAQs
              </h3>
            </div>
            {/* list */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3">
              {activeBot.faqs.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">No manual FAQs created. Add some below!</div>
              ) : (
                activeBot.faqs.map(f => (
                  <div key={f.id} className="p-3 bg-slate-950/60 border border-slate-850 rounded-lg space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-white truncate pr-2">Q: {f.question}</p>
                      <button 
                        onClick={() => deleteFAQ(activeBot.id, f.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-rose-500/10 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">A: {f.answer}</p>
                  </div>
                ))
              )}
            </div>
            {/* form */}
            <form onSubmit={handleAddFaq} className="p-4 bg-slate-900/60 border-t border-slate-850 space-y-2 shrink-0">
              <input 
                type="text" 
                placeholder="Question (e.g. Return policy?)"
                value={faqQ}
                onChange={(e) => setFaqQ(e.target.value)}
                className="w-full px-3 py-1.5 rounded text-xs bg-slate-950 border border-slate-800 text-white outline-none"
                required
              />
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Answer text..."
                  value={faqA}
                  onChange={(e) => setFaqA(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded text-xs bg-slate-950 border border-slate-800 text-white outline-none"
                  required
                />
                <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold transition-all shrink-0">
                  Save FAQ
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    );
  }

  // EMBED WIDGET TAB
  function renderWidgetTab() {
    if (!activeBot) return null;
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-fade-in">
        
        {/* Instructions and Copy code */}
        <div className="glass-card border-slate-800 p-6 space-y-6">
          <div className="border-b border-slate-850 pb-4">
            <h3 className="font-extrabold text-white text-base">Website Script Embed Code</h3>
            <p className="text-slate-500 text-xs mt-1">Copy and paste this script tag into your corporate website headers to deploy your live customized chatbot instantly.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 font-mono text-[11px] text-slate-300 leading-relaxed break-all relative">
              <button 
                onClick={() => handleCopyEmbed(embedCodeSnippet)}
                className="absolute top-2 right-2 p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded transition-all"
              >
                {copied ? <span className="text-emerald-400 font-bold font-sans text-[10px]">Copied!</span> : <Clipboard className="w-3.5 h-3.5" />}
              </button>
              <p className="text-slate-500 font-bold mb-1">// Paste right before closing &lt;/body&gt; or &lt;/head&gt;</p>
              &lt;script <br />
              &nbsp;&nbsp;src=&quot;{typeof window !== "undefined" ? window.location.origin : "https://chatflow-ai.vercel.app"}/chatflow-widget.js&quot;<br />
              &nbsp;&nbsp;bot-id=&quot;{activeBot.id}&quot;&gt;<br />
              &lt;/script&gt;
            </div>

            <div className="space-y-3 text-xs text-slate-400">
              <h4 className="font-bold text-white text-sm">Deployment Guide:</h4>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="w-5 h-5 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center text-[10px] text-indigo-400 shrink-0">1</div>
                  <p>Open the HTML code of your landing or pricing website.</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-5 h-5 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center text-[10px] text-indigo-400 shrink-0">2</div>
                  <p>Paste the snippet. No styling files, fonts, or frameworks required.</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-5 h-5 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center text-[10px] text-indigo-400 shrink-0">3</div>
                  <p>The floating bubble will render, load in the bottom right corner, and automatically interact with users based on the latest knowledge base sync.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live visualization floating bubble simulation */}
        <div className="glass-card border-slate-800 p-6 flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-tr from-slate-900/50 to-slate-950">
          <div className="absolute top-4 left-4 text-xs font-semibold text-slate-400">Appearance preview</div>
          <div className="text-center max-w-xs space-y-4">
            <Smartphone className="w-16 h-16 text-slate-700 mx-auto" />
            <h4 className="font-bold text-white">How does it look on my live website?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              When embedded, a small pulsing gradient launcher with custom avatars loads quietly. Clicking the launcher displays the conversational sandbox we configured in the Appearance Panel.
            </p>
          </div>
          {/* Custom preview box launcher */}
          <div className="mt-8 flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-850">
            <div 
              style={{ backgroundColor: activeBot.brandColor }}
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl text-white shadow-lg shrink-0"
            >
              {activeBot.avatar}
            </div>
            <div className="text-left text-xs min-w-0">
              <p className="font-bold text-slate-200">Interactive Launcher preview</p>
              <p className="text-[10px] text-slate-500">Brand HEX color matches: {activeBot.brandColor}</p>
            </div>
          </div>
        </div>

      </div>
    );
  }

  // ANALYTICS TAB
  function renderAnalyticsTab() {
    if (!activeBot) return null;

    // Filter leads
    const botConvs = conversations.filter(c => c.chatbotId === activeBot.id);
    const botLeads = botConvs.filter(c => c.lead !== null);

    return (
      <div className="space-y-8 animate-fade-in">
        
        {/* Statistics highlights row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-5 border-slate-800 bg-slate-900/40">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Sessions Logs</span>
            <p className="text-2xl font-black text-white">{botConvs.length}</p>
          </div>
          <div className="glass-card p-5 border-slate-800 bg-slate-900/40">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Captured leads</span>
            <p className="text-2xl font-black text-emerald-400">{botLeads.length}</p>
          </div>
          <div className="glass-card p-5 border-slate-800 bg-slate-900/40">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Uptime Rate</span>
            <p className="text-2xl font-black text-white">100.0%</p>
          </div>
          <div className="glass-card p-5 border-slate-800 bg-slate-900/40">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Avg Resolution Time</span>
            <p className="text-2xl font-black text-indigo-400">&lt; 3.0s</p>
          </div>
        </div>

        {/* Lead Table and Chat transcript inspector split */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Leads captured lists */}
          <div className="glass-card border-slate-800 xl:col-span-2 overflow-hidden flex flex-col h-[420px]">
            <div className="p-5 bg-slate-900/40 border-b border-slate-850 shrink-0 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" /> Captured Organic Contacts & Leads
              </h3>
              <span className="text-[10px] bg-slate-800 text-emerald-400 font-bold px-2 py-0.5 rounded">Count: {botLeads.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto">
              {botLeads.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs">No leads logged. Ask the bot in the builder sandbox and supply an email address!</div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 border-b border-slate-850 font-bold uppercase tracking-wider">
                      <th className="p-3.5">Name</th>
                      <th className="p-3.5">Contact details</th>
                      <th className="p-3.5">Browser Client</th>
                      <th className="p-3.5">Time Logged</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {botLeads.map(c => (
                      <tr key={c.id} className="hover:bg-slate-900/20 text-slate-300">
                        <td className="p-3.5 font-bold text-white">{c.lead?.name || "Anonymous Lead"}</td>
                        <td className="p-3.5 space-y-0.5">
                          <p className="font-semibold text-slate-200">{c.lead?.email}</p>
                          <p className="text-[10px] text-slate-500">{c.lead?.phone || "No phone logged"}</p>
                        </td>
                        <td className="p-3.5 text-slate-500 font-mono text-[10px] truncate max-w-[120px]">{c.browser} • {c.location}</td>
                        <td className="p-3.5 text-slate-400">{c.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Active Chat transcripts inspector */}
          <div className="glass-card border-slate-800 flex flex-col h-[420px]">
            <div className="p-5 bg-slate-900/40 border-b border-slate-850 shrink-0">
              <h3 className="font-bold text-white text-sm">Interactive Session Logs</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {botConvs.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs">No user chats recorded.</div>
              ) : (
                botConvs.map(c => (
                  <div key={c.id} className="p-4 rounded-xl bg-slate-950 border border-slate-850 text-xs space-y-3.5">
                    <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                      <span className="font-bold text-slate-300">{c.lead ? `Lead: ${c.lead.name}` : "Anonymous Session"}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{c.timestamp}</span>
                    </div>
                    {/* display messages */}
                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                      {c.messages.map(m => (
                        <div key={m.id} className="space-y-0.5">
                          <span className={`text-[9px] font-bold block uppercase tracking-wider ${m.sender === 'user' ? 'text-indigo-400' : 'text-slate-500'}`}>
                            {m.sender === 'user' ? 'Visitor' : 'AI Bot'}
                          </span>
                          <p className="text-slate-300 bg-slate-900/50 p-2 rounded leading-relaxed border border-slate-850/20">{m.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // MANAGED MAINTENANCE TAB
  function renderSubscriptionTab() {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="glass-card p-6 border-indigo-500/20 bg-slate-900/20">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <Wrench className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="font-bold text-white text-lg">Managed AI Chatbot Maintenance Status</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Under our standard Monthly Maintenance tier, our systems engineers run audits on database connections, fine-tune context completions monthly, handle scraper updates, and ensure your embed code works flawlessly.
              </p>
            </div>
            <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">
              SLA Level: Premium
            </span>
          </div>
        </div>

        {/* Subscription details cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 border-slate-800 bg-slate-900/40">
            <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-bold">
              <CreditCard className="w-4 h-4 text-indigo-400" /> Plan Package Details
            </div>
            <p className="text-white font-black text-lg mt-1">{currentUser.subscription.plan}</p>
            <p className="text-xs text-slate-500 mt-0.5">Billing frequency: {currentUser.subscription.price}</p>
          </div>

          <div className="glass-card p-6 border-slate-800 bg-slate-900/40">
            <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Subscription Status
            </div>
            <p className="text-emerald-400 font-black text-lg mt-1">{currentUser.subscription.status}</p>
            <p className="text-xs text-slate-500 mt-0.5">Active since: {currentUser.subscription.startDate}</p>
          </div>

          <div className="glass-card p-6 border-slate-800 bg-slate-900/40">
            <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-bold">
              <Calendar className="w-4 h-4 text-pink-400" /> Priority Support Window
            </div>
            <p className="text-white font-black text-lg mt-1">{currentUser.subscription.supportStatus}</p>
            <p className="text-xs text-slate-500 mt-0.5">Developer response time: &lt; 2 hours</p>
          </div>
        </div>

        {/* Support Ticket Simulator */}
        <div className="glass-card border-slate-800">
          <div className="p-5 border-b border-slate-850">
            <h4 className="font-bold text-white text-sm">Request Managed Setup Assistance</h4>
          </div>
          <div className="p-5 space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              Need assistance updating custom fields, loading heavy PDF documentation, or troubleshooting website layout embeds? Drop a note to our platform engineers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Issue Category</span>
                <select className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none">
                  <option>Knowledge Corpus Update assistance</option>
                  <option>Custom API key pipeline routing</option>
                  <option>Widget appearance styling layout issue</option>
                  <option>SQL database custom query integration</option>
                </select>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Core Message Description</span>
                <input type="text" placeholder="Please describe requested maintenance changes..." className="w-full p-2.5 rounded bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => alert("Maintenance setup assistance ticket routed to support engineers. A developer will review this shortly!")}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-xs rounded-lg transition-all"
              >
                Submit Assistance Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // HANDOVER ZIP TAB
  function renderHandoverTab() {
    if (!activeBot) return null;
    return (
      <div className="space-y-8 animate-fade-in">
        
        {/* Callout explaining Handover package contents */}
        <div className="glass-card p-6 border-purple-500/30 bg-purple-950/10">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
              <Layers className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 flex-1">
              <h3 className="font-extrabold text-white text-lg">Full Code Ownership Handover Center</h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                By clicking the trigger button below, our backend compiles a customized commercial bundle called <span className="font-mono text-purple-300 text-[11px] font-bold">{currentUser.companyName.replace(/[^a-zA-Z0-9]/g, "_")}_ChatFlow_Handover.zip</span>. 
                This package contains everything required to decouple from our SaaS platforms, allowing you to self-host at zero future recurring platform cost!
              </p>
            </div>
          </div>
        </div>

        {/* Handover contents inspection checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* List of files in ZIP */}
          <div className="glass-card border-slate-800">
            <div className="p-5 border-b border-slate-850">
              <h4 className="font-bold text-white text-sm">Output ZIP Structure Hierarchy</h4>
            </div>
            <div className="p-5 space-y-4 text-xs font-mono">
              <div className="space-y-1 bg-slate-950 p-4 rounded-xl border border-slate-850">
                <p className="text-purple-300 font-bold">📦 {currentUser.companyName.replace(/[^a-zA-Z0-9]/g, "_")}_ChatFlow_Handover.zip</p>
                <div className="pl-4 space-y-1 text-slate-400">
                  <p>├── 📦 <span className="text-white font-bold">Source-Code.zip</span> <span className="text-slate-500 font-sans text-[10px]">(Full Standalone Next.js App, API routes, package.json)</span></p>
                  <p>├── 📄 <span className="text-white font-bold">Widget-Code.txt</span> <span className="text-slate-500 font-sans text-[10px]">(Your custom integration keys and tag setups)</span></p>
                  <p>├── 💾 <span className="text-white font-bold">Database-Export.sql</span> <span className="text-slate-500 font-sans text-[10px]">(PostgreSQL script dump with actual clients, FAQs, and recent leads)</span></p>
                  <p>├── 📕 <span className="text-white font-bold">Setup-Guide.pdf</span> <span className="text-slate-500 font-sans text-[10px]">(Exhaustive local configuration instruction manual)</span></p>
                  <p>├── 📕 <span className="text-white font-bold">Documentation.pdf</span> <span className="text-slate-500 font-sans text-[10px]">(SaaS architecture documentation & visual configurations)</span></p>
                  <p>└── 📕 <span className="text-white font-bold">Ownership-Agreement.pdf</span> <span className="text-slate-500 font-sans text-[10px]">(Officially authorized legal copyright transfer agreement)</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Trigger Transfer controls */}
          <div className="glass-card border-slate-800 p-6 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Lock className="w-4.5 h-4.5 text-purple-400" /> Compile & Download Package
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clicking trigger will query your active configurations, fetch recent captured leads, generate customized PostgreSQL tables structures, and serialize all agreements in an asynchronous pipeline download.
              </p>

              {handoverSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Transfer bundle compiled and downloaded successfully! System status updated.</span>
                </div>
              )}
            </div>

            <div className="pt-6">
              <button 
                onClick={handleTriggerHandover}
                disabled={packagingHandover}
                className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 transition-all text-xs flex items-center justify-center gap-2.5 shadow-lg shadow-purple-500/20 glow-btn disabled:opacity-50"
              >
                {packagingHandover ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Compiling System Assets...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4.5 h-4.5" />
                    <span>Trigger Full Ownership Handover & Save ZIP</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }
}
