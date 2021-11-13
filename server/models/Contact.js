import { Schema, model } from "mongoose";

const contactSchema = new Schema(
  {
    name: {
      min: 3,
      max: 20,
      trim: true,
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      trim: true,
      type: String,
      unique: true,
      lowerCase: true,
      required: true,
    },
    message: { type: String, trim: true, required: true },
  },
  { timestamps: true }
);

export default model("Contact", contactSchema);
