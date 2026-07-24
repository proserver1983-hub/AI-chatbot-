"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import {
  Globe,
  FileText,
  MessageSquare,
  Plus,
  Trash2,
  CheckCircle,
  Upload,
  Link2,
  HelpCircle,
  Save,
  File,
  Database,
} from "lucide-react";

type KnowledgeTab = "business" | "urls" | "files" | "faqs";

export default function KnowledgePage() {
  const { chatbots, activeChatbotId, updateChatbotSettings, addFAQ, deleteFAQ, addURL, deleteURL, addPDF, deletePDF } = useStore();
  const bot = chatbots.find((b) => b.id === activeChatbotId);

  const [activeTab, setActiveTab] = useState<KnowledgeTab>("business");
  const [businessInfo, setBusinessInfo] = useState(bot?.businessInfo || "");
  const [faqQ, setFaqQ] = useState("");
  const [faqA, setFaqA] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [synced, setSynced] = useState(false);

  if (!bot) {
    return (
      <div className="cf-page cf-empty-page">
        <Database size={48} />
        <h2>No chatbot selected</h2>
        <p>Select or create a chatbot to manage its knowledge base.</p>
      </div>
    );
  }

  const tabs: { id: KnowledgeTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "business", label: "Business Info", icon: <FileText size={16} /> },
    { id: "urls", label: "Website URLs", icon: <Globe size={16} />, count: bot.urls.length },
    { id: "files", label: "Documents", icon: <File size={16} />, count: bot.pdfs.length },
    { id: "faqs", label: "Q&A Pairs", icon: <HelpCircle size={16} />, count: bot.faqs.length },
  ];

  const handleSyncBusiness = () => {
    updateChatbotSettings(bot.id, { businessInfo });
    setSynced(true);
    setTimeout(() => setSynced(false), 2000);
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQ || !faqA) return;
    addFAQ(bot.id, faqQ, faqA);
    setFaqQ("");
    setFaqA("");
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;
    addURL(bot.id, urlInput);
    setUrlInput("");
  };

  const handleAddPdf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfName) return;
    addPDF(bot.id, pdfName, "1.5 MB");
    setPdfName("");
  };

  return (
    <div className="cf-page">
      {/* Page header */}
      <div className="cf-page-header">
        <div>
          <h1 className="cf-page-title">Knowledge Base</h1>
          <p className="cf-page-desc">Train your chatbot with business info, website content, documents, and Q&A pairs.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="cf-kb-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`cf-kb-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && <span className="cf-tab-count">{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="cf-kb-content">
        {activeTab === "business" && (
          <div className="cf-kb-panel">
            <div className="cf-kb-panel-header">
              <div>
                <h3>Business Information</h3>
                <p>This context serves as the primary knowledge base. The chatbot uses this to generate accurate, grounded responses.</p>
              </div>
              <button className={`cf-btn-primary ${synced ? "success" : ""}`} onClick={handleSyncBusiness}>
                {synced ? <><CheckCircle size={14} /> Synced</> : <><Save size={14} /> Sync to Bot</>}
              </button>
            </div>
            <textarea
              value={businessInfo}
              onChange={(e) => setBusinessInfo(e.target.value)}
              rows={12}
              className="cf-input cf-textarea cf-business-textarea"
              placeholder="Describe your business, services, pricing, policies, support hours, contact information..."
            />
          </div>
        )}

        {activeTab === "urls" && (
          <div className="cf-kb-panel">
            <div className="cf-kb-panel-header">
              <div>
                <h3>Website URLs</h3>
                <p>Add links to web pages. The chatbot will crawl and index their content.</p>
              </div>
            </div>

            <form className="cf-kb-add-form" onSubmit={handleAddUrl}>
              <div className="cf-kb-add-input-wrap">
                <Link2 size={16} className="cf-kb-add-icon" />
                <input
                  type="url"
                  placeholder="https://example.com/page"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="cf-input cf-kb-add-input"
                  required
                />
              </div>
              <button type="submit" className="cf-btn-primary">
                <Plus size={14} /> Add URL
              </button>
            </form>

            <div className="cf-kb-list">
              {bot.urls.length === 0 ? (
                <div className="cf-kb-empty">
                  <Globe size={32} />
                  <p>No URLs added yet. Add your website links to train the chatbot.</p>
                </div>
              ) : (
                bot.urls.map((u) => (
                  <div key={u.id} className="cf-kb-item">
                    <div className="cf-kb-item-icon">
                      <Globe size={16} />
                    </div>
                    <div className="cf-kb-item-info">
                      <span className="cf-kb-item-name">{u.url}</span>
                      <span className="cf-kb-item-meta">
                        <span className="cf-kb-status crawled">
                          <CheckCircle size={11} /> {u.status}
                        </span>
                        <span className="cf-kb-item-date">Updated recently</span>
                      </span>
                    </div>
                    <div className="cf-kb-item-actions">
                      <button
                        className="cf-btn-ghost cf-btn-sm"
                        onClick={() => {
                          alert(`Refresh crawl for ${u.url} started.`);
                        }}
                      >
                        Refresh
                      </button>
                      <button className="cf-kb-item-delete" onClick={() => deleteURL(bot.id, u.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "files" && (
          <div className="cf-kb-panel">
            <div className="cf-kb-panel-header">
              <div>
                <h3>Documents & Files</h3>
                <p>Upload PDFs, manuals, and other documents to enhance the knowledge base.</p>
              </div>
            </div>

            <form className="cf-kb-add-form" onSubmit={handleAddPdf}>
              <div className="cf-kb-add-input-wrap">
                <Upload size={16} className="cf-kb-add-icon" />
                <input
                  type="text"
                  placeholder="Document name (e.g. Product_Manual.pdf)"
                  value={pdfName}
                  onChange={(e) => setPdfName(e.target.value)}
                  className="cf-input cf-kb-add-input"
                  required
                />
              </div>
              <button type="submit" className="cf-btn-primary">
                <Plus size={14} /> Add Document
              </button>
            </form>

            <div className="cf-kb-list">
              {bot.pdfs.length === 0 ? (
                <div className="cf-kb-empty">
                  <File size={32} />
                  <p>No documents uploaded yet.</p>
                </div>
              ) : (
                bot.pdfs.map((p) => (
                  <div key={p.id} className="cf-kb-item">
                    <div className="cf-kb-item-icon file">
                      <FileText size={16} />
                    </div>
                    <div className="cf-kb-item-info">
                      <span className="cf-kb-item-name">{p.name}</span>
                      <span className="cf-kb-item-meta">
                        <span>{p.size}</span>
                        <span className="cf-kb-status crawled">
                          <CheckCircle size={11} /> {p.status}
                        </span>
                      </span>
                    </div>
                    <button className="cf-kb-item-delete" onClick={() => deletePDF(bot.id, p.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "faqs" && (
          <div className="cf-kb-panel">
            <div className="cf-kb-panel-header">
              <div>
                <h3>Q&A Pairs</h3>
                <p>Add frequently asked questions and their answers for guaranteed accurate responses.</p>
              </div>
            </div>

            <form className="cf-kb-faq-form" onSubmit={handleAddFaq}>
              <input
                type="text"
                placeholder="Question (e.g. What are your business hours?)"
                value={faqQ}
                onChange={(e) => setFaqQ(e.target.value)}
                className="cf-input"
                required
              />
              <div className="cf-kb-faq-answer-row">
                <input
                  type="text"
                  placeholder="Answer..."
                  value={faqA}
                  onChange={(e) => setFaqA(e.target.value)}
                  className="cf-input cf-kb-faq-answer-input"
                  required
                />
                <button type="submit" className="cf-btn-primary">
                  <Plus size={14} /> Add FAQ
                </button>
              </div>
            </form>

            <div className="cf-kb-list cf-kb-faq-list">
              {bot.faqs.length === 0 ? (
                <div className="cf-kb-empty">
                  <MessageSquare size={32} />
                  <p>No Q&A pairs created yet.</p>
                </div>
              ) : (
                bot.faqs.map((f) => (
                  <div key={f.id} className="cf-kb-faq-item">
                    <div className="cf-kb-faq-q">
                      <HelpCircle size={14} className="cf-kb-faq-icon-q" />
                      <span>{f.question}</span>
                      <button className="cf-kb-item-delete" onClick={() => deleteFAQ(bot.id, f.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="cf-kb-faq-a">
                      <MessageSquare size={14} className="cf-kb-faq-icon-a" />
                      <span>{f.answer}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
