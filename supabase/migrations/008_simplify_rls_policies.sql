-- Simplify RLS policies to prevent timeouts
-- Strategy: Only check admin status when user is NOT querying their own role
-- This way, regular users never trigger the is_admin() function call

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

-- Policy 1: Users can always read their own role (no function calls needed)
-- This handles 99% of queries and is evaluated first
CREATE POLICY "Users can view their own role"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Admins can view OTHER users' roles
-- Only evaluated when user_id != auth.uid(), so is_admin() is only called
-- when admins are viewing other users, not when users view themselves
CREATE POLICY "Admins can view other roles"
  ON public.user_roles
  FOR SELECT
  USING (
    auth.uid() != user_id AND 
    public.is_admin(auth.uid())
  );
