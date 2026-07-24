# ChatFlow AI — Database Setup Guide

## 1. Create Supabase Project
1. Go to https://supabase.com and create a new project.
2. Copy the Project URL and anon/service keys.
3. Update `.env.local` with these values.

## 2. Run SQL Schema
Open the Supabase SQL Editor and run the contents of `supabase-schema.sql`.
This creates all tables with Row Level Security (RLS) enabled.

## 3. Configure RLS Policies
The `supabase-schema.sql` file includes policies that keep data separated:
- Each client can only see their own chatbots, conversations, leads, and messages.
- Admin users (`role = 'admin'`) can see all data.

## 4. Verify Connection
Run the development server (`npm run dev`) and open the dashboard.
Create a chatbot and test the Playground. Conversations should persist.

## 5. Production Deployment
On Vercel, add environment variables in Project Settings > Environment Variables:
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `CLAUDE_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
