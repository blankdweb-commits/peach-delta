-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  alias TEXT UNIQUE,
  level TEXT,
  real_name TEXT,
  photo_url TEXT,
  pits INTEGER DEFAULT 25,
  membership_type TEXT DEFAULT 'free', -- 'free' or 'premium'
  membership_expiry TIMESTAMP WITH TIME ZONE,
  last_ripen_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  daily_ripens_count INTEGER DEFAULT 0,
  basics JSONB,
  life JSONB,
  work JSONB,
  relationships JSONB,
  vision TEXT,
  special TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ads table
CREATE TABLE ads (
  id BIGSERIAL PRIMARY KEY,
  business_name TEXT,
  headline TEXT,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  price TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create swipes table to track ripens
CREATE TABLE ripens (
  id BIGSERIAL PRIMARY KEY,
  ripened_by UUID REFERENCES profiles(id),
  ripened_profile_id INTEGER, -- Mock ID or UUID if using real profiles
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ripens ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Ads are viewable by everyone." ON ads
  FOR SELECT USING (true);

CREATE POLICY "Users can view their own ripens." ON ripens
  FOR SELECT USING (auth.uid() = ripened_by);

CREATE POLICY "Users can insert their own ripens." ON ripens
  FOR INSERT WITH CHECK (auth.uid() = ripened_by);
