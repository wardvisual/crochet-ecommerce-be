import { Schema, model } from "mongoose";

/* User Address */
const AddressSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    city: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    barangay: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, require: true },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
  },
  { timestamps: true }
);

export default model("Address", AddressSchema);
