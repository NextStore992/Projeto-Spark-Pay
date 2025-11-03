-- Ensure trigger to create profile and default roles on new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- One-time backfill: if no admin exists, promote the earliest user to admin
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role)
    SELECT u.id, 'admin'::public.app_role
    FROM auth.users u
    ORDER BY u.created_at ASC
    LIMIT 1
    ON CONFLICT DO NOTHING;
  END IF;
END;$$;