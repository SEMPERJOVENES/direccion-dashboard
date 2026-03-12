-- semper finanzas: schema para centro de mando financiero
-- Ejecutar en: Supabase dashboard > SQL Editor > anwcebubrnpehtswgbfl

-- ============================================================
-- 1. Categorías configurables
-- ============================================================
CREATE TABLE IF NOT EXISTS semper_categorias (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('ingreso', 'gasto', 'ambos')),
  caja TEXT CHECK (caja IN ('brand', 'jovenes') OR caja IS NULL),
  color TEXT,
  keywords TEXT[] DEFAULT '{}',
  activa BOOLEAN DEFAULT true
);

ALTER TABLE semper_categorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_semper_categorias" ON semper_categorias
  FOR ALL USING (true) WITH CHECK (true);

-- Seed categorías
INSERT INTO semper_categorias (id, nombre, tipo, caja, color, keywords) VALUES
  ('diezmo',        'Diezmo',             'ingreso', 'jovenes', '#5ec47a', ARRAY['diezmo']),
  ('merch',         'Merch',              'ambos',   'brand',   '#f5820a', ARRAY['shopify', 'camiseta', 'rayas', 'forro']),
  ('donativo',      'Donativo',           'ingreso', 'jovenes', '#60a5fa', ARRAY['donativo', 'donación', 'donacion']),
  ('misa_tabor',    'Misa/Tabor',         'ambos',   'jovenes', '#a78bfa', ARRAY['misa', 'tabor', 'jóvenes', 'jovenes']),
  ('gastos_varios', 'Gastos Varios',      'gasto',   NULL,      '#9e96c8', ARRAY['bm princesa', 'mercadona', 'supermercado', 'dia ']),
  ('material',      'Material',           'gasto',   'brand',   '#f59e0b', ARRAY['thomann', 'rotulatumismo']),
  ('viajes',        'Viajes',             'ambos',   'jovenes', '#34d399', ARRAY['jmj', 'iberia', 'vuelo']),
  ('retiros',       'Retiros',            'ambos',   'jovenes', '#c084f5', ARRAY['retiro', 'silencio']),
  ('musica',        'Música',             'gasto',   'jovenes', '#fbbf24', ARRAY['música', 'musica']),
  ('misiones_peru', 'Misiones Perú',      'ambos',   'jovenes', '#f56565', ARRAY['misiones', 'peru', 'misionero', 'reserva plaza', 'reserva']),
  ('stripe',        'Stripe',             'ingreso', NULL,      '#635bff', ARRAY['stripe']),
  ('recibo',        'Recibo/Suscripción', 'gasto',   NULL,      '#6b7280', ARRAY['recibo', 'o2 movil', 'ionos']),
  ('traspaso',      'Traspaso',           'gasto',   NULL,      '#374151', ARRAY['traspaso']),
  ('bac',           'BAC',                'ambos',   'jovenes', '#ef4444', ARRAY['bac', 'contra corriente']),
  ('otros',         'Otros',              'ambos',   NULL,      '#4b5563', ARRAY[])
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. Movimientos bancarios (CSV upload)
-- ============================================================
CREATE TABLE IF NOT EXISTS semper_movimientos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fecha_operacion DATE NOT NULL,
  fecha_valor DATE NOT NULL,
  concepto TEXT NOT NULL,
  importe NUMERIC(12,2) NOT NULL,
  saldo NUMERIC(12,2),
  categoria TEXT REFERENCES semper_categorias(id),
  caja TEXT CHECK (caja IN ('brand', 'jovenes') OR caja IS NULL),
  persona TEXT,
  etiqueta TEXT,
  auto_categoria BOOLEAN DEFAULT false,
  confirmado BOOLEAN DEFAULT false,
  hash TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE semper_movimientos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_semper_movimientos" ON semper_movimientos
  FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS semper_mov_fecha_idx ON semper_movimientos (fecha_operacion DESC);
CREATE INDEX IF NOT EXISTS semper_mov_categoria_idx ON semper_movimientos (categoria);
CREATE INDEX IF NOT EXISTS semper_mov_caja_idx ON semper_movimientos (caja);
CREATE INDEX IF NOT EXISTS semper_mov_hash_idx ON semper_movimientos (hash);

-- ============================================================
-- 3. Ventas manuales (presenciales/efectivo)
-- ============================================================
CREATE TABLE IF NOT EXISTS semper_ventas_manual (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fecha DATE NOT NULL,
  concepto TEXT NOT NULL,
  importe NUMERIC(12,2) NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('efectivo', 'bizum', 'tarjeta')),
  categoria TEXT REFERENCES semper_categorias(id),
  caja TEXT DEFAULT 'brand' CHECK (caja IN ('brand', 'jovenes')),
  registrado_por TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE semper_ventas_manual ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_semper_ventas_manual" ON semper_ventas_manual
  FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS semper_ventas_fecha_idx ON semper_ventas_manual (fecha DESC);
