import { Schema, model } from "mongoose";

const orderSchema = Schema(
  {
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default model("Order", orderSchema);
