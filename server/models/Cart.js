import { Schema, model } from "mongoose";

// Cart Item Schema
const cartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: Number,
  totalPrice: {
    type: Number,
  },
  priceWithTax: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "Not processed",
    enum: ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"],
  },
});

// Cart Schema
const cartSchema = new Schema(
  {
    products: [cartItemSchema],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

model("CartItem", cartItemSchema);
export default model("Cart", cartSchema);
