-- Full Schema for Laragon PostgreSQL (lokallens_ai)

-- 0. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. users (Replaces Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. umkm_profiles
CREATE TABLE IF NOT EXISTS umkm_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  business_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  business_category TEXT,
  city TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  original_price NUMERIC,
  psychological_price NUMERIC,
  product_image_url TEXT,
  ai_background_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. ai_generated_captions
CREATE TABLE IF NOT EXISTS ai_generated_captions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  generated_caption TEXT NOT NULL,
  hashtags TEXT[],
  language_style TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. marketing_schedules
CREATE TABLE IF NOT EXISTS marketing_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  caption_id UUID REFERENCES ai_generated_captions(id) ON DELETE SET NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  platform TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. trend_analytics
CREATE TABLE IF NOT EXISTS trend_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  keyword TEXT NOT NULL,
  trend_score NUMERIC,
  competitor_average_price NUMERIC,
  market_status TEXT,
  popular_hashtags TEXT[],
  ai_recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. ai_voice_logs
CREATE TABLE IF NOT EXISTS ai_voice_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  voice_command TEXT NOT NULL,
  detected_intent TEXT,
  action_result TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
