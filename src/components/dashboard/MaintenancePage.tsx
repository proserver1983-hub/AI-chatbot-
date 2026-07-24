"use client";

import React from "react";
import { useStore } from "@/lib/store";
import {
  Wrench,
  Shield,
  CreditCard,
  CheckCircle,
  Calendar,
  Clock,
  HeadphonesIcon,
  Server,
  AlertTriangle,
  ArrowRight,
  Send,
} from "lucide-react";

export default function MaintenancePage() {
  const { currentUser } = useStore();

  if (!currentUser) return null;

  return (
    <div className="cf-page">
      <div className="cf-page-header">
        <div>
          <h1 className="cf-page-title">Managed Maintenance</h1>
          <p className="cf-page-desc">Your chatbot is monitored and maintained by our engineering team under your active service agreement.</p>
        </div>
      </div>

      {/* Status banner */}
      <div className="cf-maintenance-banner">
        <div className="cf-maintenance-banner-icon">
          <Shield size={24} />
        </div>
        <div className="cf-maintenance-banner-body">
          <h3>Managed AI Chatbot Maintenance</h3>
          <p>
            Under your service agreement, our engineering team handles database audits, fine-tunes AI completions monthly, manages scraper updates, and ensures your embed code works flawlessly across all platforms.
          </p>
        </div>
        <div className="cf-maintenance-banner-status">
          <span className="cf-maintenance-sla-badge">
            <CheckCircle size={13} /> SLA: Premium
          </span>
        </div>
      </div>

      {/* Service cards */}
      <div className="cf-maintenance-grid">
        <div className="cf-maintenance-card">
          <div className="cf-maintenance-card-icon">
            <CreditCard size={20} />
          </div>
          <div className="cf-maintenance-card-body">
            <span className="cf-maintenance-card-label">Plan</span>
            <span className="cf-maintenance-card-value">{currentUser.subscription.plan}</span>
            <span className="cf-maintenance-card-detail">{currentUser.subscription.price}</span>
          </div>
        </div>

        <div className="cf-maintenance-card">
          <div className="cf-maintenance-card-icon green">
            <CheckCircle size={20} />
          </div>
          <div className="cf-maintenance-card-body">
            <span className="cf-maintenance-card-label">Status</span>
            <span className="cf-maintenance-card-value success">{currentUser.subscription.status}</span>
            <span className="cf-maintenance-card-detail">Since {currentUser.subscription.startDate}</span>
          </div>
        </div>

        <div className="cf-maintenance-card">
          <div className="cf-maintenance-card-icon purple">
            <HeadphonesIcon size={20} />
          </div>
          <div className="cf-maintenance-card-body">
            <span className="cf-maintenance-card-label">Support</span>
            <span className="cf-maintenance-card-value">{currentUser.subscription.supportStatus}</span>
            <span className="cf-maintenance-card-detail">Response time: &lt; 2 hours</span>
          </div>
        </div>
      </div>

      {/* Maintenance timeline */}
      <div className="cf-maintenance-timeline-card">
        <h3>Service Coverage</h3>
        <div className="cf-timeline">
          <div className="cf-timeline-item">
            <div className="cf-timeline-dot" />
            <div className="cf-timeline-content">
              <h4>Database Audits</h4>
              <p>Regular performance checks on all data connections and query optimization.</p>
            </div>
          </div>
          <div className="cf-timeline-item">
            <div className="cf-timeline-dot" />
            <div className="cf-timeline-content">
              <h4>Knowledge Base Updates</h4>
              <p>Monthly scraper runs and content re-indexing to keep responses current.</p>
            </div>
          </div>
          <div className="cf-timeline-item">
            <div className="cf-timeline-dot" />
            <div className="cf-timeline-content">
              <h4>Widget Embed Monitoring</h4>
              <p>Continuous uptime monitoring for your embedded chat widget across all sites.</p>
            </div>
          </div>
          <div className="cf-timeline-item">
            <div className="cf-timeline-dot" />
            <div className="cf-timeline-content">
              <h4>AI Model Fine-tuning</h4>
              <p>Monthly adjustments to response quality based on conversation analysis.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Support form */}
      <div className="cf-maintenance-form-card">
        <div className="cf-maintenance-form-header">
          <Wrench size={20} />
          <div>
            <h3>Request Maintenance Assistance</h3>
            <p>Need help with custom fields, PDF uploads, or embed troubleshooting? Submit a support ticket.</p>
          </div>
        </div>

        <div className="cf-maintenance-form-body">
          <div className="cf-form-row">
            <div className="cf-form-field">
              <label>Issue Category</label>
              <select className="cf-input">
                <option>Knowledge Base Update Assistance</option>
                <option>Custom API Key Configuration</option>
                <option>Widget Layout / Styling Issue</option>
                <option>Database Query Integration</option>
              </select>
            </div>
            <div className="cf-form-field">
              <label>Priority Level</label>
              <select className="cf-input">
                <option>Standard (24h response)</option>
                <option>High (4h response)</option>
                <option>Critical (1h response)</option>
              </select>
            </div>
          </div>
          <div className="cf-form-field">
            <label>Description</label>
            <textarea
              className="cf-input cf-textarea"
              rows={4}
              placeholder="Describe the issue or request in detail..."
            />
          </div>
          <div className="cf-form-actions">
            <button
              className="cf-btn-primary"
              onClick={() => alert("Maintenance ticket submitted. A developer will review this shortly!")}
            >
              <Send size={14} /> Submit Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
