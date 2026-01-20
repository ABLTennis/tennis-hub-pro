-- Optimize admin check by adding composite index and ensuring function performance
-- This should make is_admin() calls much faster

-- Add composite index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id_role ON public.user_roles(user_id, role);

-- Ensure the function uses the index efficiently
-- The function should already be fast with SECURITY DEFINER, but let's make sure

-- Also, let's verify that the postgres role (function owner) has full access
-- This ensures SECURITY DEFINER functions can read without RLS issues
GRANT SELECT ON public.user_roles TO postgres;
GRANT SELECT ON public.user_roles TO service_role;

-- The functions should now be fast because:
-- 1. They use SECURITY DEFINER (bypass RLS)
-- 2. They have proper indexes
-- 3. The postgres role has explicit SELECT permissions
