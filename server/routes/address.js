import express from "express";
const router = express.Router();

import { protect } from "../middleware/auth";
import asyncHandler from "../middleware/asyncHandler";

import {
  addAddress,
  deleteAddress,
  getAddress,
  getAddresses,
  updateAddress,
} from "../controllers/address";

router
  .route("/")
  .post(protect, asyncHandler(addAddress))
  .get(protect, asyncHandler(getAddresses));

router
  .route("/:id")
  .get(protect, asyncHandler(getAddress))
  .put(protect, asyncHandler(updateAddress))
  .delete(protect, asyncHandler(deleteAddress));

export default router;
