export const SUPABASE_SQL_SCHEMA = `-- PostgreSQL / Supabase Schema for Postiz Studio
-- Run this in your Supabase SQL Editor:

-- 1. Create table for social media posts
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  platforms JSONB NOT NULL DEFAULT '[]'::jsonb,
  media JSONB NOT NULL DEFAULT '[]'::jsonb,
  scheduled_at TIMESTAMPTZ NOT NULL,
  published_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'draft',
  author_id TEXT,
  author_name TEXT,
  platform_configs JSONB DEFAULT '{}'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  stats JSONB DEFAULT '{}'::jsonb,
  ai_generated BOOLEAN DEFAULT false,
  ai_prompt TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create table for connected social accounts
CREATE TABLE IF NOT EXISTS public.social_accounts (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  username TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  follower_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  tier TEXT DEFAULT 'creator',
  connected_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create table for team workspaces
CREATE TABLE IF NOT EXISTS public.team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'editor',
  avatar TEXT,
  status TEXT DEFAULT 'active'
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- 5. Create permissive policies for public demo access (or tune for auth.uid())
CREATE POLICY "Allow public read access" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.posts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.posts FOR DELETE USING (true);

CREATE POLICY "Allow public read accounts" ON public.social_accounts FOR SELECT USING (true);
CREATE POLICY "Allow public manage accounts" ON public.social_accounts FOR ALL USING (true);

CREATE POLICY "Allow public read team" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Allow public manage team" ON public.team_members FOR ALL USING (true);
`;
