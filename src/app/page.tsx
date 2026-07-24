"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle,
  ChevronDown,
  Code,
  Database,
  FileText,
  Globe,
  LineChart,
  MessageSquare,
  Send,
  Sliders,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/lib/store";

const features = [
  {
    icon: Database,
    title: "Train each client's assistant",
    copy: "Bring in web pages, documents, and Q&As for each client. Keep every answer grounded in the information their customers trust.",
  },
  {
    icon: Sliders,
    title: "White-label the experience",
    copy: "Set the assistant’s tone, welcome message, language, and brand color so every deployment feels native to the client’s brand.",
  },
  {
    icon: Code,
    title: "Deploy without the bottleneck",
    copy: "Copy one lightweight script into any client site. Your team can launch updates without waiting on engineering.",
  },
  {
    icon: MessageSquare,
    title: "Prove client ROI",
    copy: "Capture leads and conversation trends naturally, then give clients clear outcomes they can see and share.",
  },
  {
    icon: LineChart,
    title: "Manage every account",
    copy: "Review conversations, common questions, and lead activity across every client in one focused workspace.",
  },
  {
    icon: FileText,
    title: "Offer flexible handover",
    copy: "Keep managing the account or offer a complete source-code and deployment handover when the client is ready.",
  },
];

const faqs = [
  {
    question: "What can I use to train my assistant?",
    answer:
      "You can add website URLs, PDF manuals, business context, and manual question-and-answer pairs. The workspace keeps those sources together for each chatbot.",
  },
  {
    question: "Do I need a developer to install the widget?",
    answer:
      "No. Generate the embed snippet in your workspace and paste it before the closing body tag of your site. It works with static sites, WordPress, Webflow, Shopify, and custom applications.",
  },
  {
    question: "Can I tailor the assistant to my brand?",
    answer:
      "Yes. Every assistant has its own name, avatar, brand color, welcome message, language, and response instructions, all editable in the builder.",
  },
  {
    question: "What is included in the ownership handover?",
    answer:
      "The full-ownership option prepares a download with your source code, widget instructions, database export, deployment documentation, and transfer materials.",
  },
];

export default function LandingPage() {
  const { clients, setCurrentUser } = useStore();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const startWorkspace = () => {
    const demoClient = clients.find((client) => client.role === "client");
    if (demoClient) setCurrentUser(demoClient);
  };

  return (
    <div className="marketing-shell">
      <div className="marketing-container">
        <header className="site-header">
          <Link href="/" className="brand-lockup" aria-label="ChatFlow home">
            <span className="brand-mark"><Bot /></span>
            <span>ChatFlow</span>
          </Link>

          <nav className="site-nav" aria-label="Primary navigation">
            <a href="#product">Product</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div className="header-actions">
            <Link href="/login" className="text-link">Log in</Link>
            <Link href="/dashboard" onClick={startWorkspace} className="button-primary">
              Start building <ArrowRight size={15} />
            </Link>
          </div>
        </header>
      </div>

      <main>
        <section className="hero-section">
          <div className="marketing-container">
            <div className="hero-content">
              <span className="eyebrow"><Sparkles /> The AI chatbot platform for agencies</span>
              <h1 className="hero-title">
                Manage AI chatbots<br />for every client <span className="accent">you serve.</span>
              </h1>
              <p className="hero-copy">
                Launch branded, client-ready AI chatbots from one agency workspace. Configure knowledge, manage deployments, and deliver measurable results without rebuilding the same system every time.
              </p>
              <div className="hero-actions">
                <Link href="/dashboard" onClick={startWorkspace} className="button-primary">
                  Create your assistant <ArrowRight size={16} />
                </Link>
                <a href="#product" className="button-secondary">See how it works</a>
              </div>
              <div className="reassurance">
                <span><CheckCircle /> No engineering bottleneck</span>
                <span><CheckCircle /> Manage every client</span>
                <span><CheckCircle /> Your brand, their business</span>
              </div>
            </div>

            <div id="product" className="product-frame" aria-label="ChatFlow dashboard preview">
              <div className="product-bar">
                <span className="window-dots"><i /><i /><i /></span>
                <span className="product-url">app.chatflow.ai / workspace</span>
              </div>
              <div className="product-body">
                <aside className="preview-sidebar">
                  <div className="preview-brand"><span>✦</span> Northstar Agency</div>
                  <div className="preview-menu">
                    <span><LineChart /> Overview</span>
                    <span><Bot /> Assistants</span>
                    <span><Database /> Knowledge</span>
                    <span><MessageSquare /> Conversations</span>
                    <span><Code /> Integrations</span>
                  </div>
                </aside>
                <div className="preview-main">
                  <div className="preview-topline">
                    <div>
                      <p className="preview-kicker">Good morning, Maya</p>
                      <h2 className="preview-title">Your client portfolio is on track</h2>
                    </div>
                    <span className="live-pill">12 client workspaces live</span>
                  </div>
                  <div className="preview-stats">
                    <div className="preview-stat"><small>Conversations</small><strong>1,284</strong></div>
                    <div className="preview-stat"><small>Leads captured</small><strong>186</strong></div>
                    <div className="preview-stat"><small>Resolution rate</small><strong>92%</strong></div>
                  </div>
                  <div className="preview-grid">
                    <div className="preview-card">
                      <div className="preview-card-title"><span>Conversations this week</span><span>+18.4%</span></div>
                      <div className="mini-bars"><i /><i /><i /><i /><i /><i /><i /></div>
                    </div>
                    <div className="preview-card">
                      <div className="preview-card-title"><span>Recent conversations</span><span>View all</span></div>
                      <div className="conversation-list">
                        <div className="conversation-item"><span className="conversation-avatar">J</span><span className="conversation-text"><b>Pricing question</b><small>2 minutes ago</small></span></div>
                        <div className="conversation-item"><span className="conversation-avatar">M</span><span className="conversation-text"><b>Need setup help</b><small>12 minutes ago</small></span></div>
                        <div className="conversation-item"><span className="conversation-avatar">A</span><span className="conversation-text"><b>Product comparison</b><small>28 minutes ago</small></span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="section section-soft">
          <div className="marketing-container">
            <div className="section-heading">
              <span className="eyebrow">Built for agency teams</span>
              <h2>Deliver better chatbots, at scale</h2>
              <p>Give your team one calm workspace to build, brand, monitor, and hand off AI chatbots for every client.</p>
            </div>
            <div className="feature-grid">
              {features.map(({ icon: Icon, title, copy }) => (
                <article className="feature-card" key={title}>
                  <span className="feature-icon"><Icon /></span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="marketing-container split-feature">
            <div className="split-copy">
              <span className="eyebrow"><Globe /> Built for client delivery</span>
              <h2>Give every client a helpful answer, one click away.</h2>
              <p>Give visitors a fast, on-brand conversation before they leave a client’s site. ChatFlow keeps delivery personal while your agency stays in control.</p>
              <ul className="tick-list">
                <li><CheckCircle /> Launch each chatbot with the client’s colors, voice, and assistant settings.</li>
                <li><CheckCircle /> Keep every answer aligned to the client’s approved business knowledge.</li>
                <li><CheckCircle /> Capture qualified leads and report the full conversation context back to the client.</li>
              </ul>
            </div>
            <div className="chat-demo" aria-label="Assistant chat preview">
              <div className="chat-demo-head">
                <span className="chat-demo-avatar"><Bot size={18} /></span>
                <div><b>Acme Assistant</b><small>● Online now</small></div>
              </div>
              <div className="chat-demo-body">
                <div className="message">Hi! I can help with plans, product details, or getting started. What would you like to know?</div>
                <div className="message message-user">Which plan is best for a growing team?</div>
                <div className="message">For a growing team, I’d recommend starting with the managed plan. It includes setup, ongoing knowledge updates, and priority support.</div>
              </div>
              <div className="chat-demo-input"><span className="chat-demo-placeholder">Ask a question…</span><span className="chat-demo-send"><Send /></span></div>
            </div>
          </div>
        </section>

        <section id="pricing" className="section section-soft">
          <div className="marketing-container">
            <div className="section-heading">
              <span className="eyebrow">Designed for agency growth</span>
              <h2>Choose how you deliver for clients</h2>
              <p>Build recurring service revenue with managed client chatbots, or deliver a complete ownership handover when the engagement calls for it.</p>
            </div>
            <div className="pricing-grid">
              <article className="pricing-card">
                <span className="plan-label">Managed</span>
                <h3>Managed Client Chatbots</h3>
                <p>Launch and maintain branded chatbots for your clients with a dependable delivery partner.</p>
                <div className="price"><strong>$199</strong><span>per month</span></div>
                <ul className="tick-list">
                  <li><CheckCircle /> Client-specific assistant configuration</li>
                  <li><CheckCircle /> Ongoing knowledge and content updates</li>
                  <li><CheckCircle /> Multi-client embed support and maintenance</li>
                  <li><CheckCircle /> Priority technical assistance for your team</li>
                </ul>
                <Link href="/dashboard" onClick={startWorkspace} className="button-secondary">Manage client deployments</Link>
              </article>
              <article className="pricing-card featured">
                <span className="plan-label">Full ownership</span>
                <h3>Client Ownership Handover</h3>
                <p>Give clients a complete, self-hostable handover bundle when they need to own the deployment.</p>
                <div className="price"><strong>$2,499</strong><span>one-time</span></div>
                <ul className="tick-list">
                  <li><CheckCircle /> Complete source-code package</li>
                  <li><CheckCircle /> Database export and branded widget code</li>
                  <li><CheckCircle /> Deployment documentation</li>
                  <li><CheckCircle /> No future platform fee for the client</li>
                </ul>
                <Link href="/dashboard" onClick={startWorkspace} className="button-primary">Offer the ownership option <ArrowRight size={15} /></Link>
              </article>
            </div>
          </div>
        </section>

        <section id="faq" className="section">
          <div className="marketing-container">
            <div className="section-heading">
              <span className="eyebrow">Agency questions, answered</span>
              <h2>Everything you need to deliver</h2>
            </div>
            <div className="faq-list">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <button
                    type="button"
                    className="faq-item"
                    data-open={isOpen}
                    key={faq.question}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question"><span>{faq.question}</span><ChevronDown /></span>
                    {isOpen && <span className="faq-answer">{faq.answer}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bottom-cta">
          <div className="marketing-container">
            <h2>Make every client conversation count.</h2>
            <p>Build a chatbot business your team can scale—and your clients will be proud to put in front of customers.</p>
            <Link href="/dashboard" onClick={startWorkspace} className="button-primary">Start your agency workspace <ArrowRight size={16} /></Link>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="marketing-container footer-content">
          <span>© 2026 ChatFlow. The AI chatbot platform for agencies.</span>
          <div className="footer-links"><a href="#features">Product</a><a href="#pricing">Pricing</a><Link href="/login">Log in</Link></div>
        </div>
      </footer>
    </div>
  );
}
