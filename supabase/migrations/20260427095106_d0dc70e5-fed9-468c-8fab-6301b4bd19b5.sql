-- Replace broad public insert rules with bounded validations
DROP POLICY IF EXISTS "Anyone can log events" ON public.analytics_events;
CREATE POLICY "Visitors can log safe analytics events"
ON public.analytics_events
FOR INSERT
TO anon, authenticated
WITH CHECK (
  event_type IN ('cta_click', 'contact_submit', 'formation_view', 'page_view')
  AND char_length(event_type) <= 64
  AND (source IS NULL OR char_length(source) <= 160)
  AND (page IS NULL OR char_length(page) <= 300)
  AND (user_agent IS NULL OR char_length(user_agent) <= 500)
  AND (anon_session_id IS NULL OR char_length(anon_session_id) <= 100)
);

DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_submissions;
CREATE POLICY "Visitors can submit validated contact"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(btrim(name)) BETWEEN 2 AND 160
  AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  AND char_length(email) <= 255
  AND (phone IS NULL OR char_length(phone) <= 40)
  AND char_length(btrim(subject)) BETWEEN 2 AND 200
  AND char_length(btrim(message)) BETWEEN 10 AND 5000
  AND (formation_slug IS NULL OR char_length(formation_slug) <= 120)
  AND (session_id IS NULL OR char_length(session_id) <= 120)
  AND status = 'new'::submission_status
  AND admin_notes IS NULL
);