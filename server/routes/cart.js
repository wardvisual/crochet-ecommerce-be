import express from "express";
const router = express.Router();
import {
  addItemToCart,
  updateCartItem,
  removeCartItem,
  removeCartProduct,
} from "../controllers/cart";
import asyncHandler from "../middleware/asyncHandler";

router.route("/").post(asyncHandler(addItemToCart));

router
  .route("/:cartId")
  .delete(asyncHandler(removeCartItem))
  .post(asyncHandler(updateCartItem));

router.route("/:cartId/:productId").delete(asyncHandler(removeCartProduct));

export default router;
