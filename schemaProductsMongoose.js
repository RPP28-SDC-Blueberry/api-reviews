import mongoose from 'mongoose';
const { Schema } = mongoose;

const products = new Schema({
  product_id: {
    type: Number,
    index: true,
    unique: true
  },
  campus: String,
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: Number,
  created_at: Date,
  updated_at: Date,
  features: [{}],
  related: [Number]
});

CREATE TABLE styles (
  style_id bigserial PRIMARY KEY,
  product_id bigint REFERENCES product_id,
  name text,
  original_price money,
  default boolean,
  photos text[][],
  skus text[][]
);