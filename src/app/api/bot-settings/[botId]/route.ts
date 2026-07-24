import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function GET(_request: Request, { params }: { params: Promise<{ botId: string }> }) {
  try {
    const { botId } = await params;
    if (!botId) {
      return NextResponse.json({ error: "Bot ID required" }, { status: 400 });
    }

    // Try to load from Supabase if configured
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data: bot, error: botError } = await supabase
          .from("chatbots")
          .select("*")
          .eq("id", botId)
          .single();

        if (!botError && bot) {
          const { data: faqs } = await supabase
            .from("faqs")
            .select("id, question, answer")
            .eq("chatbot_id", botId);

          const { data: knowledgeSources } = await supabase
            .from("knowledge_sources")
            .select("id, source_type, source_name, source_url, content_text, status")
            .eq("chatbot_id", botId)
            .eq("status", "ready");

          return NextResponse.json({
            id: bot.id,
            name: bot.name,
            avatar: bot.avatar,
            brandColor: bot.brand_color,
            welcomeMessage: bot.welcome_message,
            personality: bot.personality,
            businessInfo: bot.business_info,
            language: bot.language,
            faqs: faqs || [],
            knowledgeSources: knowledgeSources || [],
          });
        }
      } catch (dbErr) {
        console.warn("Supabase query failed, returning defaults:", dbErr);
      }
    }

    // Default response when Supabase is not configured or bot not found
    return NextResponse.json({
      id: botId,
      name: "ChatFlow Assistant",
      avatar: "🤖",
      brandColor: "#6366f1",
      welcomeMessage: "Hello! How can I help you today?",
      personality: "Professional and polite.",
      businessInfo: "AI Chatbot Platform",
      language: "English",
      faqs: [],
      note: "Configure the chatbot in the ChatFlow dashboard. For production, add Supabase environment variables to persist settings server-side.",
      settingsEndpoint: `/api/bot-settings/${botId}`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
