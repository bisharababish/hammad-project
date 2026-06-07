-- Run this in Supabase → SQL Editor after creating the user in Authentication → Users
-- Email: hammad@gmail.com

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'hammad@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
