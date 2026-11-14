-- Semazen QR menu: D1 schema
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  category INTEGER NOT NULL CHECK(category BETWEEN 1 AND 7),
  name_tr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  price INTEGER NOT NULL CHECK(price >= 0),
  image_url TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
