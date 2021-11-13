import express from "express";
import passport from "passport";
const router = express.Router();

import {
  login,
  signup,
  logoutUser,
  verifyUser,
  resetPassword,
  forgotPassword,
  revokeUserToken,
  refreshAccessToken,
  accountCheckpoint,
  authenticateGoogle,
  refreshVerificationCode
} from "../controllers/auth";
import {
  validateSignInRequest,
  validateSignUpRequest,
  validateForgotPassword,
} from "../validators/validateAuth";
import { protect } from "../middleware/auth";
import { isRequestValidated } from "../middleware/validator";
import validateToken from "../validators/validateToken";
import asyncHandler from "../middleware/asyncHandler";

router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
    access_type: "offline",
    approval_prompt: "select_account",
  })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failure_redirect: "/login",
    session: false,
  }),
  asyncHandler(authenticateGoogle)
);
router.post(
  "/revoke-token",
  protect,
  validateToken,
  isRequestValidated,
  asyncHandler(revokeUserToken)
);

router.post("/refresh-access-token", asyncHandler(refreshAccessToken));

router.get("/refresh-verification-code", asyncHandler(refreshVerificationCode));

router.put("/reset-password/:resetToken", asyncHandler(resetPassword));

router
  .route("/register")
  .post(validateSignUpRequest, isRequestValidated, asyncHandler(signup));

router.get("/verify-account/:verificationCode", asyncHandler(verifyUser));

router.get("/checkpoint", asyncHandler(accountCheckpoint))

router
  .route("/login")
  .post(validateSignInRequest, isRequestValidated, asyncHandler(login));

router.post(
  "/forgot-password",
  validateForgotPassword,
  asyncHandler(forgotPassword)
);

router.post("/logout", asyncHandler(logoutUser));

export default router;
