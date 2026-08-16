-- Products and categories now belong to a store rather than directly to a
-- user, since a shop owner can run multiple stores.

ALTER TABLE products DROP CONSTRAINT IF EXISTS products_owner_id_fkey;
DROP INDEX IF EXISTS idx_products_owner_id;
ALTER TABLE products DROP COLUMN IF EXISTS owner_id;
ALTER TABLE products ADD COLUMN IF NOT EXISTS store_id BIGINT NOT NULL REFERENCES stores (id);
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products (store_id);

ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_owner_id_fkey;
ALTER TABLE categories DROP CONSTRAINT IF EXISTS uk_categories_owner_id_name;
DROP INDEX IF EXISTS idx_categories_owner_id;
ALTER TABLE categories DROP COLUMN IF EXISTS owner_id;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS store_id BIGINT NOT NULL REFERENCES stores (id);
CREATE INDEX IF NOT EXISTS idx_categories_store_id ON categories (store_id);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uk_categories_store_id_name'
    ) THEN
        ALTER TABLE categories
            ADD CONSTRAINT uk_categories_store_id_name UNIQUE (store_id, name);
    END IF;
END $$;
