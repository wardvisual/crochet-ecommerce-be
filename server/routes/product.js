import express from "express";
const router = express.Router();

import {
  createProductReview,
  getProductById,
  listProducts,
  getTopProducts,
  deleteProduct,
  createProduct,
} from "../controllers/product";
import { protect, admin } from "../middleware/auth";
import asyncHandler from "../middleware/asyncHandler";
import uploader from "../middleware/uploader";

router.get("/top", asyncHandler(getTopProducts));

router
  .route("/:id")
  .get(asyncHandler(getProductById))
  .delete(protect, admin, asyncHandler(deleteProduct));

router
  .route("/")
  .get(asyncHandler(listProducts))
  .post(
    protect,
    admin,
    uploader("products").array("image"),
    asyncHandler(createProduct)
  );

router.route("/:id/reviews").post(protect, asyncHandler(createProductReview));

export default router;
