import { NextResponse } from "next/server";

export async function GET() {
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasClaude = !!process.env.CLAUDE_API_KEY;
  const hasSupabase = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return NextResponse.json({
    status: "ok",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    providers: {
      openai: hasOpenAI,
      gemini: hasGemini,
      claude: hasClaude,
    },
    database: {
      supabase: hasSupabase,
    },
  });
}
