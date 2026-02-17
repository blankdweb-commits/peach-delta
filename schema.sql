-- Peach App Schema for Supabase (PostgreSQL)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES
-- Linked to auth.users via references auth.users(id)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text unique not null,
  alias text,
  real_name text,
  photo_url text,
  level text check (level in ('Year 1', 'Year 2', 'Year 3', 'Intern')),
  location text check (location in ('Sapele', 'Warri', 'Asaba', 'Ughelli')),

  -- Vibe Check (JSONB for flexibility)
  sweet_peaches jsonb default '[]'::jsonb, -- Likes
  bruised_peaches jsonb default '[]'::jsonb, -- Dislikes

  -- Profile Details
  bio text,
  job_title text,

  -- App State
  is_premium boolean default false,
  daily_unripes_count int default 0,
  last_reset_date date default current_date,
  kyc_status text default 'pending' check (kyc_status in ('pending', 'verified', 'rejected')),
  onboarding_complete boolean default false,

  -- Preferences
  allow_ads boolean default true,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- 2. SWIPES
-- Tracks interactions to calculate matches
create table public.swipes (
  id uuid default uuid_generate_v4() primary key,
  swiper_id uuid references public.profiles(id) not null,
  swipee_id uuid references public.profiles(id) not null,
  direction text check (direction in ('left', 'right')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(swiper_id, swipee_id)
);

alter table public.swipes enable row level security;
create policy "Users can insert their own swipes." on public.swipes for insert with check (auth.uid() = swiper_id);

-- 3. MATCHES
-- Created when two right swipes occur
create table public.matches (
  id uuid default uuid_generate_v4() primary key,
  user1_id uuid references public.profiles(id) not null,
  user2_id uuid references public.profiles(id) not null,
  compatibility_score int,
  is_ripened boolean default false, -- If true, details are revealed
  ripened_by uuid references public.profiles(id), -- User who paid to ripen
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.matches enable row level security;
create policy "Users can view their own matches." on public.matches for select using (auth.uid() = user1_id or auth.uid() = user2_id);

-- 4. MESSAGES
-- Chat history for matches
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  match_id uuid references public.matches(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.messages enable row level security;
create policy "Users can view messages in their matches." on public.messages for select using (
  exists (select 1 from public.matches where id = match_id and (user1_id = auth.uid() or user2_id = auth.uid()))
);
create policy "Users can insert messages in their matches." on public.messages for insert with check (
  exists (select 1 from public.matches where id = match_id and (user1_id = auth.uid() or user2_id = auth.uid()))
);

-- 5. ADS
-- Business advertisements
create table public.ads (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) not null,
  title text not null,
  headline text,
  content text,
  price text,
  image_url text,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ads enable row level security;
create policy "Ads are viewable by everyone." on public.ads for select using (true);
create policy "Business users can insert ads." on public.ads for insert with check (auth.uid() = owner_id);

-- 6. FEEDBACK
-- User reports and suggestions
create table public.feedback (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  type text check (type in ('bug', 'feature', 'feedback')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.feedback enable row level security;
create policy "Users can insert feedback." on public.feedback for insert with check (auth.uid() = user_id);

-- 7. ADMIN LOGS (Optional)
create table public.admin_logs (
  id uuid default uuid_generate_v4() primary key,
  admin_id uuid references public.profiles(id),
  action text not null,
  target_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
