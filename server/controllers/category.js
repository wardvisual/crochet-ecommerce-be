import { BASE_SERVER_URL, PORT } from "../constants";
import Category from "../models/Category";
import ApiError from "../utils/ApiError";

/**
 * @desc To create a categories
 * @route POST /api/categories
 * @access Private/Admin
 */
export const addCategory = async (req, res, next) => {
  const { body, file, user } = req;
  const { name, products } = body;

  const path = `${BASE_SERVER_URL}:${PORT}/${
    file.path.split("uploads\\categories\\")[1]
  }`;

  const category = new Category({
    user: user._id,
    image: path,
    products,
    name,
  });

  await category.save();

  res.status(200).json({
    isSuccess: true,
    message: "Category has been added successfully!",
    category,
  });
};

/**
 * @desc To get all categories
 * @route GET /api/categories/
 * @access Public
 */

export const getCategories = async (req, res, next) => {
  const categories = await Category.find();

  if (!categories.length) next(new ApiError("There was no categories", 404));

  res.status(200).json({
    isSuccess: true,
    message: "Category found",
    categories,
  });
};

/**
 * @desc To get all categories
 * @route GET /api/categories/:id
 * @access Public
 */

export const getCategory = async (req, res, next) => {
  const { params } = req;
  const categoryId = params.id;

  const category = await Category.findOne({ _id: categoryId }).populate({
    path: "products",
    select: "name",
  });

  if (!category) {
    return next(new ApiError("No category found", 404));
  }

  res.status(200).json({
    isSuccess: true,
    message: "Category found",
    category,
  });
};

/**
 * @desc To update a category
 * @route PUT /api/categories/:_id
 * @access Private/Admin
 */
export const updateCategory = async (req, res, next) => {
  const { body, file, params } = req;

  const categoryId = await Category.findById(params.id);

  if (!categoryId)
    next(new ApiError("There is no category with this id " + params.id, 404));

  const path = `${BASE_SERVER_URL}/${
    file.path.split("uploads\\categories\\")[1]
  }`;

  const updatedCategory = await Category.findOneAndUpdate(
    { _id: categoryId },
    {
      name: body.name,
      image: path,
    },
    { new: true }
  );

  return res.status(201).json({
    isSuccess: true,
    message: "Successfully updated.",
    updatedCategory,
  });
};

/**
 * @desc   To delete a category
 * @route  DELETE /api/categories/:_id
 * @access Private/Admin
 */
export const deleteCategory = async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category)
    next(new ApiError("There was no category with id " + req.params.id, 404));

  await category.remove();

  res
    .status(200)
    .json({ isSuccess: true, message: "Category successfully removed." });
};
