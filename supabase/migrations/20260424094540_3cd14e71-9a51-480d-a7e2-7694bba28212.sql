-- ===== ENUMS =====
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.session_mode AS ENUM ('Présentiel', 'Distanciel', 'Hybride');
CREATE TYPE public.session_status AS ENUM ('draft', 'published', 'full', 'cancelled', 'completed');
CREATE TYPE public.submission_status AS ENUM ('new', 'in_progress', 'done', 'archived');

-- ===== TIMESTAMPS HELPER =====
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ===== USER ROLES =====
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ===== ADMIN ALLOWLIST =====
CREATE TABLE public.admin_allowlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_allowlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage allowlist" ON public.admin_allowlist
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.admin_allowlist (email) VALUES ('infotelcomtech@gmail.com');

-- ===== AUTO-ASSIGN ADMIN ROLE ON SIGNUP =====
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.admin_allowlist WHERE lower(email) = lower(NEW.email)) THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===== CONTACT SUBMISSIONS =====
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  formation_slug TEXT,
  session_id TEXT,
  status public.submission_status NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact" ON public.contact_submissions
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view submissions" ON public.contact_submissions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update submissions" ON public.contact_submissions
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete submissions" ON public.contact_submissions
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_contact_submissions_updated
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_contact_submissions_created ON public.contact_submissions (created_at DESC);
CREATE INDEX idx_contact_submissions_status ON public.contact_submissions (status);

-- ===== TRAINING SESSIONS =====
CREATE TABLE public.training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_slug TEXT NOT NULL,
  city TEXT NOT NULL,
  mode public.session_mode NOT NULL DEFAULT 'Présentiel',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  seats INTEGER NOT NULL DEFAULT 12 CHECK (seats >= 0),
  status public.session_status NOT NULL DEFAULT 'published',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published sessions" ON public.training_sessions
  FOR SELECT TO anon, authenticated USING (status = 'published' OR status = 'full');
CREATE POLICY "Admins can view all sessions" ON public.training_sessions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage sessions" ON public.training_sessions
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_training_sessions_updated
  BEFORE UPDATE ON public.training_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_training_sessions_start ON public.training_sessions (start_date);
CREATE INDEX idx_training_sessions_formation ON public.training_sessions (formation_slug);

-- ===== ANALYTICS EVENTS =====
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  source TEXT,
  page TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  anon_session_id TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log events" ON public.analytics_events
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view events" ON public.analytics_events
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete events" ON public.analytics_events
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_analytics_events_created ON public.analytics_events (created_at DESC);
CREATE INDEX idx_analytics_events_type ON public.analytics_events (event_type);

-- ===== SEED TRAINING SESSIONS (depuis sessions.ts) =====
INSERT INTO public.training_sessions (formation_slug, city, mode, start_date, end_date, seats) VALUES
  ('fibre-optique-ftth', 'Brazzaville', 'Présentiel', '2026-02-09', '2026-02-13', 12),
  ('radio-bts-5g', 'Pointe-Noire', 'Présentiel', '2026-02-16', '2026-02-20', 10),
  ('cybersecurite', 'Brazzaville', 'Hybride', '2026-03-02', '2026-03-06', 15),
  ('developpement-web', 'En ligne', 'Distanciel', '2026-03-09', '2026-03-20', 20),
  ('data-analyse-power-bi', 'Brazzaville', 'Présentiel', '2026-03-23', '2026-03-25', 14),
  ('voip-asterisk', 'En ligne', 'Distanciel', '2026-04-06', '2026-04-09', 12),
  ('reseaux-transmission', 'Brazzaville', 'Présentiel', '2026-04-13', '2026-04-16', 12),
  ('administration-systeme-linux', 'Pointe-Noire', 'Hybride', '2026-04-20', '2026-04-23', 12),
  ('fibre-optique-ftth', 'Brazzaville', 'Présentiel', '2026-05-04', '2026-05-08', 12),
  ('cybersecurite', 'En ligne', 'Distanciel', '2026-05-11', '2026-05-15', 18);