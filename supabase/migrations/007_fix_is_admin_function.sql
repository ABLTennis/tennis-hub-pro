-- Ensure is_admin function works correctly and doesn't cause RLS issues
-- The function should be SECURITY DEFINER to bypass RLS when checking admin status

CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  -- SECURITY DEFINER should bypass RLS, but we'll be explicit
  -- Query the table directly - the function owner (postgres) has full access
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role = 'admin'
    LIMIT 1
  );
END;
$$;

-- Also ensure get_user_role and is_coach are properly configured
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  user_role_value user_role;
BEGIN
  SELECT role INTO user_role_value
  FROM public.user_roles 
  WHERE user_id = user_uuid
  LIMIT 1;
  
  RETURN user_role_value;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_coach(user_uuid UUID)
RETURNS BOOLEAN 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role = 'coach'
    LIMIT 1
  );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.is_coach(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_coach(UUID) TO anon;
