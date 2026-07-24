"use client";

import React, { createContext, useContext, useState } from "react";

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
  avatar: string; // Emoji or url
  brandColor: string;
  welcomeMessage: string;
  personality: string;
  language: string;
  businessInfo: string;
  pdfs: PDFDoc[];
  urls: URLItem[];
  faqs: FAQ[];
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

// Initial Mock Data
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
    welcomeMessage: "Welcome to Apex Software! I'm here to answer any questions about our Cloud Hosting, DevOps integrations, or Pricing. How can I help you today?",
    personality: "Professional, knowledgeable, and highly efficient. Focuses on tech architecture and speed.",
    language: "English",
    businessInfo: "Apex Software Systems offers secure Cloud Hosting starting at $49/mo, managed DevOps setups starting at $299/mo, and enterprise custom migrations. Support is available 24/7. Office location: San Francisco, CA.",
    pdfs: [
      { id: "pdf-1", name: "Apex_Hosting_Specifications_2026.pdf", size: "1.2 MB", status: "Processed" },
      { id: "pdf-2", name: "Apex_Security_Compliance_Whitepaper.pdf", size: "2.8 MB", status: "Processed" },
    ],
    urls: [
      { id: "url-1", url: "https://apextech.io/pricing", status: "Crawled" },
      { id: "url-2", url: "https://apextech.io/features/devops", status: "Crawled" },
    ],
    faqs: [
      { id: "faq-1", question: "What is your uptime guarantee?", answer: "We guarantee a 99.99% uptime for all Cloud Hosting customers backed by our premium Service Level Agreement (SLA)." },
      { id: "faq-2", question: "Do you offer a free trial?", answer: "Yes, we offer a 14-day fully featured free trial for our Cloud Hosting plans, no credit card required." },
      { id: "faq-3", question: "How secure is our data on Apex?", answer: "Apex is SOC2 Type II certified. All data is encrypted in transit and at rest using AES-256 standards with active intrusion detection." },
    ],
  },
  {
    id: "bot-luxe",
    clientId: "client-luxe",
    name: "Luxe Concierge",
    avatar: "✨",
    brandColor: "#db2777",
    welcomeMessage: "Warm greetings from Luxe Wellness! I am your virtual wellness concierge. How may I assist you with retreats, spa bookings, or luxury accommodations today?",
    personality: "Warm, luxury-focused, elegant, and peaceful. Uses polite, accommodating, and elite vocabulary.",
    language: "English",
    businessInfo: "Luxe Wellness Retreats is located in Maui, Hawaii and Aspen, Colorado. Weekend escape packages start at $1,500 inclusive of spa, gourmet organic meals, and personal yoga guides. Phone reservations: +1 (800) LUXE-SPA.",
    pdfs: [
      { id: "pdf-3", name: "Luxe_Wellness_Spa_Menu_Maui.pdf", size: "4.1 MB", status: "Processed" },
    ],
    urls: [
      { id: "url-3", url: "https://luxewellness.com/packages", status: "Crawled" },
    ],
    faqs: [
      { id: "faq-4", question: "What is included in the Weekend Escape?", answer: "The Weekend Escape includes 2 nights in our oceanfront villa, 3 premium spa therapies, daily farm-to-table organic dining, and private yoga/meditation sessions." },
      { id: "faq-5", question: "Is airport transport provided?", answer: "Absolutely. Standard package includes complimentary Tesla chauffeur transfer from Kahului (OGG) or Aspen (ASE) airports." },
    ],
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
      { id: "m1", sender: "bot", text: "Welcome to Apex Software! I'm here to answer any questions about our Cloud Hosting, DevOps integrations, or Pricing. How can I help you today?", timestamp: "14:35" },
      { id: "m2", sender: "user", text: "What is your pricing for cloud hosting?", timestamp: "14:36" },
      { id: "m3", sender: "bot", text: "Our Cloud Hosting starts at $49/mo for the Standard plan. We also have a Pro plan at $149/mo and enterprise custom pricing. All plans include 24/7 premium support and our 99.99% uptime SLA.", timestamp: "14:36" },
      { id: "m4", sender: "user", text: "Do you have SOC2 security?", timestamp: "14:37" },
      { id: "m5", sender: "bot", text: "Yes, Apex is SOC2 Type II certified. All data is encrypted in transit and at rest using AES-256 standards with active intrusion detection.", timestamp: "14:37" },
      { id: "m6", sender: "user", text: "Can you take down my info so sales can reach out?", timestamp: "14:38" },
      { id: "m7", sender: "bot", text: "I'd love to! Please reply with your Name, Email, and Phone number.", timestamp: "14:38" },
      { id: "m8", sender: "user", text: "John Doe, john@github.com, +1 (555) 987-6543", timestamp: "14:39" },
      { id: "m9", sender: "bot", text: "Thank you, John! I've logged your contact information. A DevOps solutions consultant will reach out to john@github.com within 2 hours.", timestamp: "14:39" },
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
      { id: "m10", sender: "bot", text: "Welcome to Apex Software! I'm here to answer any questions about our Cloud Hosting, DevOps integrations, or Pricing. How can I help you today?", timestamp: "09:12" },
      { id: "m11", sender: "user", text: "Do you have a free trial?", timestamp: "09:13" },
      { id: "m12", sender: "bot", text: "Yes, we offer a 14-day fully featured free trial for our Cloud Hosting plans, no credit card required.", timestamp: "09:13" },
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
      { id: "m13", sender: "bot", text: "Warm greetings from Luxe Wellness! I am your virtual wellness concierge. How may I assist you with retreats, spa bookings, or luxury accommodations today?", timestamp: "18:20" },
      { id: "m14", sender: "user", text: "Tell me about the Maui Weekend Escape package.", timestamp: "18:21" },
      { id: "m15", sender: "bot", text: "Our Weekend Escape in Maui, Hawaii includes 2 nights in our premium oceanfront villa, 3 restorative spa therapies, daily farm-to-table organic dining, and private meditation/yoga sessions. Standard price starts at $1,500 inclusive of all amenities.", timestamp: "18:21" },
      { id: "m16", sender: "user", text: "How can I book?", timestamp: "18:22" },
      { id: "m17", sender: "bot", text: "I can forward your booking interest to our elite concierge! Please provide your name and contact details so we can finalize your luxury reservation.", timestamp: "18:22" },
      { id: "m18", sender: "user", text: "Samantha Collins, samantha@luxurytravel.net, +44 7911 123456", timestamp: "18:23" },
      { id: "m19", sender: "bot", text: "Marvelous, Samantha. I have captured your details. A concierge specialist will contact you at samantha@luxurytravel.net or +44 7911 123456 shortly with priority dates.", timestamp: "18:23" },
    ],
  },
];

interface StoreContextType {
  clients: ClientProfile[];
  chatbots: Chatbot[];
  conversations: Conversation[];
  currentUser: ClientProfile | null;
  activeChatbotId: string | null;
  setCurrentUser: (user: ClientProfile | null) => void;
  setActiveChatbotId: (id: string | null) => void;
  
  // Client functions
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
  
  // Conversational API Simulation
  sendMessage: (botId: string, text: string, conversationId?: string) => Promise<{ reply: string; conversationId: string }>;
  createConversation: (botId: string) => Conversation;
  deleteConversation: (conversationId: string) => void;
  
  // Admin functions
  updateSubscription: (clientId: string, plan: ClientProfile["subscription"]["plan"], status: ClientProfile["subscription"]["status"]) => void;
  startOwnershipTransfer: (clientId: string) => void;
  deleteClient: (clientId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<ClientProfile[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("chatflow_clients");
      if (stored) return JSON.parse(stored);
    }
    return INITIAL_CLIENTS;
  });

  const [chatbots, setChatbots] = useState<Chatbot[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("chatflow_chatbots");
      if (stored) return JSON.parse(stored);
    }
    return INITIAL_CHATBOTS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("chatflow_conversations");
      if (stored) return JSON.parse(stored);
    }
    return INITIAL_CONVERSATIONS;
  });

  const [currentUser, setCurrentUserState] = useState<ClientProfile | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("chatflow_user");
      if (stored) return JSON.parse(stored);
    }
    return INITIAL_CLIENTS[0];
  });

  const [activeChatbotId, setActiveChatbotId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("chatflow_user");
      const user = storedUser ? JSON.parse(storedUser) : INITIAL_CLIENTS[0];
      const storedBots = localStorage.getItem("chatflow_chatbots");
      const bots = storedBots ? JSON.parse(storedBots) : INITIAL_CHATBOTS;
      const userBot = bots.find((b: Chatbot) => b.clientId === user?.id);
      return userBot ? userBot.id : (bots[0]?.id || null);
    }
    return INITIAL_CHATBOTS[0]?.id || null;
  });

  // Sync to local storage
  const syncClients = (newClients: ClientProfile[]) => {
    setClients(newClients);
    localStorage.setItem("chatflow_clients", JSON.stringify(newClients));
    if (currentUser) {
      const updatedUser = newClients.find(c => c.id === currentUser.id);
      if (updatedUser) {
        setCurrentUserState(updatedUser);
        localStorage.setItem("chatflow_user", JSON.stringify(updatedUser));
      }
    }
  };

  const syncChatbots = (newChatbots: Chatbot[]) => {
    setChatbots(newChatbots);
    localStorage.setItem("chatflow_chatbots", JSON.stringify(newChatbots));
  };

  const syncConversations = (newConversations: Conversation[]) => {
    setConversations(newConversations);
    localStorage.setItem("chatflow_conversations", JSON.stringify(newConversations));
  };

  const setCurrentUser = (user: ClientProfile | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem("chatflow_user", JSON.stringify(user));
      // Set active chatbot to this user's first chatbot
      const userBot = chatbots.find(b => b.clientId === user.id);
      if (userBot) {
        setActiveChatbotId(userBot.id);
      } else {
        setActiveChatbotId(null);
      }
    } else {
      localStorage.removeItem("chatflow_user");
      setActiveChatbotId(null);
    }
  };

  const updateClientProfile = (clientId: string, updates: Partial<ClientProfile>) => {
    const updated = clients.map(c => c.id === clientId ? { ...c, ...updates } : c);
    syncClients(updated);
  };

  const addChatbot = (clientId: string, name: string): Chatbot => {
    const newBot: Chatbot = {
      id: "bot-" + Math.random().toString(36).substring(2, 9),
      clientId,
      name,
      avatar: "🤖",
      brandColor: "#6366f1",
      welcomeMessage: `Hi there! I am your AI assistant for ${clients.find(c => c.id === clientId)?.companyName || "our business"}. How can I assist you today?`,
      personality: "Helpful, energetic, and informative. Strives to provide quick solutions and collect leads.",
      language: "English",
      businessInfo: `${clients.find(c => c.id === clientId)?.companyName || "Our company"} offers premium solutions. Reach out for consultations or support details!`,
      pdfs: [],
      urls: [],
      faqs: [
        { id: "faq-default-1", question: "What services do you offer?", answer: "We offer professional tailored solutions for our clients. Connect with our experts today!" },
        { id: "faq-default-2", question: "How can I contact support?", answer: "You can write a message here and leave your details, or check our website contact details!" }
      ],
    };
    const updated = [...chatbots, newBot];
    syncChatbots(updated);
    setActiveChatbotId(newBot.id);
    return newBot;
  };

  const duplicateChatbot = (botId: string): Chatbot | null => {
    const source = chatbots.find(b => b.id === botId);
    if (!source) return null;
    const copy = { ...source, id: "bot-" + Math.random().toString(36).substring(2, 9), name: `${source.name} Copy` };
    syncChatbots([...chatbots, copy]);
    setActiveChatbotId(copy.id);
    return copy;
  };

  const deleteChatbot = (botId: string) => {
    syncChatbots(chatbots.filter(b => b.id !== botId));
    if (activeChatbotId === botId) setActiveChatbotId(null);
  };

  const updateChatbotSettings = (botId: string, updates: Partial<Chatbot>) => {
    const updated = chatbots.map(b => b.id === botId ? { ...b, ...updates } : b);
    syncChatbots(updated);
  };

  const addFAQ = (botId: string, question: string, answer: string) => {
    const newFaq: FAQ = {
      id: "faq-" + Math.random().toString(36).substring(2, 9),
      question,
      answer,
    };
    const updated = chatbots.map(b => {
      if (b.id === botId) {
        return { ...b, faqs: [...b.faqs, newFaq] };
      }
      return b;
    });
    syncChatbots(updated);
  };

  const deleteFAQ = (botId: string, faqId: string) => {
    const updated = chatbots.map(b => {
      if (b.id === botId) {
        return { ...b, faqs: b.faqs.filter(f => f.id !== faqId) };
      }
      return b;
    });
    syncChatbots(updated);
  };

  const addURL = (botId: string, url: string) => {
    const newUrl: URLItem = {
      id: "url-" + Math.random().toString(36).substring(2, 9),
      url,
      status: "Crawled",
    };
    const updated = chatbots.map(b => {
      if (b.id === botId) {
        return { ...b, urls: [...b.urls, newUrl] };
      }
      return b;
    });
    syncChatbots(updated);
  };

  const deleteURL = (botId: string, urlId: string) => {
    const updated = chatbots.map(b => {
      if (b.id === botId) {
        return { ...b, urls: b.urls.filter(u => u.id !== urlId) };
      }
      return b;
    });
    syncChatbots(updated);
  };

  const addPDF = (botId: string, name: string, size: string) => {
    const newPdf: PDFDoc = {
      id: "pdf-" + Math.random().toString(36).substring(2, 9),
      name,
      size,
      status: "Processed",
    };
    const updated = chatbots.map(b => {
      if (b.id === botId) {
        return { ...b, pdfs: [...b.pdfs, newPdf] };
      }
      return b;
    });
    syncChatbots(updated);
  };

  const deletePDF = (botId: string, pdfId: string) => {
    const updated = chatbots.map(b => {
      if (b.id === botId) {
        return { ...b, pdfs: b.pdfs.filter(p => p.id !== pdfId) };
      }
      return b;
    });
    syncChatbots(updated);
  };

  const createConversation = (botId: string): Conversation => {
    const bot = chatbots.find(b => b.id === botId);
    if (!bot) throw new Error("Chatbot not found");
    const newConv: Conversation = {
      id: "conv-" + Math.random().toString(36).substring(2, 9),
      chatbotId: botId,
      clientId: bot.clientId,
      lead: null,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      browser: typeof window !== "undefined" ? navigator.userAgent.split(" ")[0] || "Web Browser" : "Web Browser",
      location: "San Francisco, USA",
      messages: [
        {
          id: "m-welcome",
          sender: "bot",
          text: bot.welcomeMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ],
    };
    syncConversations([...conversations, newConv]);
    return newConv;
  };

  const sendMessage = async (botId: string, text: string, conversationId?: string): Promise<{ reply: string; conversationId: string }> => {
    const bot = chatbots.find(b => b.id === botId);
    if (!bot) throw new Error("Chatbot not found");

    let conv = conversations.find(c => c.id === conversationId);
    if (!conv) {
      conv = createConversation(botId);
    }

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: "msg-" + Math.random().toString(36).substring(2, 9),
      sender: "user",
      text,
      timestamp: timeString,
    };

    // Append user message
    let updatedMessages = [...conv.messages, userMsg];

    // Check if the user message contains contact info (lead capture)
    let leadUpdated = conv.lead;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /(\+?\d{1,4}[-.\s]??)?(\(?\d{2,3}\)?[-.\s]??)?\d{3,4}[-.\s]??\d{4}/g;

    const emails = text.match(emailRegex);
    const phones = text.match(phoneRegex);

    if (emails || phones) {
      const email = emails ? emails[0] : (leadUpdated?.email || "");
      const phone = phones ? phones[0] : (leadUpdated?.phone || "");
      const words = text.split(/[\s,]+/);
      let name = leadUpdated?.name || "";
      if (!name) {
        const potentialName = words.filter(w => w && w[0] === w[0]?.toUpperCase() && !w.includes("@") && isNaN(Number(w)));
        if (potentialName.length > 0) {
          name = potentialName.slice(0, 2).join(" ");
        } else {
          name = "Captured Lead";
        }
      }
      leadUpdated = { name, email, phone };
    }

    // Call API or smart local solver
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
        }),
      });

      if (apiResponse.ok) {
        const data = await apiResponse.json();
        botReplyText = data.reply;
      } else {
        throw new Error("API call failed");
      }
    } catch {
      // Local fallback answering engine matching FAQs or business info
      const lowerMsg = text.toLowerCase();
      const matchedFaq = bot.faqs.find(f => lowerMsg.includes(f.question.toLowerCase()) || f.question.toLowerCase().split(" ").every(word => word.length < 3 || lowerMsg.includes(word)));
      
      if (matchedFaq) {
        botReplyText = matchedFaq.answer;
      } else if (lowerMsg.includes("price") || lowerMsg.includes("pricing") || lowerMsg.includes("cost") || lowerMsg.includes("how much")) {
        const pFaq = bot.faqs.find(f => f.question.toLowerCase().includes("pricing") || f.question.toLowerCase().includes("cost"));
        botReplyText = pFaq ? pFaq.answer : `Regarding our pricing, ${bot.name} is built on tailored plans. Standard products start from custom subscription models. Please leave your contact details so our business team can send you a detailed quote!`;
      } else if (lowerMsg.includes("support") || lowerMsg.includes("contact") || lowerMsg.includes("help") || lowerMsg.includes("email")) {
        botReplyText = `We offer round-the-clock support. Please share your email address or phone number, and a representative will reach out to you within the next couple of hours!`;
      } else {
        botReplyText = `Thanks for asking! Based on our training knowledge, ${bot.name} is designed to optimize user onboarding. ${bot.businessInfo.slice(0, 150)}... Would you like to get in touch with our representative? If so, kindly leave your name and contact details!`;
      }
    }

    const botMsg: Message = {
      id: "msg-" + Math.random().toString(36).substring(2, 9),
      sender: "bot",
      text: botReplyText,
      timestamp: timeString,
    };

    updatedMessages = [...updatedMessages, botMsg];

    const updatedConv: Conversation = {
      ...conv,
      lead: leadUpdated,
      messages: updatedMessages,
    };

    const finalConversations = conversations.map(c => c.id === conv.id ? updatedConv : c);
    syncConversations(finalConversations);

    return { reply: botReplyText, conversationId: conv.id };
  };

  const updateSubscription = (clientId: string, plan: ClientProfile["subscription"]["plan"], status: ClientProfile["subscription"]["status"]) => {
    const updated = clients.map(c => {
      if (c.id === clientId) {
        const isFull = plan === "Full Ownership";
        return {
          ...c,
          subscription: {
            ...c.subscription,
            plan,
            status,
            supportStatus: isFull 
              ? (status === "Completed" ? "Full Support Handed Over" as const : "Active Premium Support" as const)
              : (status === "Active" ? "Active Premium Support" as const : "Not Subscribed" as const),
            price: isFull ? "$2,499 one-time" : (plan === "Monthly Maintenance" ? "$199/mo" : "$0"),
            startDate: new Date().toISOString().substring(0, 10),
          }
        };
      }
      return c;
    });
    syncClients(updated);
  };

  const startOwnershipTransfer = (clientId: string) => {
    const updated = clients.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          subscription: {
            ...c.subscription,
            plan: "Full Ownership" as const,
            status: "Completed" as const,
            supportStatus: "Full Support Handed Over" as const,
          }
        };
      }
      return c;
    });
    syncClients(updated);
  };

  const deleteClient = (clientId: string) => {
    const updated = clients.filter(c => c.id !== clientId);
    syncClients(updated);
    // Delete their chatbots too
    const remainingBots = chatbots.filter(b => b.clientId !== clientId);
    syncChatbots(remainingBots);
  };

  const deleteConversation = (conversationId: string) => {
    const updated = conversations.filter(c => c.id !== conversationId);
    syncConversations(updated);
  };

  return (
    <StoreContext.Provider
      value={{
        clients,
        chatbots,
        conversations,
        currentUser,
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
