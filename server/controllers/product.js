import { BASE_SERVER_URL, PORT } from "../constants";
import Product from "../models/Product";
import ApiError from "../utils/ApiError";

/**
 * @desc Create a product
 * @route POST /api/products
 * @access Private/Admin
 */
export const createProduct = async (req, res, next) => {
  const { files, user, body } = req;
  const { variations, tags } = body;

  const { getImages, getVariations, getTags } = {
    getImages: () => {
      const images = [];

      if (files.length > 0) {
        const path = files.map(
          (file) =>
            `${BASE_SERVER_URL}:${PORT}/${
              file.path.split("uploads\\products\\")[1]
            }`
        );

        path.forEach((file) =>
          images.push({
            img: file,
            isCoverPhoto: path[0] === file ? true : false,
          })
        );
      }

      return images;
    },

    getVariations: () => {
      return JSON.parse(variations);
    },

    getTags: () => {
      return JSON.parse(tags);
    },
  };

  const product = new Product({
    ...body,
    tags: getTags(),
    images: getImages(),
    createdBy: user._id,
    variations: getVariations(),
  });

  const createdProduct = await product.save();

  res.status(201).json({
    isSuccess: true,
    message: "Product created",
    createdProduct,
  });
};

/**
 * @desc To update a product
 * @route PUT /api/products
 * @access Private/Admin
 */
export const updateProduct = async (req, res, next) => {
  const { name, description, category, price, countInStock } = req.body;
  const { images } = req.file;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ApiError("Product not found.", 404));
  }

  product.name = name || product.name;
  product.description = description || product.description;
  product.category = category || product.category;
  product.price = price || product.price;
  product.countInStock = countInStock || product.countInStock;
  product.images = images || product.images;

  const updatedProduct = await product.save();

  res.status(201).json({
    isSuccess: true,
    message: "Product updated successfully.",
    updatedProduct,
  });
};

/**
 * @desc Delete a product
 * @route DELETE /api/products/:id
 * @access Private/Admin
 */
export const deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ApiError("Product not found.", 404));
  }

  await product.remove();

  res.status(201).json({
    isSuccess: true,
    message: "Product deleted successfully.",
  });
};

/**
 * @desc Fetch all products
 * @route GET /api/products
 * @access Public
 */
export const listProducts = async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
};

/**
 * @desc Fetch single product
 * @route GET /api/products/:id
 * @access Public
 */
export const getProductById = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    next(new ApiError("Product not found", 404));
  }

  res.json(product);
};

/**
 * @desc Get top rated products
 * @route GET /api/products/top
 * @access Public
 */
export const getTopProducts = async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
};

/**
 * @desc Create new review
 * @route GPOST /api/products/:id/reviews
 * @access Private
 */
export const createProductReview = async (req, res, next) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    next(new ApiError("Product not found", 404));
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    next(new ApiError("Product already reviewed", 400));
  }

  const review = {
    rating: Number(rating),
    name: req.user.name,
    user: req.user._id,
    comment,
  };

  product.reviews.push(review);

  product.numReviews = product.reviews.length;

  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ isSuccess: true, message: "Review added" });
};
