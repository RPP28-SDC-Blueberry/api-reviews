CREATE TABLE product (
  product_id bigserial PRIMARY KEY,
  campus varchar(10),
  name text,
  slogan text,
  description text,
  category varchar(30),
  default_price money,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
);

CREATE TABLE styles (
  style_id bigserial PRIMARY KEY,
  product_id bigint REFERENCES product(product_id),
  name text,
  original_price money,
  sale_price money,
  default_style boolean
);

CREATE TABLE skus (
  sku_id bigserial PRIMARY KEY,
  style_id bigint REFERENCES styles(style_id),
  quantity int,
  size varchar(20)
);

CREATE TABLE photos (
  photo_id bigserial PRIMARY KEY,
  style_id bigint REFERENCES styles(style_id),
  url text,
  thumbnail_url text
);

CREATE TABLE features (
  features_id bigserial PRIMARY KEY,
  product_id bigint REFERENCES product(product_id),
  feature text,
  value text
);

CREATE TABLE related (
  related_id bigserial PRIMARY KEY,
  product_id bigint REFERENCES product(product_id),
  related_product_id bigint
);

-- Indexing

-- Styles
CREATE INDEX styles_product_id_index ON styles (product_id);
CREATE INDEX photos_style_id_index ON photos (style_id);
CREATE INDEX skus_style_id_index ON skus (style_id);
-- Related
CREATE INDEX related_product_id_index ON related (product_id);
-- Product
CREATE INDEX product_product_id_index ON product (product_id);
CREATE INDEX features_product_id_index ON features (product_id);