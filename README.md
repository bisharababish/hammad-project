# Al-Prince Car Wash (مغسلة البرنس)

Bilingual car wash booking website built with TanStack Start, React, Supabase, and Tailwind CSS.

## Local development

```bash
npm install
cp .env.example .env   # then fill in your Supabase keys
npm run dev
```

Open `http://localhost:3000`

## Admin login

The admin SQL in Supabase **does not create a login** — it only adds the `admin` role to an existing user.

1. **Create the account first** — either:
   - Sign up on the site at `/login`, or
   - Supabase Dashboard → **Authentication → Users → Add user**
2. **Promote to admin** in SQL Editor:

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'your@email.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

3. **Sign in on the website** at `/login` with that email and password (not in the Supabase dashboard)
4. Open `/admin` — you should see the admin panel

## Database setup

Run the full script in `sql_setup.txt` in Supabase SQL Editor (once per new project).

## Deploy to Render

1. Push this repo to GitHub
2. [Render Dashboard](https://dashboard.render.com) → **New → Blueprint** (or Web Service)
3. Connect your GitHub repo
4. Render reads `render.yaml` automatically, or set manually:
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
5. Add environment variables (same as `.env`):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
6. In Supabase → **Authentication → URL Configuration**, add your Render URL:
   - Site URL: `https://your-app.onrender.com`
   - Redirect URLs: `https://your-app.onrender.com/**`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm start` | Run production server (Render) |
#
