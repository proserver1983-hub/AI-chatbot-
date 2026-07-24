// Database Types & Helpers for ChatFlow AI
// These map directly to the Supabase tables defined in supabase-schema.sql

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  company_name: string;
  website: string;
  role: "admin" | "client";
  created_at: string;
  updated_at: string;
}

export interface Chatbot {
  id: string;
  client_id: string;
  name: string;
  avatar: string;
  brand_color: string;
  welcome_message: string;
  personality: string;
  language: string;
  business_info: string;
  ai_provider: "openai" | "gemini" | "claude";
  ai_model: string;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  chatbot_id: string;
  question: string;
  answer: string;
  created_at: string;
}

export interface KnowledgeSource {
  id: string;
  chatbot_id: string;
  source_type: "pdf" | "docx" | "txt" | "csv" | "url" | "faq" | "text";
  source_name: string;
  source_url: string;
  content_text: string;
  status: "pending" | "processing" | "ready" | "failed";
  crawl_metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ConversationDB {
  id: string;
  chatbot_id: string;
  client_id: string;
  lead_name: string;
  lead_email: string;
  lead_phone: string;
  lead_company: string;
  browser: string;
  country: string;
  device: "desktop" | "mobile" | "tablet";
  location: string;
  ip_address: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessageDB {
  id: string;
  conversation_id: string;
  sender: "user" | "bot";
  message_text: string;
  sources_retrieved: unknown[];
  created_at: string;
}

export interface LeadDB {
  id: string;
  chatbot_id: string;
  conversation_id: string | null;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "new" | "contacted" | "converted" | "lost";
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface WidgetSettingDB {
  id: string;
  chatbot_id: string;
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center";
  theme_mode: "light" | "dark" | "auto";
  launcher_icon: string;
  welcome_popup: boolean;
  show_branding: boolean;
  brand_colors: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AISettingDB {
  id: string;
  chatbot_id: string;
  provider: "openai" | "gemini" | "claude";
  model: string;
  temperature: number;
  max_tokens: number;
  fallback_enabled: boolean;
  system_prompt_template: string;
  created_at: string;
  updated_at: string;
}

export interface OwnershipTransferDB {
  id: string;
  client_id: string;
  chatbot_id: string | null;
  package_filename: string;
  download_url: string;
  agreement_signed: boolean;
  status: "prepared" | "downloaded" | "completed";
  created_at: string;
}
