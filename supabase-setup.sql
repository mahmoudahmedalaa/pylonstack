-- supabase-setup.sql
-- Run this script to restore RLS policies and create the profiles trigger

-- 1. Enable RLS on all tables
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tools" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "project_tools" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "questionnaire_responses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ai_recommendations" ENABLE ROW LEVEL SECURITY;

-- 2. Profiles Policies
CREATE POLICY "profiles_select_own" ON "profiles" FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON "profiles" FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 3. Projects Policies
CREATE POLICY "projects_select_own" ON "projects" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "projects_insert_own" ON "projects" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "projects_update_own" ON "projects" FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "projects_delete_own" ON "projects" FOR DELETE USING (auth.uid() = user_id);

-- 4. Categories & Tools Policies (Public Read, No Write)
CREATE POLICY "categories_public_read" ON "categories" FOR SELECT USING (true);
CREATE POLICY "tools_public_read" ON "tools" FOR SELECT USING (true);

-- 5. Project Tools Policies
CREATE POLICY "project_tools_select_own" ON "project_tools" FOR SELECT USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_tools.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "project_tools_insert_own" ON "project_tools" FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_tools.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "project_tools_update_own" ON "project_tools" FOR UPDATE USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_tools.project_id AND projects.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_tools.project_id AND projects.user_id = auth.uid()));
CREATE POLICY "project_tools_delete_own" ON "project_tools" FOR DELETE USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_tools.project_id AND projects.user_id = auth.uid()));

-- 6. Questionnaire Responses Policies
CREATE POLICY "questionnaire_select_own" ON "questionnaire_responses" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "questionnaire_insert_own" ON "questionnaire_responses" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "questionnaire_update_own" ON "questionnaire_responses" FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "questionnaire_delete_own" ON "questionnaire_responses" FOR DELETE USING (auth.uid() = user_id);

-- 7. AI Recommendations Policies
CREATE POLICY "ai_recs_select_own" ON "ai_recommendations" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ai_recs_insert_own" ON "ai_recommendations" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ai_recs_update_own" ON "ai_recommendations" FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ai_recs_delete_own" ON "ai_recommendations" FOR DELETE USING (auth.uid() = user_id);

-- 8. Trigger function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, subscription_tier)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1), 'User'),
    NEW.raw_user_meta_data->>'avatar_url',
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
