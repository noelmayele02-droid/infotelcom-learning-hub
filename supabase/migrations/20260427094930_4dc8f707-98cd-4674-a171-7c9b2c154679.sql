-- RPC helpers for diagnostics and stronger admin permission checks
CREATE OR REPLACE FUNCTION public.diagnostic_rpc_ping()
RETURNS jsonb
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'ok', true,
    'checked_at', now(),
    'published_sessions', (
      SELECT count(*)
      FROM public.training_sessions
      WHERE status IN ('published'::session_status, 'full'::session_status)
    )
  );
$$;

CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::app_role);
$$;

-- Store post-deployment verification results
CREATE TABLE IF NOT EXISTS public.deployment_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  check_name text NOT NULL,
  status text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  checked_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.deployment_checks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view deployment checks" ON public.deployment_checks;
CREATE POLICY "Admins can view deployment checks"
ON public.deployment_checks
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can create deployment checks" ON public.deployment_checks;
CREATE POLICY "Admins can create deployment checks"
ON public.deployment_checks
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Useful indexes for admin filters and exports
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type_created ON public.analytics_events (event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_page_created ON public.analytics_events (page, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status_created ON public.contact_submissions (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON public.contact_submissions (lower(email));
CREATE INDEX IF NOT EXISTS idx_user_roles_user_role ON public.user_roles (user_id, role);