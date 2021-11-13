import express from "express";
const router = express.Router();
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/category";
import asyncHandler from "../middleware/asyncHandler";
import { admin, protect } from "../middleware/auth";
import uploader from "../middleware/uploader";

router
  .route("/")
  .post(
    protect,
    admin,
    uploader("categories").single("image"),
    asyncHandler(addCategory)
  )
  .get(asyncHandler(getCategories));

router
  .route("/:id")
  .get(asyncHandler(getCategory))
  .put(
    protect,
    admin,
    uploader("categories").single("image"),
    asyncHandler(updateCategory)
  )
  .delete(protect, admin, asyncHandler(deleteCategory));
export default router;
