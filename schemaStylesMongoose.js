import mongoose from 'mongoose';
const { Schema } = mongoose;

const styles = new Schema({
  product_id: Number,
  style_id: {
    type: Number,
    index: true,
    unique: true
  },
  name: String,
  original_price: Number,
  sale_price: Number,
  default: Boolean,
  photos: [[]],
  skus: {}
});