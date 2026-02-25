-- semper_activity: log de actividad por usuario
-- Ejecutar en: Supabase dashboard > SQL Editor > anwcebubrnpehtswgbfl

CREATE TABLE IF NOT EXISTS semper_activity (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name   TEXT NOT NULL,
  action      TEXT NOT NULL,   -- 'task_done' | 'task_undone' | 'task_added' | 'task_deleted' | 'alert_added' | 'event_done' | 'event_added'
  detail      TEXT DEFAULT '',  -- descripción: "texto tarea — Ministerio"
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE semper_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all_semper_activity" ON semper_activity
  FOR ALL USING (true) WITH CHECK (true);

-- Índice para consultas recientes
CREATE INDEX IF NOT EXISTS semper_activity_created_at_idx ON semper_activity (created_at DESC);
CREATE INDEX IF NOT EXISTS semper_activity_user_idx ON semper_activity (user_name);
