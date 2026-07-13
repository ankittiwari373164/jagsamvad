# जगसंवाद — Jagsamvad

A newspaper-themed entertainment news site built with Next.js and Supabase —
Bollywood, Hollywood, Korean cinema and OTT release coverage, with a full
admin panel and a "print edition" page-flip reader.

## What's included

- **Newspaper front-end** — masthead, dateline, drop caps, hairline rules,
  broadsheet grid layout, fully responsive.
- **Page-flip reading mode** — every article has a "Read in Print Edition"
  button that opens a real page-turning book view (`react-pageflip`).
- **Admin panel** (`/admin`) — protected by Supabase Auth + an admin
  allow-list:
  - Dashboard with article stats
  - Full article editor (Tiptap rich text: bold/italic/underline, H2/H3,
    quotes, lists, text alignment, links, image upload, undo/redo)
  - Cover image upload straight to Supabase Storage
  - Category manager (add / edit / delete)
  - Author manager (add / edit / delete, used for bylines)
  - Draft / Published workflow, "featured on homepage" toggle
- **Categories**: Movies, OTT Release, Bollywood, Hollywood, Korean Movies
  (seeded automatically — add more anytime from the admin panel).
- **Pages required for AdSense review**: About, Contact (with a working
  form saved to Supabase), Privacy Policy, Terms & Conditions, Disclaimer,
  Editorial Policy, Author pages.
- **SEO**: per-page metadata, Open Graph + Twitter cards, canonical URLs,
  `NewsArticle` / `BreadcrumbList` / `Person` / `NewsMediaOrganization`
  JSON-LD structured data, auto-generated `sitemap.xml` and `robots.txt`.

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com) (you said you
   already have one — use its URL and anon key below).
2. Open **SQL Editor** in the Supabase dashboard, paste the entire contents
   of [`supabase/schema.sql`](./supabase/schema.sql), and run it. This
   creates every table, security policy, the storage bucket for images, and
   seeds the five starter categories.
3. Create your admin login: go to **Authentication → Users → Add user** and
   create yourself a user with an email and password.
4. Make that user an admin: back in the **SQL Editor**, run:
   ```sql
   insert into public.admins (user_id, email)
   select id, email from auth.users where email = 'you@example.com';
   ```

## 2. Configure environment variables

Copy the example file and fill in your project's values (found in
**Project Settings → API** in Supabase):

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_SITE_URL=https://www.jagsamvad.com
```

## 3. Run it locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the site and
`http://localhost:3000/admin/login` to sign in with the account you created
in step 1.

## 4. Deploy

This is a standard Next.js app — the easiest path is
[Vercel](https://vercel.com):

1. Push this project to a GitHub repo.
2. Import it in Vercel.
3. Add the three environment variables from `.env.local` in the Vercel
   project settings.
4. Deploy.

## 5. Before you apply for AdSense

- Publish at least a handful of real articles in each category — AdSense
  reviewers want to see original, substantial content, not an empty shell.
- Replace the placeholder text in `src/app/robots.ts` / metadata
  (`NEXT_PUBLIC_SITE_URL`) with your real production domain.
- Add your real Google Search Console verification code in
  `src/app/layout.tsx` (`verification.google`).
- Replace `public/favicon.ico` and add a real `public/logo.png` (referenced
  by the structured data and social share cards).
- Once approved, drop your AdSense script into `src/app/layout.tsx` and swap
  the contents of `src/components/AdSlot.tsx` for your real `<ins
  class="adsbygoogle">` ad units — the ad slots are already placed on the
  homepage, category pages and article pages.

## Project structure

```
src/
  app/
    (site)/            → public pages (home, category, article, author, legal pages)
    admin/              → admin panel (protected)
    actions/            → server actions (auth, articles, categories, authors, contact)
    sitemap.ts, robots.ts
  components/            → shared UI (masthead, footer, article card, flip-book reader…)
  components/admin/       → admin-only UI (sidebar, article form, managers)
  components/editor/      → the Tiptap rich text editor
  lib/
    supabase/             → browser / server Supabase clients
    data.ts               → read-only data-fetching helpers
    types.ts, utils.ts
  proxy.ts                 → Next.js 16 request proxy (formerly "middleware"),
                             refreshes the auth session and guards /admin
supabase/
  schema.sql               → run this once in the Supabase SQL editor
```

## Notes on how admin access works

There is no separate password gate bolted on top — instead, Supabase Auth
handles sign-in, and a Postgres table (`public.admins`) acts as an
allow-list of which signed-in users may write content. Row Level Security
policies enforce this at the database level (not just in the UI), so even
direct API calls can't create or edit content unless the user's id is in
that table. To add a second admin later, just repeat step 1.4 above with
their email once they've signed up.
