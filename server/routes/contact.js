import express from "express";
import asyncHandler from "../middleware/asyncHandler";
import { sendContact } from "../controllers/contact";

const router = express.Router();

router.route("/").post(asyncHandler(sendContact));

export default router;
