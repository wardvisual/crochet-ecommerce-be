import crypto from "crypto";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

import User from "../models/User";
import ApiError from "../utils/ApiError";
import { REFRESH_TOKEN } from "../constants";
import sendEmail from "../services/sendEmail";
import revokeToken from "../utils/revokeToken";
import RefreshToken from "../models/RefreshToken";
import setAccessToken from "../utils/setAccessToken";
import getRefreshToken from "../utils/getRefreshToken";
import setRefreshToken from "../utils/setRefreshToken";
import capitalizeFirstLetter from "../utils/capitalizeFirstLetter";
import { hashPassword, matchPasswords } from "../utils/hashPassword";

let UNVERIFIED_USER_ID = "";

/**
 * @desc To a verify a new users account via email
 * @route GET /api/auth/checkpoint/:id
 * @access Private
 */
export const accountCheckpoint = async ({ user, next, res }) => {
  if (!user.isVerified) {
    await sendEmail(
      {
        message: {
          title: "Check Your Inbox!",
          subtitle1: `For added security, we need to verify your email address. We've sent a confirmation link to <b>${user.email}</b>`,
          subtitle2: `Please click on the link that has just been sent to your email address to verify your account.`,
          subtitle3: `Didn't get the verification email?`,
        },
        user,
        type: "account-verification",
      },
      { next, res }
    );
  } else {
    return true;
  }
};

/**
 * @desc To a create a new User account.
 * @route POST /api/auth/register
 * @access Public
 */
export const signup = async (req, res, next) => {
  const { username, email, password, confirmPassword, firstName, lastName } =
    req.body;

  let user = await User.findOne({ username });

  //Check if the username is taken or not
  if (user) {
    return next(new ApiError("Username is already in use.", 401));
  }

  //Check if the user exists with that email
  user = await User.findOne({ email });

  if (user) {
    return next(new ApiError("E-mail already in use.", 401));
  }

  if (password !== confirmPassword) {
    return next(new ApiError("Password must be same", 401));
  }

  user = new User({
    ...req.body,
    password: await hashPassword(password),
    firstName: capitalizeFirstLetter(firstName),
    lastName: capitalizeFirstLetter(lastName),
    verificationCode: randomBytes(20).toString("hex"),
  });

  await user.save();

  UNVERIFIED_USER_ID = user._id;

  await accountCheckpoint({ user, next, res });
};

/**
 * @desc To authenticate an user and get auth token
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req, res, next) => {
  const { username, password } = req.body;
  const ipAddress = req.ip;

  const user = await User.findOne({ username });

  if (!user) {
    return next(new ApiError("Incorrect username or password.", 401));
  }

  if (!(await matchPasswords(password, user))) {
    return next(new ApiError("Incorrect username or password.", 401));
  }

  const message = "You are now logged in.";

  const isVerified = await accountCheckpoint({ user, next, res });

  if (isVerified) {
    setAccessToken(message, res, user, ipAddress);
  }
};

/**
 * @desc o a verify a new users account via email
 * @route POST /api/auth/verify-now/:verificationCode
 * @access Public <Only via email>
 */
export const verifyUser = async (req, res, next) => {
  const { verificationCode } = req.params;

  const user = await User.findOne({ verificationCode });

  if (!user) {
    return next(
      new ApiError(
        "Unauthorized access. Invalid verificationCode returned.",
        401
      )
    );
  }

  user.isVerified = true;
  user.verificationCode = undefined;

  await user.save();

  await sendEmail(
    {
      message:
        "Congratulations! You have an account! Thank you for creating an account with us!",
      user,
      type: "signup",
    },
    { next, res }
  );
};

/**
 * @desc To authenticate google
 * @route GET /api/auth/google/redirect
 * @access Public
 */
export const authenticateGoogle = (req, res) => {
  const { user, ip } = req;

  console.log("AUTHENTICATED!");
  setAccessToken("You are now authenticated.", res, user, ip);
};

/**
 * @desc Forgot user password
 * @route  POST /api/auth/forgot-Password
 * @access Public
 */
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    return next(new ApiError("Invalid email address", 404));
  }

  const resetToken = user.generatePasswordReset();

  await user.save();
  // Sent the password reset Link in the email.

  try {
    await sendEmail(
      {
        message: "Please check your email for password reset instructions",
        user,
        resetToken,
        type: "forgot-password",
      },
      { next, res }
    );
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpireIn = undefined;

    return next(new ApiError("An error occured while sending the email.", 500));
  }
};

/**
 * @desc Reset user password  <Via Email>
 * @route  PUT /api/auth/reset-password/:resetToken
 * @access Private
 */
export const resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpireIn: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Your reset password link is expired", 400));
  }

  user.password = (await hashPassword(req.body.password)) || user.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpireIn = undefined;

  await user.save();

  await sendEmail(
    {
      message:
        "Congratulations! You have successfully changed your password. You can now login to your account.",
      user,
      type: "reset-password",
    },
    { next, res }
  );
};

/**
 * @desc To logout user.
 * @route  POST /api/auth/logout
 * @access Private
 */
export const logoutUser = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  req.logout();
  res.clearCookie("refreshToken", { expires: new Date(0) });
  res.clearCookie("accessToken");
  res.cookie("MrsPCrochetWorks", { expires: new Date(0) });
  await RefreshToken.findOneAndDelete(refreshToken);

  return res
    .status(200)
    .json({ isSuccess: true, message: "You are now logged out" });
};

/**
 * @desc To refresh the access token.
 * @route  POST /api/auth/refresh-access-token
 * @access Private
 */
export const refreshAccessToken = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  const ipAddress = req.ip;

  if (refreshToken === null || !refreshToken) {
    return next(new ApiError("Access denied", 403));
  }

  const tokenFromDocument = await getRefreshToken(refreshToken, next);

  if (!tokenFromDocument) {
    return next(new ApiError("Invalid token. Unauthorized.", 401));
  }

  const verifiedRefreshToken = jwt.verify(
    tokenFromDocument.refreshToken,
    REFRESH_TOKEN
  );

  if (!verifiedRefreshToken) {
    return next(new ApiError("Invalid token. Unauthorized", 401));
  }

  setRefreshToken(res, tokenFromDocument, ipAddress);
};

/**
 * @desc To re-new the verification code.
 * @route  GET /api/auth/refresh-verification-code
 * @access Private
 */
export const refreshVerificationCode = async (req, res, next) => {
  let currentUser = await User.findOne({ _id: UNVERIFIED_USER_ID });

  if (currentUser) {
    currentUser.signNewVerificationCode();
  }

  await currentUser.save();

  await sendEmail(
    {
      message: "Verification Code Sent!",
      user: currentUser,
      type: "refresh-verification-code",
    },
    { next, res }
  );
};

/**
 * @desc To revoke the token.
 * @route  POST /api/auth/revoke-token
 * @access Private
 */
export const revokeUserToken = async (req, res, next) => {
  const token = req.cookies.refreshToken || req.cookies.accessToken;
  const ipAddress = req.ip;

  if (!token) {
    return next(new ApiError("Token is required", 400));
  }

  // && req.user.role !== ADMIN_ROLE

  // users can revoke their own tokens and admins can revoke any tokens
  if (!req.user.ownsToken(token)) {
    return next(new ApiError("Token is invalid. Unauthorized access", 401));
  }

  const tokenFromDocument = await getRefreshToken(token, next);

  if (!tokenFromDocument) {
    return next(new ApiError("Invalid token. Unauthorized", 401));
  }

  const decodedRefreshToken = jwt.verify(
    tokenFromDocument.refreshToken,
    REFRESH_TOKEN
  );

  if (!decodedRefreshToken) {
    return next(new ApiError("Invalid token. Unauthorized", 401));
  }

  revokeToken(res, tokenFromDocument, ipAddress);
};
