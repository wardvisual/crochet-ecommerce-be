import Mongoose from "mongoose";
import slug from "mongoose-slug-generator";
const { Schema, model } = Mongoose;

const options = {
  separator: "-",
  lang: "en",
  truncate: 120,
};

const categorySchema = Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      slug: "name",
      unique: true,
    },
    image: { type: String },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

Mongoose.plugin(slug, options);
export default model("Category", categorySchema);
