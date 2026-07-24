"use client";

import React from "react";
import { useStore } from "@/lib/store";
import {
  Bot,
  Users,
  MessageSquare,
  TrendingUp,
  BarChart3,
  Target,
  Clock,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Mail,
  Phone,
  Globe,
  MapPin,
} from "lucide-react";

export default function AnalyticsPage() {
  const { chatbots, conversations, activeChatbotId } = useStore();
  const bot = chatbots.find((b) => b.id === activeChatbotId);

  if (!bot) {
    return (
      <div className="cf-page cf-empty-page">
        <BarChart3 size={48} />
        <h2>No chatbot selected</h2>
        <p>Select or create a chatbot to view analytics.</p>
      </div>
    );
  }

  const botConvs = conversations.filter((c) => c.chatbotId === bot.id);
  const botLeads = botConvs.filter((c) => c.lead !== null);
  const totalMessages = botConvs.reduce((sum, c) => sum + c.messages.length, 0);
  const avgMessages = botConvs.length > 0 ? (totalMessages / botConvs.length).toFixed(1) : "0";

  // Deterministic chart data based on real conversation counts (no Math.random during render)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const baseConv = Math.max(1, botConvs.length);
  const chartData = days.map((day, i) => ({
    day,
    conversations: Math.max(1, Math.floor(baseConv * (0.6 + 0.08 * i))),
    leads: Math.max(0, Math.floor(botLeads.length * (0.4 + 0.06 * i))),
  }));
  const maxConv = Math.max(...chartData.map((d) => d.conversations), 1);

  return (
    <div className="cf-page">
      <div className="cf-page-header">
        <div>
          <h1 className="cf-page-title">Analytics</h1>
          <p className="cf-page-desc">Track conversations, leads, and chatbot performance metrics.</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="cf-analytics-stats">
        <div className="cf-analytics-stat-card">
          <div className="cf-analytics-stat-header">
            <div className="cf-analytics-stat-icon blue">
              <MessageSquare size={18} />
            </div>
            <span className="cf-analytics-stat-trend up">
              <ArrowUpRight size={13} /> +12%
            </span>
          </div>
          <div className="cf-analytics-stat-value">{totalMessages}</div>
          <div className="cf-analytics-stat-label">Total Messages</div>
        </div>

        <div className="cf-analytics-stat-card">
          <div className="cf-analytics-stat-header">
            <div className="cf-analytics-stat-icon green">
              <Users size={18} />
            </div>
            <span className="cf-analytics-stat-trend up">
              <ArrowUpRight size={13} /> +8%
            </span>
          </div>
          <div className="cf-analytics-stat-value">{botConvs.length}</div>
          <div className="cf-analytics-stat-label">Total Conversations</div>
        </div>

        <div className="cf-analytics-stat-card">
          <div className="cf-analytics-stat-header">
            <div className="cf-analytics-stat-icon purple">
              <Target size={18} />
            </div>
            <span className="cf-analytics-stat-trend up">
              <ArrowUpRight size={13} /> +24%
            </span>
          </div>
          <div className="cf-analytics-stat-value">{botLeads.length}</div>
          <div className="cf-analytics-stat-label">Leads Captured</div>
        </div>

        <div className="cf-analytics-stat-card">
          <div className="cf-analytics-stat-header">
            <div className="cf-analytics-stat-icon amber">
              <Clock size={18} />
            </div>
            <span className="cf-analytics-stat-trend down">
              <ArrowDownRight size={13} /> -5%
            </span>
          </div>
          <div className="cf-analytics-stat-value">{avgMessages}</div>
          <div className="cf-analytics-stat-label">Avg Messages/Conv</div>
        </div>
      </div>

      {/* Charts */}
      <div className="cf-analytics-charts">
        {/* Bar chart */}
        <div className="cf-chart-card">
          <div className="cf-chart-header">
            <h3>Weekly Conversations</h3>
            <span className="cf-chart-period">Last 7 days</span>
          </div>
          <div className="cf-chart-body">
            <div className="cf-bar-chart">
              {chartData.map((d, i) => (
                <div key={i} className="cf-bar-col">
                  <div className="cf-bar-wrapper">
                    <div
                      className="cf-bar"
                      style={{ height: `${(d.conversations / maxConv) * 100}%` }}
                    />
                  </div>
                  <span className="cf-bar-label">{d.day}</span>
                  <span className="cf-bar-value">{d.conversations}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lead conversion */}
        <div className="cf-chart-card cf-chart-card-sm">
          <div className="cf-chart-header">
            <h3>Lead Conversion</h3>
            <span className="cf-chart-period">Overall</span>
          </div>
          <div className="cf-chart-body cf-conversion-body">
            <div className="cf-conversion-ring">
              <svg viewBox="0 0 100 100" className="cf-ring-svg">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${botConvs.length > 0 ? (botLeads.length / botConvs.length) * 251 : 0} 251`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="cf-ring-text">
                <span className="cf-ring-value">
                  {botConvs.length > 0 ? Math.round((botLeads.length / botConvs.length) * 100) : 0}%
                </span>
                <span className="cf-ring-label">Rate</span>
              </div>
            </div>
            <div className="cf-conversion-legend">
              <div className="cf-legend-item">
                <span className="cf-legend-dot" style={{ background: "#2563eb" }} />
                <span>Leads: {botLeads.length}</span>
              </div>
              <div className="cf-legend-item">
                <span className="cf-legend-dot" style={{ background: "#f0f0f0" }} />
                <span>No Lead: {botConvs.length - botLeads.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leads table */}
      <div className="cf-analytics-table-card">
        <div className="cf-chart-header">
          <h3>Captured Leads</h3>
          <span className="cf-chart-period">{botLeads.length} total</span>
        </div>
        {botLeads.length === 0 ? (
          <div className="cf-table-empty">
            <Mail size={28} />
            <p>No leads captured yet. Leads are auto-detected when visitors share contact information.</p>
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
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {botLeads.map((conv) => (
                  <tr key={conv.id}>
                    <td>
                      <div className="cf-table-lead-name">
                        <div className="cf-table-avatar">{conv.lead?.name?.charAt(0) || "?"}</div>
                        {conv.lead?.name || "Anonymous"}
                      </div>
                    </td>
                    <td>{conv.lead?.email || "—"}</td>
                    <td>{conv.lead?.phone || "—"}</td>
                    <td>
                      <span className="cf-table-location">
                        <MapPin size={12} /> {conv.location}
                      </span>
                    </td>
                    <td className="cf-table-browser">{conv.browser}</td>
                    <td>{conv.timestamp}</td>
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
