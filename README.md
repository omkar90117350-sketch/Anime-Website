# MangaVaultX 📖

**Where Legends Are Read.**  
Free anime & manga PDF hosting platform. No file uploads — just paste links.

## Tech Stack
- React 18 + Vite 5
- React Router v6
- Supabase (Auth + PostgreSQL)
- Lucide React icons
- Hosted on Vercel

## Quick Deploy

### 1. Supabase Setup
1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the SQL from `/setup` page (or see below)
3. Get your **Project URL** and **anon key** from Settings → API

### 2. Environment Variables
Create `.env` (copy from `.env.example`):
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 3. Deploy to Vercel
1. Push to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Add env vars in Vercel project settings
4. Redeploy — done!

## Database SQL
```sql
create table manga (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  author text,
  genre text,
  description text,
  pdf_url text not null,
  cover_url text,
  views integer default 0,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz default now()
);
alter table manga enable row level security;
create policy "Public read" on manga for select using (true);
create policy "Auth insert" on manga for insert with check (auth.uid() = uploaded_by);
create policy "Auth delete" on manga for delete using (auth.uid() = uploaded_by);
create policy "Auth update" on manga for update using (true);
```

## PDF Hosting (Free)
| Service | Storage | Notes |
|---------|---------|-------|
| Google Drive | 15 GB | Share → Anyone with link |
| Archive.org | Unlimited | Best for public domain |
| Dropbox | 2 GB | Basic free tier |

## Local Development
```bash
npm install
cp .env.example .env  # add your Supabase keys
npm run dev
```

## Features
- ✅ Real authentication (Supabase Auth)
- ✅ Browse & search manga by genre
- ✅ View counter per manga
- ✅ Link-based PDF hosting (zero storage cost)
- ✅ iframe PDF viewer with Google Drive embed support
- ✅ User profiles with upload management
- ✅ Mobile responsive
- ✅ Blue/Red/Black anime theme
