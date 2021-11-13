import express from "express";
const router = express.Router();

import {
  addOrder,
  cancelOrder,
  deleteOrder,
  listOrder,
  listOrders,
} from "../controllers/order";
import asyncHandler from "../middleware/asyncHandler";
import { protect } from "../middleware/auth";

router
  .route("/")
  .post(protect, asyncHandler(addOrder))
  .get(protect, asyncHandler(listOrders));

router
  .route("/:orderId")
  .get(protect, asyncHandler(listOrder))
  .delete(protect, asyncHandler(deleteOrder));

router.route("/item/:itemId").put(protect, asyncHandler(cancelOrder));

export default router;
