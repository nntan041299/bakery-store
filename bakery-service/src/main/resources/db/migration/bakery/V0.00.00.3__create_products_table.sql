CREATE TABLE IF NOT EXISTS products
(
    id          BIGSERIAL      PRIMARY KEY,
    owner_id    BIGINT         NOT NULL REFERENCES users (id),
    name        VARCHAR(150)   NOT NULL,
    description VARCHAR(2000),
    price       NUMERIC(10, 2) NOT NULL,
    sku         VARCHAR(50)    NOT NULL UNIQUE,
    image_url   VARCHAR(500),
    is_active   BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP      NOT NULL DEFAULT NOW(),
    created_by  VARCHAR(100),
    updated_by  VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_products_owner_id ON products (owner_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON products (name);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products (sku);
