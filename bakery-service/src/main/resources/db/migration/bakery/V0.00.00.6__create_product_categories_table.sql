CREATE TABLE product_categories
(
    product_id  BIGINT NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES categories (id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

CREATE INDEX idx_product_categories_category_id ON product_categories (category_id);
