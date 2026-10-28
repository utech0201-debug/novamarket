-- Prevent authenticated users from setting their own profiles.is_admin flag.
-- RLS policies restrict rows, not columns; remove table-level UPDATE and grant
-- authenticated users permission to update only their own full_name (RLS still
-- determines which row they may update).
revoke update on table public.profiles from public, anon, authenticated;
grant update (full_name) on table public.profiles to authenticated;
