# ChatFlow AI — Database Setup Guide

## 1. Create Supabase Project
1. Go to https://supabase.com and create a new project.
2. Copy the Project URL and anon/service keys.
3. Update `.env.local` with these values (see `.env.local.example`).

## 2. Run SQL Schema
Open the Supabase SQL Editor and run the contents of `supabase-schema.sql`.
This creates all tables with Row Level Security (RLS) enabled.

### Tables Created
| Table | Purpose |
|---|---|
| `clients` | User/client accounts |
| `chatbots` | Chatbot configurations per client |
| `knowledge_sources` | PDF, DOCX, URL, text training data |
| `faqs` | FAQ Q&A pairs per chatbot |
| `conversations` | Chat sessions with lead metadata |
| `chat_messages` | Individual messages in conversations |
| `leads` | Captured lead contact information |
| `widget_settings` | Embed widget configuration |
| `ai_settings` | AI provider/model settings per bot |
| `ownership_transfers` | Transfer audit log |
| `appointments` | Future: appointment scheduling |
| `analytics_events` | Real-time analytics event tracking |

### Storage Buckets Created
| Bucket | Purpose | Access |
|---|---|---|
| `knowledge-documents` | PDF, DOCX, TXT, CSV uploads | Client-scoped |
| `chatbot-avatars` | Custom avatar images | Public read |
| `ownership-packages` | Handover ZIP files | Admin write, client read |

## 3. Configure RLS Policies
The `supabase-schema.sql` file includes policies that keep data separated:
- Each client can only see their own chatbots, conversations, leads, and messages.
- Admin users (`role = 'admin'`) can see all data.
- Storage policies enforce per-client file access.

## 4. Verify Connection
Run the development server (`npm run dev`) and open the dashboard.
Create a chatbot and test the Playground. Conversations should persist.

## 5. Environment Variables

### Required for AI Responses (at least one)
| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key (default model: gpt-4o-mini) |
| `GEMINI_API_KEY` | Google Gemini API key (default model: gemini-pro) |
| `CLAUDE_API_KEY` | Anthropic Claude API key (default model: claude-3-haiku) |

### Required for Persistent Database
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `SUPABASE_URL` | Same as NEXT_PUBLIC_SUPABASE_URL (server-only fallback) |
| `SUPABASE_ANON_KEY` | Same as NEXT_PUBLIC_SUPABASE_ANON_KEY (server-only fallback) |

### Mode Summary
| Configuration | Behavior |
|---|---|
| No env vars | App runs with localStorage, intelligent fallback AI |
| AI keys only | Real AI responses, localStorage for data |
| Supabase only | Fallback AI, persistent database |
| All configured | Full production: real AI + persistent database + storage |

## 6. Production Deployment
On Vercel, add environment variables in Project Settings > Environment Variables.
The app works without any variables (localStorage + fallback AI mode) for demos.
