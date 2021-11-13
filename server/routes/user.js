import express from "express";
const router = express.Router();

import uploader from "../middleware/uploader";
import {
  deleteUser,
  getUserById,
  updateUser,
  updateUserAccount,
  listUsers,
} from "../controllers/user";
import { protect, admin } from "../middleware/auth";
import asyncHandler from "../middleware/asyncHandler";

router
  .route("/account")
  .put(
    protect,
    uploader("users").single("avatar"),
    asyncHandler(updateUserAccount)
)

router
  .route("/:id")
  .delete(protect, admin, asyncHandler(deleteUser))
  .get(protect, admin, asyncHandler(getUserById))
  .put(protect, admin, asyncHandler(updateUser));

router.route("/").get(protect, admin, asyncHandler(listUsers));

export default router;
