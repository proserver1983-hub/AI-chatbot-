"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import {
  Users,
  Search,
  Mail,
  Phone,
  User,
  Trash2,
  MessageSquare,
  Download,
  Building,
} from "lucide-react";

export default function LeadsPage() {
  const { chatbots, conversations, activeChatbotId, deleteConversation } = useStore();
  const bot = chatbots.find((b) => b.id === activeChatbotId);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "with-leads" | "no-leads">("all");

  if (!bot) {
    return (
      <div className="cf-page cf-empty-page">
        <Users size={48} />
        <h2>No chatbot selected</h2>
        <p>Select or create a chatbot to view captured leads.</p>
      </div>
    );
  }

  // Get all conversations with leads for the active bot
  const botConvs = conversations.filter((c) => c.chatbotId === bot.id);
  const leadConvs = botConvs.filter((c) => c.lead !== null);
  const allLeads = leadConvs
    .map((c) => ({
      conversationId: c.id,
      name: c.lead?.name || "Anonymous",
      email: c.lead?.email || "",
      phone: c.lead?.phone || "",
      location: c.location,
      browser: c.browser,
      timestamp: c.timestamp,
      messageCount: c.messages.length,
    }))
    .filter((l) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.includes(q)
      );
    })
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  const filteredLeads = filterStatus === "all" ? allLeads : allLeads;

  const handleExportCSV = () => {
    const csvRows = [
      ["Name", "Email", "Phone", "Location", "Browser", "Messages", "Timestamp"],
      ...filteredLeads.map((l) => [
        l.name,
        l.email,
        l.phone,
        l.location,
        l.browser,
        String(l.messageCount),
        l.timestamp,
      ]),
    ];
    const csvContent = csvRows
      .map((r) =>
        r
          .map((c) => `"${String(c || "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${bot.name}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    a.remove();
  };

  const handleDeleteLead = (conversationId: string) => {
    if (!confirm("Delete this lead and its conversation permanently?")) return;
    deleteConversation(conversationId);
  };

  return (
    <div className="cf-page">
      <div className="cf-page-header">
        <div>
          <h1 className="cf-page-title">Captured Leads</h1>
          <p className="cf-page-desc">
            View and manage all leads captured through your chatbot conversations.
          </p>
        </div>
        <div className="cf-conv-summary">
          <div className="cf-conv-stat">
            <span className="cf-conv-stat-value">{leadConvs.length}</span>
            <span className="cf-conv-stat-label">Total Leads</span>
          </div>
          <div className="cf-conv-stat">
            <span className="cf-conv-stat-value">{botConvs.length}</span>
            <span className="cf-conv-stat-label">Conversations</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="cf-toolbar">
        <div className="cf-search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search leads by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="cf-toolbar-right">
          <button className="cf-btn-ghost" onClick={handleExportCSV}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="cf-analytics-table-card">
        {filteredLeads.length === 0 ? (
          <div className="cf-table-empty">
            <Mail size={28} />
            <p>
              No leads captured yet. Leads are auto-detected when visitors share
              contact information during conversations.
            </p>
          </div>
        ) : (
          <div className="cf-table-wrap">
            <table className="cf-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>Browser</th>
                  <th>Messages</th>
                  <th>Timestamp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.conversationId}>
                    <td>
                      <div className="cf-table-lead-name">
                        <div className="cf-table-avatar">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        {lead.name}
                      </div>
                    </td>
                    <td>
                      {lead.email ? (
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Mail size={12} /> {lead.email}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {lead.phone ? (
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Phone size={12} /> {lead.phone}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{lead.location}</td>
                    <td className="cf-table-browser">{lead.browser}</td>
                    <td>{lead.messageCount}</td>
                    <td>{lead.timestamp}</td>
                    <td>
                      <button
                        className="cf-kb-item-delete"
                        onClick={() => handleDeleteLead(lead.conversationId)}
                        title="Delete lead"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
