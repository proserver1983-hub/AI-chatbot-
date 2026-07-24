// Supabase Client for ChatFlow AI
// Uses @supabase/supabase-js — install with: npm install @supabase/supabase-js

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const isConfigured = supabaseUrl && supabaseAnonKey;

if (!isConfigured && typeof window !== "undefined") {
  console.warn(
    "⚠️ Supabase environment variables missing. " +
    "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local " +
    "and create tables using supabase-schema.sql. Running in localStorage-only mode."
  );
}

// Create clients — use placeholder URL/key when not configured to avoid runtime crashes
// All API routes should check isConfigured before using these clients
const placeholderUrl = supabaseUrl || "https://placeholder.supabase.co";
const placeholderKey = supabaseAnonKey || "placeholder-key";

export const supabase: SupabaseClient = createClient(placeholderUrl, placeholderKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export const supabaseAdmin: SupabaseClient = createClient(
  placeholderUrl,
  supabaseServiceKey || placeholderKey,
  { auth: { persistSession: false } }
);

export { isConfigured };
