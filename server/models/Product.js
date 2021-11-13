import Mongoose from "mongoose";
import slug from "mongoose-slug-generator";
const { Schema, model } = Mongoose;

const options = {
  separator: "-",
  lang: "en",
  truncate: 120,
};

Mongoose.plugin(slug, options);

const reviewSchema = Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, trim: true, required: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const productSchema = Schema(
  {
    sku: {
      type: String,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },
    images: [{ img: { type: String }, isCoverPhoto: { type: Boolean } }],
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    taxable: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    variations: [
      {
        name: { type: String },
        options: { type: Array },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    tags: {
      type: Array,
    },
  },
  { timestamps: true }
);

export default model("Product", productSchema);
