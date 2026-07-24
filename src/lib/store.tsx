"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

// Types
export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  companyName: string;
  website: string;
  role: "admin" | "client";
  subscription: {
    plan: "Monthly Maintenance" | "Full Ownership" | "None";
    status: "Active" | "Pending" | "Completed" | "None";
    supportStatus: "Active Premium Support" | "Not Subscribed" | "Full Support Handed Over";
    price: string;
    startDate: string;
  };
}

export interface PDFDoc {
  id: string;
  name: string;
  size: string;
  status: "Processed" | "Processing";
}

export interface URLItem {
  id: string;
  url: string;
  status: "Crawled" | "Crawling";
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Chatbot {
  id: string;
  clientId: string;
  name: string;
  avatar: string;
  brandColor: string;
  welcomeMessage: string;
  personality: string;
  language: string;
  businessInfo: string;
  pdfs: PDFDoc[];
  urls: URLItem[];
  faqs: FAQ[];
  themeMode?: "light" | "dark" | "auto";
  launcherIcon?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  chatbotId: string;
  createdAt: string;
}

export interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  chatbotId: string;
  clientId: string;
  lead: { name?: string; email?: string; phone?: string } | null;
  messages: Message[];
  timestamp: string;
  browser: string;
  location: string;
}

// ---------------------------------------------------------------------------
// Initial Mock Data
// ---------------------------------------------------------------------------
const INITIAL_CLIENTS: ClientProfile[] = [
  {
    id: "client-apex",
    name: "Alex Rivera",
    email: "alex@apextech.io",
    companyName: "Apex Software Systems",
    website: "https://apextech.io",
    role: "client",
    subscription: {
      plan: "Monthly Maintenance",
      status: "Active",
      supportStatus: "Active Premium Support",
      price: "$199/mo",
      startDate: "2026-03-15",
    },
  },
  {
    id: "client-luxe",
    name: "Sophia Sterling",
    email: "sophia@luxewellness.com",
    companyName: "Luxe Wellness Retreats",
    website: "https://luxewellness.com",
    role: "client",
    subscription: {
      plan: "Full Ownership",
      status: "Pending",
      supportStatus: "Active Premium Support",
      price: "$2,499 one-time",
      startDate: "2026-07-01",
    },
  },
  {
    id: "client-solar",
    name: "Marcus Vance",
    email: "marcus@solardrive.co",
    companyName: "SolarDrive Systems",
    website: "https://solardrive.co",
    role: "client",
    subscription: {
      plan: "Monthly Maintenance",
      status: "Active",
      supportStatus: "Active Premium Support",
      price: "$199/mo",
      startDate: "2026-05-10",
    },
  },
  {
    id: "admin-id",
    name: "Admin Control",
    email: "admin@chatflow.ai",
    companyName: "ChatFlow AI Systems",
    website: "https://chatflow.ai",
    role: "admin",
    subscription: {
      plan: "None",
      status: "None",
      supportStatus: "Not Subscribed",
      price: "$0",
      startDate: "N/A",
    },
  },
];

const INITIAL_CHATBOTS: Chatbot[] = [
  {
    id: "bot-apex",
    clientId: "client-apex",
    name: "ApexBot",
    avatar: "🤖",
    brandColor: "#6366f1",
    welcomeMessage:
      "Welcome to Apex Software! I'm here to answer any questions about our Cloud Hosting, DevOps integrations, or Pricing. How can I help you today?",
    personality: "Professional, knowledgeable, and highly efficient. Focuses on tech architecture and speed.",
    language: "English",
    businessInfo:
      "Apex Software Systems offers secure Cloud Hosting starting at $49/mo, managed DevOps setups starting at $299/mo, and enterprise custom migrations. Support is available 24/7. Office location: San Francisco, CA.",
    pdfs: [
      { id: "pdf-1", name: "Apex_Hosting_Specifications_2026.pdf", size: "1.2 MB", status: "Processed" },
      { id: "pdf-2", name: "Apex_Security_Compliance_Whitepaper.pdf", size: "2.8 MB", status: "Processed" },
    ],
    urls: [
      { id: "url-1", url: "https://apextech.io/pricing", status: "Crawled" },
      { id: "url-2", url: "https://apextech.io/features/devops", status: "Crawled" },
    ],
    faqs: [
      {
        id: "faq-1",
        question: "What is your uptime guarantee?",
        answer: "We guarantee a 99.99% uptime for all Cloud Hosting customers backed by our premium Service Level Agreement (SLA).",
      },
      {
        id: "faq-2",
        question: "Do you offer a free trial?",
        answer: "Yes, we offer a 14-day fully featured free trial for our Cloud Hosting plans, no credit card required.",
      },
      {
        id: "faq-3",
        question: "How secure is our data on Apex?",
        answer: "Apex is SOC2 Type II certified. All data is encrypted in transit and at rest using AES-256 standards with active intrusion detection.",
      },
    ],
    themeMode: "dark",
    launcherIcon: "🤖",
  },
  {
    id: "bot-luxe",
    clientId: "client-luxe",
    name: "Luxe Concierge",
    avatar: "✨",
    brandColor: "#db2777",
    welcomeMessage:
      "Warm greetings from Luxe Wellness! I am your virtual wellness concierge. How may I assist you with retreats, spa bookings, or luxury accommodations today?",
    personality: "Warm, luxury-focused, elegant, and peaceful. Uses polite, accommodating, and elite vocabulary.",
    language: "English",
    businessInfo:
      "Luxe Wellness Retreats is located in Maui, Hawaii and Aspen, Colorado. Weekend escape packages start at $1,500 inclusive of spa, gourmet organic meals, and personal yoga guides. Phone reservations: +1 (800) LUXE-SPA.",
    pdfs: [
      { id: "pdf-3", name: "Luxe_Wellness_Spa_Menu_Maui.pdf", size: "4.1 MB", status: "Processed" },
    ],
    urls: [
      { id: "url-3", url: "https://luxewellness.com/packages", status: "Crawled" },
    ],
    faqs: [
      {
        id: "faq-4",
        question: "What is included in the Weekend Escape?",
        answer: "The Weekend Escape includes 2 nights in our oceanfront villa, 3 premium spa therapies, daily farm-to-table organic dining, and private yoga/meditation sessions.",
      },
      {
        id: "faq-5",
        question: "Is airport transport provided?",
        answer: "Absolutely. Standard package includes complimentary Tesla chauffeur transfer from Kahului (OGG) or Aspen (ASE) airports.",
      },
    ],
    themeMode: "light",
    launcherIcon: "✨",
  },
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    chatbotId: "bot-apex",
    clientId: "client-apex",
    lead: { name: "John Doe", email: "john@github.com", phone: "+1 (555) 987-6543" },
    timestamp: "2026-07-22 14:35",
    browser: "Chrome / macOS",
    location: "California, USA",
    messages: [
      {
        id: "m1",
        sender: "bot",
        text: "Welcome to Apex Software! I'm here to answer any questions about our Cloud Hosting, DevOps integrations, or Pricing. How can I help you today?",
        timestamp: "14:35",
      },
      { id: "m2", sender: "user", text: "What is your pricing for cloud hosting?", timestamp: "14:36" },
      {
        id: "m3",
        sender: "bot",
        text: "Our Cloud Hosting starts at $49/mo for the Standard plan. We also have a Pro plan at $149/mo and enterprise custom pricing. All plans include 24/7 premium support and our 99.99% uptime SLA.",
        timestamp: "14:36",
      },
      { id: "m4", sender: "user", text: "Do you have SOC2 security?", timestamp: "14:37" },
      {
        id: "m5",
        sender: "bot",
        text: "Yes, Apex is SOC2 Type II certified. All data is encrypted in transit and at rest using AES-256 standards with active intrusion detection.",
        timestamp: "14:37",
      },
      { id: "m6", sender: "user", text: "Can you take down my info so sales can reach out?", timestamp: "14:38" },
      { id: "m7", sender: "bot", text: "I'd love to! Please reply with your Name, Email, and Phone number.", timestamp: "14:38" },
      { id: "m8", sender: "user", text: "John Doe, john@github.com, +1 (555) 987-6543", timestamp: "14:39" },
      {
        id: "m9",
        sender: "bot",
        text: "Thank you, John! I've logged your contact information. A DevOps solutions consultant will reach out to john@github.com within 2 hours.",
        timestamp: "14:39",
      },
    ],
  },
  {
    id: "conv-2",
    chatbotId: "bot-apex",
    clientId: "client-apex",
    lead: null,
    timestamp: "2026-07-23 09:12",
    browser: "Safari / iOS",
    location: "London, UK",
    messages: [
      {
        id: "m10",
        sender: "bot",
        text: "Welcome to Apex Software! I'm here to answer any questions about our Cloud Hosting, DevOps integrations, or Pricing. How can I help you today?",
        timestamp: "09:12",
      },
      { id: "m11", sender: "user", text: "Do you have a free trial?", timestamp: "09:13" },
      {
        id: "m12",
        sender: "bot",
        text: "Yes, we offer a 14-day fully featured free trial for our Cloud Hosting plans, no credit card required.",
        timestamp: "09:13",
      },
    ],
  },
  {
    id: "conv-3",
    chatbotId: "bot-luxe",
    clientId: "client-luxe",
    lead: { name: "Samantha Collins", email: "samantha@luxurytravel.net", phone: "+44 7911 123456" },
    timestamp: "2026-07-21 18:20",
    browser: "Firefox / Windows",
    location: "London, UK",
    messages: [
      {
        id: "m13",
        sender: "bot",
        text: "Warm greetings from Luxe Wellness! I am your virtual wellness concierge. How may I assist you with retreats, spa bookings, or luxury accommodations today?",
        timestamp: "18:20",
      },
      { id: "m14", sender: "user", text: "Tell me about the Maui Weekend Escape package.", timestamp: "18:21" },
      {
        id: "m15",
        sender: "bot",
        text: "Our Weekend Escape in Maui, Hawaii includes 2 nights in our premium oceanfront villa, 3 restorative spa therapies, daily farm-to-table organic dining, and private meditation/yoga sessions. Standard price starts at $1,500 inclusive of all amenities.",
        timestamp: "18:21",
      },
      { id: "m16", sender: "user", text: "How can I book?", timestamp: "18:22" },
      {
        id: "m17",
        sender: "bot",
        text: "I can forward your booking interest to our elite concierge! Please provide your name and contact details so we can finalize your luxury reservation.",
        timestamp: "18:22",
      },
      { id: "m18", sender: "user", text: "Samantha Collins, samantha@luxurytravel.net, +44 7911 123456", timestamp: "18:23" },
      {
        id: "m19",
        sender: "bot",
        text: "Marvelous, Samantha. I have captured your details. A concierge specialist will contact you at samantha@luxurytravel.net or +44 7911 123456 shortly with priority dates.",
        timestamp: "18:23",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Storage helpers (safe for SSR)
// ---------------------------------------------------------------------------
const STORAGE_KEYS = {
  clients: "chatflow_clients",
  chatbots: "chatflow_chatbots",
  conversations: "chatflow_conversations",
  user: "chatflow_user",
};

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function safeGet<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

function safeRemove(key: string) {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}-${Date.now().toString(36)}`;
}

function nowTimeString() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function nowDateTime() {
  return new Date().toISOString().replace("T", " ").substring(0, 16);
}

function detectBrowser(): string {
  if (!isBrowser()) return "Web";
  const ua = navigator.userAgent;
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  return "Web Browser";
}

// ---------------------------------------------------------------------------
// Store Context
// ---------------------------------------------------------------------------
interface StoreContextType {
  clients: ClientProfile[];
  chatbots: Chatbot[];
  conversations: Conversation[];
  currentUser: ClientProfile | null;
  activeChatbotId: string | null;
  setCurrentUser: (user: ClientProfile | null) => void;
  setActiveChatbotId: (id: string | null) => void;
  updateClientProfile: (clientId: string, updates: Partial<ClientProfile>) => void;
  addChatbot: (clientId: string, name: string) => Chatbot;
  duplicateChatbot: (botId: string) => Chatbot | null;
  deleteChatbot: (botId: string) => void;
  updateChatbotSettings: (botId: string, updates: Partial<Chatbot>) => void;
  addFAQ: (botId: string, question: string, answer: string) => void;
  deleteFAQ: (botId: string, faqId: string) => void;
  addURL: (botId: string, url: string) => void;
  deleteURL: (botId: string, urlId: string) => void;
  addPDF: (botId: string, name: string, size: string) => void;
  deletePDF: (botId: string, pdfId: string) => void;
  sendMessage: (botId: string, text: string, conversationId?: string) => Promise<{ reply: string; conversationId: string }>;
  createConversation: (botId: string) => Conversation;
  deleteConversation: (conversationId: string) => void;
  updateSubscription: (clientId: string, plan: ClientProfile["subscription"]["plan"], status: ClientProfile["subscription"]["status"]) => void;
  startOwnershipTransfer: (clientId: string) => void;
  deleteClient: (clientId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Initialize with static data; hydrate from localStorage in effect to avoid SSR mismatch
  const [clients, setClients] = useState<ClientProfile[]>(INITIAL_CLIENTS);
  const [chatbots, setChatbots] = useState<Chatbot[]>(INITIAL_CHATBOTS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [currentUser, setCurrentUserState] = useState<ClientProfile | null>(INITIAL_CLIENTS[0]);
  const [activeChatbotId, setActiveChatbotId] = useState<string | null>(INITIAL_CHATBOTS[0]?.id || null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate once on mount
  useEffect(() => {
    const storedClients = safeGet<ClientProfile[] | null>(STORAGE_KEYS.clients, null);
    const storedBots = safeGet<Chatbot[] | null>(STORAGE_KEYS.chatbots, null);
    const storedConvs = safeGet<Conversation[] | null>(STORAGE_KEYS.conversations, null);
    const storedUser = safeGet<ClientProfile | null>(STORAGE_KEYS.user, null);

    if (storedClients && Array.isArray(storedClients) && storedClients.length > 0) setClients(storedClients);
    if (storedBots && Array.isArray(storedBots) && storedBots.length > 0) setChatbots(storedBots);
    if (storedConvs && Array.isArray(storedConvs)) setConversations(storedConvs);
    if (storedUser) {
      setCurrentUserState(storedUser);
      const userBots = storedBots || INITIAL_CHATBOTS;
      const userBot = userBots.find((b) => b.clientId === storedUser.id);
      setActiveChatbotId(userBot ? userBot.id : userBots[0]?.id || null);
    } else {
      // default active bot for default user
      const defaultUser = INITIAL_CLIENTS[0];
      const bot = INITIAL_CHATBOTS.find((b) => b.clientId === defaultUser.id);
      setActiveChatbotId(bot?.id || INITIAL_CHATBOTS[0]?.id || null);
    }
    setHydrated(true);
  }, []);

  // Sync helpers
  const syncClients = useCallback(
    (next: ClientProfile[]) => {
      setClients(next);
      safeSet(STORAGE_KEYS.clients, next);
      if (currentUser) {
        const updated = next.find((c) => c.id === currentUser.id);
        if (updated) {
          setCurrentUserState(updated);
          safeSet(STORAGE_KEYS.user, updated);
        }
      }
    },
    [currentUser]
  );

  const syncChatbots = useCallback((next: Chatbot[]) => {
    setChatbots(next);
    safeSet(STORAGE_KEYS.chatbots, next);
  }, []);

  const syncConversations = useCallback((next: Conversation[]) => {
    setConversations(next);
    safeSet(STORAGE_KEYS.conversations, next);
  }, []);

  const setCurrentUser = useCallback(
    (user: ClientProfile | null) => {
      setCurrentUserState(user);
      if (user) {
        safeSet(STORAGE_KEYS.user, user);
        // Set active chatbot to this user's first chatbot (use latest chatbots state via getter)
        const storedBots = safeGet<Chatbot[] | null>(STORAGE_KEYS.chatbots, null) || chatbots;
        const userBot = storedBots.find((b) => b.clientId === user.id);
        setActiveChatbotId(userBot ? userBot.id : null);
      } else {
        safeRemove(STORAGE_KEYS.user);
        setActiveChatbotId(null);
      }
    },
    [chatbots]
  );

  // -------------------------------------------------------------------------
  // Client / Chatbot management
  // -------------------------------------------------------------------------
  const updateClientProfile = useCallback(
    (clientId: string, updates: Partial<ClientProfile>) => {
      const updated = clients.map((c) => {
        if (c.id !== clientId) return c;
        // deep merge subscription if provided
        if (updates.subscription) {
          return { ...c, ...updates, subscription: { ...c.subscription, ...updates.subscription } };
        }
        return { ...c, ...updates };
      });
      syncClients(updated);
    },
    [clients, syncClients]
  );

  const addChatbot = useCallback(
    (clientId: string, name: string): Chatbot => {
      const owner = clients.find((c) => c.id === clientId);
      const newBot: Chatbot = {
        id: generateId("bot"),
        clientId,
        name: name.trim() || "New Assistant",
        avatar: "🤖",
        brandColor: "#6366f1",
        welcomeMessage: `Hi there! I'm ${name.trim() || "your assistant"} for ${owner?.companyName || "our business"}. How can I help you today?`,
        personality: "Helpful, energetic, and informative. Strives to provide quick solutions and collect leads.",
        language: "English",
        businessInfo: `${owner?.companyName || "Our company"} offers premium solutions and dedicated support. Reach out for consultations, pricing, or onboarding details!`,
        pdfs: [],
        urls: [],
        faqs: [
          {
            id: generateId("faq"),
            question: "What services do you offer?",
            answer: "We offer professional tailored solutions for our clients. Connect with our experts today for a personalized consultation!",
          },
          {
            id: generateId("faq"),
            question: "How can I contact support?",
            answer: "You can leave your details right here in the chat and our team will reach out within a couple of hours, or check our website contact page!",
          },
        ],
        themeMode: "light",
        launcherIcon: "🤖",
      };
      const next = [...chatbots, newBot];
      syncChatbots(next);
      setActiveChatbotId(newBot.id);
      return newBot;
    },
    [chatbots, clients, syncChatbots]
  );

  const duplicateChatbot = useCallback(
    (botId: string): Chatbot | null => {
      const source = chatbots.find((b) => b.id === botId);
      if (!source) return null;
      const copy: Chatbot = {
        ...source,
        id: generateId("bot"),
        name: `${source.name} Copy`,
        // Deep clone arrays to avoid shared references
        pdfs: source.pdfs.map((p) => ({ ...p, id: generateId("pdf") })),
        urls: source.urls.map((u) => ({ ...u, id: generateId("url") })),
        faqs: source.faqs.map((f) => ({ ...f, id: generateId("faq") })),
      };
      const next = [...chatbots, copy];
      syncChatbots(next);
      setActiveChatbotId(copy.id);
      return copy;
    },
    [chatbots, syncChatbots]
  );

  const deleteChatbot = useCallback(
    (botId: string) => {
      const remaining = chatbots.filter((b) => b.id !== botId);
      syncChatbots(remaining);
      // also purge its conversations for cleanliness
      const remainingConvs = conversations.filter((c) => c.chatbotId !== botId);
      if (remainingConvs.length !== conversations.length) syncConversations(remainingConvs);
      if (activeChatbotId === botId) {
        setActiveChatbotId(remaining[0]?.id || null);
      }
    },
    [chatbots, conversations, activeChatbotId, syncChatbots, syncConversations]
  );

  const updateChatbotSettings = useCallback(
    (botId: string, updates: Partial<Chatbot>) => {
      const next = chatbots.map((b) => (b.id === botId ? { ...b, ...updates } : b));
      syncChatbots(next);
    },
    [chatbots, syncChatbots]
  );

  const addFAQ = useCallback(
    (botId: string, question: string, answer: string) => {
      const newFaq: FAQ = {
        id: generateId("faq"),
        question: question.trim(),
        answer: answer.trim(),
      };
      if (!newFaq.question || !newFaq.answer) return;
      const next = chatbots.map((b) => (b.id === botId ? { ...b, faqs: [...b.faqs, newFaq] } : b));
      syncChatbots(next);
    },
    [chatbots, syncChatbots]
  );

  const deleteFAQ = useCallback(
    (botId: string, faqId: string) => {
      const next = chatbots.map((b) => (b.id === botId ? { ...b, faqs: b.faqs.filter((f) => f.id !== faqId) } : b));
      syncChatbots(next);
    },
    [chatbots, syncChatbots]
  );

  const addURL = useCallback(
    (botId: string, url: string) => {
      const trimmed = url.trim();
      if (!trimmed) return;
      try {
        new URL(trimmed);
      } catch {
        // allow but still add - validation done elsewhere
      }
      const newUrl: URLItem = {
        id: generateId("url"),
        url: trimmed,
        status: "Crawled",
      };
      const next = chatbots.map((b) => (b.id === botId ? { ...b, urls: [...b.urls, newUrl] } : b));
      syncChatbots(next);
    },
    [chatbots, syncChatbots]
  );

  const deleteURL = useCallback(
    (botId: string, urlId: string) => {
      const next = chatbots.map((b) => (b.id === botId ? { ...b, urls: b.urls.filter((u) => u.id !== urlId) } : b));
      syncChatbots(next);
    },
    [chatbots, syncChatbots]
  );

  const addPDF = useCallback(
    (botId: string, name: string, size: string) => {
      const newPdf: PDFDoc = {
        id: generateId("pdf"),
        name,
        size,
        status: "Processed",
      };
      const next = chatbots.map((b) => (b.id === botId ? { ...b, pdfs: [...b.pdfs, newPdf] } : b));
      syncChatbots(next);
    },
    [chatbots, syncChatbots]
  );

  const deletePDF = useCallback(
    (botId: string, pdfId: string) => {
      const next = chatbots.map((b) => (b.id === botId ? { ...b, pdfs: b.pdfs.filter((p) => p.id !== pdfId) } : b));
      syncChatbots(next);
    },
    [chatbots, syncChatbots]
  );

  // -------------------------------------------------------------------------
  // Conversations
  // -------------------------------------------------------------------------
  const createConversation = useCallback(
    (botId: string): Conversation => {
      const bot = chatbots.find((b) => b.id === botId);
      if (!bot) throw new Error("Chatbot not found");
      const newConv: Conversation = {
        id: generateId("conv"),
        chatbotId: botId,
        clientId: bot.clientId,
        lead: null,
        timestamp: nowDateTime(),
        browser: detectBrowser(),
        location: "United States",
        messages: [
          {
            id: generateId("msg"),
            sender: "bot",
            text: bot.welcomeMessage,
            timestamp: nowTimeString(),
          },
        ],
      };
      const next = [...conversations, newConv];
      syncConversations(next);
      return newConv;
    },
    [chatbots, conversations, syncConversations]
  );

  const deleteConversation = useCallback(
    (conversationId: string) => {
      const next = conversations.filter((c) => c.id !== conversationId);
      syncConversations(next);
    },
    [conversations, syncConversations]
  );

  const sendMessage = useCallback(
    async (botId: string, text: string, conversationId?: string): Promise<{ reply: string; conversationId: string }> => {
      const bot = chatbots.find((b) => b.id === botId);
      if (!bot) throw new Error("Chatbot not found");

      let conv = conversations.find((c) => c.id === conversationId);
      if (!conv) {
        conv = createConversation(botId);
      }

      const timeString = nowTimeString();
      const userMsg: Message = {
        id: generateId("msg"),
        sender: "user",
        text: text.trim(),
        timestamp: timeString,
      };

      // Lead extraction
      let leadUpdated = conv.lead;
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const phoneRegex = /(\+?\d{1,4}[\s.-]?)?(\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}/g;
      const emails = text.match(emailRegex);
      const phones = text.match(phoneRegex)?.filter((p) => p.replace(/\D/g, "").length >= 7);

      if (emails || phones) {
        const email = emails ? emails[0] : leadUpdated?.email || "";
        const phone = phones ? phones[0] : leadUpdated?.phone || "";
        let name = leadUpdated?.name || "";
        if (!name) {
          const words = text
            .split(/[\s,]+/)
            .map((w) => w.trim())
            .filter(Boolean);
          const nameCandidates = words.filter((w) => /^[A-Z][a-z]+$/.test(w) && !w.includes("@") && w.length > 1);
          if (nameCandidates.length > 0) {
            name = nameCandidates.slice(0, 2).join(" ");
          } else {
            name = "Captured Lead";
          }
        }
        leadUpdated = { name, email, phone };
      }

      // Build history for AI
      const convHistory = [...conv.messages, userMsg].slice(-12).map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      // Try API
      let botReplyText = "";
      try {
        const apiResponse = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            chatbotId: bot.id,
            businessInfo: bot.businessInfo,
            faqs: bot.faqs,
            personality: bot.personality,
            conversationHistory: convHistory.slice(0, -1), // exclude current user msg because API adds it
          }),
        });

        if (apiResponse.ok) {
          const data = await apiResponse.json();
          if (data.reply && typeof data.reply === "string" && data.reply.trim().length > 0) {
            botReplyText = data.reply.trim();
          } else {
            throw new Error("Empty reply from API");
          }
        } else {
          throw new Error(`API ${apiResponse.status}`);
        }
      } catch {
        // Local fallback engine
        const lowerMsg = text.toLowerCase();

        const matchedFaq = bot.faqs.find((f) => {
          const qLow = f.question.toLowerCase();
          if (lowerMsg.includes(qLow)) return true;
          const keywords = qLow.split(/\s+/).filter((w) => w.length > 3);
          if (keywords.length === 0) return false;
          const overlap = keywords.filter((k) => lowerMsg.includes(k)).length;
          return overlap >= Math.max(1, Math.ceil(keywords.length * 0.6));
        });

        if (matchedFaq) {
          botReplyText = matchedFaq.answer;
        } else if (/(price|cost|pricing|plan|how much|subscription)/i.test(lowerMsg)) {
          const pFaq = bot.faqs.find((f) => /price|pricing|cost|plan/i.test(f.question));
          botReplyText = pFaq
            ? pFaq.answer
            : `Regarding pricing, ${bot.name} offers tailored plans designed for growth. Our standard packages are subscription-based and tailored to your use case. Could you share your name and contact details so our team can send you a detailed quote?`;
        } else if (/(support|contact|help|email|phone|talk to human)/i.test(lowerMsg)) {
          botReplyText =
            "We offer dedicated support! Please share your name, email, and phone number here, and a specialist will reach out within a couple of hours.";
        } else {
          const snippet = bot.businessInfo.slice(0, 200);
          botReplyText = `Thanks for asking! ${snippet}${bot.businessInfo.length > 200 ? "..." : ""} Would you like me to connect you with our team? Just leave your contact details and we'll follow up shortly.`;
        }
      }

      const botMsg: Message = {
        id: generateId("msg"),
        sender: "bot",
        text: botReplyText,
        timestamp: timeString,
      };

      const updatedConv: Conversation = {
        ...conv,
        lead: leadUpdated,
        messages: [...conv.messages, userMsg, botMsg],
        timestamp: nowDateTime(),
      };

      // Re-read latest conversations state to avoid race - but using closure list for simplicity
      const latestConvs = safeGet<Conversation[] | null>(STORAGE_KEYS.conversations, null) || conversations;
      const exists = latestConvs.some((c) => c.id === conv!.id);
      const finalList = exists ? latestConvs.map((c) => (c.id === conv!.id ? updatedConv : c)) : [...latestConvs, updatedConv];
      syncConversations(finalList);

      return { reply: botReplyText, conversationId: conv.id };
    },
    [chatbots, conversations, createConversation, syncConversations]
  );

  const updateSubscription = useCallback(
    (clientId: string, plan: ClientProfile["subscription"]["plan"], status: ClientProfile["subscription"]["status"]) => {
      const next = clients.map((c) => {
        if (c.id !== clientId) return c;
        const isFull = plan === "Full Ownership";
        return {
          ...c,
          subscription: {
            ...c.subscription,
            plan,
            status,
            supportStatus: isFull
              ? status === "Completed"
                ? ("Full Support Handed Over" as const)
                : ("Active Premium Support" as const)
              : status === "Active"
              ? ("Active Premium Support" as const)
              : ("Not Subscribed" as const),
            price: isFull ? "$2,499 one-time" : plan === "Monthly Maintenance" ? "$199/mo" : "$0",
            startDate: new Date().toISOString().substring(0, 10),
          },
        };
      });
      syncClients(next);
    },
    [clients, syncClients]
  );

  const startOwnershipTransfer = useCallback(
    (clientId: string) => {
      const next = clients.map((c) => {
        if (c.id !== clientId) return c;
        return {
          ...c,
          subscription: {
            ...c.subscription,
            plan: "Full Ownership" as const,
            status: "Completed" as const,
            supportStatus: "Full Support Handed Over" as const,
          },
        };
      });
      syncClients(next);
    },
    [clients, syncClients]
  );

  const deleteClient = useCallback(
    (clientId: string) => {
      const remainingClients = clients.filter((c) => c.id !== clientId);
      syncClients(remainingClients);
      const remainingBots = chatbots.filter((b) => b.clientId !== clientId);
      syncChatbots(remainingBots);
      const remainingConvs = conversations.filter((c) => c.clientId !== clientId);
      syncConversations(remainingConvs);
      if (currentUser?.id === clientId) {
        setCurrentUser(null);
      }
    },
    [clients, chatbots, conversations, currentUser, syncClients, syncChatbots, syncConversations]
  );

  return (
    <StoreContext.Provider
      value={{
        clients,
        chatbots,
        conversations,
        currentUser: hydrated ? currentUser : INITIAL_CLIENTS[0],
        activeChatbotId,
        setCurrentUser,
        setActiveChatbotId,
        updateClientProfile,
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
        createConversation,
        updateSubscription,
        startOwnershipTransfer,
        deleteClient,
        deleteConversation,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
