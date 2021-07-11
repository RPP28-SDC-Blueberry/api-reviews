CREATE TABLE products (
  product_id bigserial PRIMARY KEY,
  campus varchar(10),
  name text,
  slogan text,
  description text,
  category varchar(30),
  default_price money,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  features text[][],
  related bigint[]
);

CREATE TABLE styles (
  style_id bigserial PRIMARY KEY,
  product_id bigint REFERENCES product_id,
  name text,
  original_price money,
  sale_price money,
  default boolean,
  photos text[][],
);

CREATE TABLE skus (
  sku_id bigserial PRIMARY KEY,
  product_id bigint REFERENCES product_id,
  quantity int,
  size varchar(20)
);