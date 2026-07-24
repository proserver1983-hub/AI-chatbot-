-- ChatFlow AI — Full PostgreSQL Schema (Supabase Compatible)
-- Run this in your Supabase SQL Editor to provision all tables

-- ============================================
-- 1. CLIENTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.clients (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  company_name VARCHAR(255) NOT NULL DEFAULT '',
  website VARCHAR(500) DEFAULT '',
  role VARCHAR(50) DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can view own data" ON public.clients
  FOR SELECT USING (auth.uid()::text = id OR role = 'admin');
CREATE POLICY "Clients can update own data" ON public.clients
  FOR UPDATE USING (auth.uid()::text = id OR role = 'admin');

-- ============================================
-- 2. CHATBOTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.chatbots (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(255) NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL DEFAULT 'New Chatbot',
  avatar VARCHAR(50) DEFAULT '🤖',
  brand_color VARCHAR(50) DEFAULT '#6366f1',
  welcome_message TEXT DEFAULT 'Hello! How can I help you today?',
  personality TEXT DEFAULT 'Helpful, professional, and friendly.',
  language VARCHAR(50) DEFAULT 'English',
  business_info TEXT DEFAULT '',
  ai_provider VARCHAR(50) DEFAULT 'openai' CHECK (ai_provider IN ('openai', 'gemini', 'claude')),
  ai_model VARCHAR(100) DEFAULT 'gpt-4o-mini',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.chatbots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can manage own bots" ON public.chatbots
  FOR ALL USING (client_id = auth.uid()::text OR (SELECT role FROM public.clients WHERE id = auth.uid()::text) = 'admin');

CREATE INDEX IF NOT EXISTS idx_chatbots_client ON public.chatbots(client_id);

-- ============================================
-- 3. KNOWLEDGE SOURCES
-- ============================================
CREATE TABLE IF NOT EXISTS public.knowledge_sources (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id VARCHAR(255) NOT NULL REFERENCES public.chatbots(id) ON DELETE CASCADE,
  source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('pdf', 'docx', 'txt', 'csv', 'url', 'faq', 'text')),
  source_name VARCHAR(500) NOT NULL,
  source_url VARCHAR(500) DEFAULT '',
  content_text TEXT DEFAULT '',
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready', 'failed')),
  crawl_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.knowledge_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can manage own knowledge" ON public.knowledge_sources
  FOR ALL USING (
    chatbot_id IN (SELECT id FROM public.chatbots WHERE client_id = auth.uid()::text)
    OR (SELECT role FROM public.clients WHERE id = auth.uid()::text) = 'admin'
  );
CREATE INDEX IF NOT EXISTS idx_knowledge_chatbot ON public.knowledge_sources(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_status ON public.knowledge_sources(status);

-- ============================================
-- 4. FAQS (Standalone FAQ table linked to chatbots)
-- ============================================
CREATE TABLE IF NOT EXISTS public.faqs (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id VARCHAR(255) NOT NULL REFERENCES public.chatbots(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can manage own FAQs" ON public.faqs
  FOR ALL USING (
    chatbot_id IN (SELECT id FROM public.chatbots WHERE client_id = auth.uid()::text)
    OR (SELECT role FROM public.clients WHERE id = auth.uid()::text) = 'admin'
  );
CREATE INDEX IF NOT EXISTS idx_faqs_chatbot ON public.faqs(chatbot_id);

-- ============================================
-- 5. CONVERSATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.conversations (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id VARCHAR(255) NOT NULL REFERENCES public.chatbots(id) ON DELETE CASCADE,
  client_id VARCHAR(255) NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  lead_name VARCHAR(255) DEFAULT '',
  lead_email VARCHAR(255) DEFAULT '',
  lead_phone VARCHAR(255) DEFAULT '',
  lead_company VARCHAR(255) DEFAULT '',
  browser VARCHAR(255) DEFAULT 'Unknown',
  country VARCHAR(100) DEFAULT '',
  device VARCHAR(50) DEFAULT 'desktop',
  location VARCHAR(255) DEFAULT '',
  ip_address VARCHAR(50) DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can view own conversations" ON public.conversations
  FOR SELECT USING (client_id = auth.uid()::text OR (SELECT role FROM public.clients WHERE id = auth.uid()::text) = 'admin');
CREATE POLICY "Clients can insert own conversations" ON public.conversations
  FOR INSERT WITH CHECK (client_id = auth.uid()::text OR (SELECT role FROM public.clients WHERE id = auth.uid()::text) = 'admin');
CREATE INDEX IF NOT EXISTS idx_conversations_chatbot ON public.conversations(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_conversations_client ON public.conversations(client_id);

-- ============================================
-- 6. CHAT MESSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id VARCHAR(255) NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender VARCHAR(50) NOT NULL CHECK (sender IN ('user', 'bot')),
  message_text TEXT NOT NULL,
  sources_retrieved JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can view own messages" ON public.chat_messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM public.conversations WHERE client_id = auth.uid()::text
    )
    OR (SELECT role FROM public.clients WHERE id = auth.uid()::text) = 'admin'
  );
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON public.chat_messages(conversation_id);

-- ============================================
-- 7. LEADS (Explicit lead capture table)
-- ============================================
CREATE TABLE IF NOT EXISTS public.leads (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id VARCHAR(255) NOT NULL REFERENCES public.chatbots(id) ON DELETE CASCADE,
  conversation_id VARCHAR(255) REFERENCES public.conversations(id) ON DELETE SET NULL,
  name VARCHAR(255) DEFAULT '',
  email VARCHAR(255) DEFAULT '',
  phone VARCHAR(255) DEFAULT '',
  company VARCHAR(255) DEFAULT '',
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'lost')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can manage own leads" ON public.leads
  FOR ALL USING (
    chatbot_id IN (SELECT id FROM public.chatbots WHERE client_id = auth.uid()::text)
    OR (SELECT role FROM public.clients WHERE id = auth.uid()::text) = 'admin'
  );
CREATE INDEX IF NOT EXISTS idx_leads_chatbot ON public.leads(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);

-- ============================================
-- 8. WIDGET SETTINGS
-- ============================================
CREATE TABLE IF NOT EXISTS public.widget_settings (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id VARCHAR(255) NOT NULL REFERENCES public.chatbots(id) ON DELETE CASCADE UNIQUE,
  position VARCHAR(20) DEFAULT 'bottom-right' CHECK (position IN ('bottom-right', 'bottom-left', 'top-right', 'top-left', 'center')),
  theme_mode VARCHAR(20) DEFAULT 'light' CHECK (theme_mode IN ('light', 'dark', 'auto')),
  launcher_icon VARCHAR(100) DEFAULT '🤖',
  welcome_popup BOOLEAN DEFAULT true,
  show_branding BOOLEAN DEFAULT true,
  brand_colors JSONB DEFAULT '{"primary":"#6366f1","text":"#ffffff","bg":"#0d1117"}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.widget_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can manage widget settings" ON public.widget_settings
  FOR ALL USING (
    chatbot_id IN (SELECT id FROM public.chatbots WHERE client_id = auth.uid()::text)
    OR (SELECT role FROM public.clients WHERE id = auth.uid()::text) = 'admin'
  );

-- ============================================
-- 9. AI SETTINGS (Provider & model selection per bot)
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_settings (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id VARCHAR(255) NOT NULL REFERENCES public.chatbots(id) ON DELETE CASCADE UNIQUE,
  provider VARCHAR(50) DEFAULT 'openai' CHECK (provider IN ('openai', 'gemini', 'claude')),
  model VARCHAR(100) DEFAULT 'gpt-4o-mini',
  temperature FLOAT DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 1024,
  fallback_enabled BOOLEAN DEFAULT true,
  system_prompt_template TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can manage AI settings" ON public.ai_settings
  FOR ALL USING (
    chatbot_id IN (SELECT id FROM public.chatbots WHERE client_id = auth.uid()::text)
    OR (SELECT role FROM public.clients WHERE id = auth.uid()::text) = 'admin'
  );

-- ============================================
-- 10. OWNERSHIP TRANSFERS (Audit log of handovers)
-- ============================================
CREATE TABLE IF NOT EXISTS public.ownership_transfers (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id VARCHAR(255) NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  chatbot_id VARCHAR(255) REFERENCES public.chatbots(id) ON DELETE SET NULL,
  package_filename VARCHAR(500) DEFAULT '',
  download_url VARCHAR(500) DEFAULT '',
  agreement_signed BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'prepared' CHECK (status IN ('prepared', 'downloaded', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.ownership_transfers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can view own transfers" ON public.ownership_transfers
  FOR SELECT USING (client_id = auth.uid()::text OR (SELECT role FROM public.clients WHERE id = auth.uid()::text) = 'admin');
CREATE INDEX IF NOT EXISTS idx_ownership_client ON public.ownership_transfers(client_id);

-- ============================================
-- 11. APPOINTMENTS (Optional future feature)
-- ============================================
CREATE TABLE IF NOT EXISTS public.appointments (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id VARCHAR(255) REFERENCES public.chatbots(id) ON DELETE SET NULL,
  lead_email VARCHAR(255) DEFAULT '',
  lead_name VARCHAR(255) DEFAULT '',
  lead_phone VARCHAR(255) DEFAULT '',
  scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  notes TEXT DEFAULT '',
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can manage appointments" ON public.appointments
  FOR ALL USING ((SELECT role FROM public.clients WHERE id = auth.uid()::text) = 'admin');

-- ============================================
-- 12. ANALYTICS EVENTS (For real-time metrics)
-- ============================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id VARCHAR(255) REFERENCES public.chatbots(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('message_sent', 'lead_captured', 'conversation_started', 'widget_opened')),
  event_data JSONB DEFAULT '{}',
  country VARCHAR(100) DEFAULT '',
  browser VARCHAR(255) DEFAULT '',
  device VARCHAR(50) DEFAULT 'desktop',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can view analytics" ON public.analytics_events
  FOR SELECT USING (
    chatbot_id IN (SELECT id FROM public.chatbots WHERE client_id = auth.uid()::text)
    OR (SELECT role FROM public.clients WHERE id = auth.uid()::text) = 'admin'
  );
CREATE INDEX IF NOT EXISTS idx_analytics_chatbot ON public.analytics_events(chatbot_id);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.analytics_events(created_at);
