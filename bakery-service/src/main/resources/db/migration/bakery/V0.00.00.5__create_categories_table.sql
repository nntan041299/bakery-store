CREATE TABLE categories
(
    id         BIGSERIAL    PRIMARY KEY,
    owner_id   BIGINT       NOT NULL REFERENCES users (id),
    name       VARCHAR(100) NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    CONSTRAINT uk_categories_owner_id_name UNIQUE (owner_id, name)
);

CREATE INDEX idx_categories_owner_id ON categories (owner_id);
