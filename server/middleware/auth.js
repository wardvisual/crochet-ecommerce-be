import jwt from "jsonwebtoken";
import { ACCESS_TOKEN, ADMIN_ROLE } from "../constants";
import RefreshToken from "../models/RefreshToken";
import User from "../models/User";
import ApiError from "../utils/ApiError";
import asyncHandler from "./asyncHandler";

const checkRefreshToken = asyncHandler(async (req, next) => {
  const refreshToken = await RefreshToken.find(req.user.id);

  if (!refreshToken)
    next(
      new ApiError(
        "You don't have permission to access this route. Unauthorized.",
        401
      )
    );

  return [
    (req.user.ownsToken = (token) =>
      !!refreshToken.find((x) => x.refreshToken === token)),
  ];
});

export const protect = async (req, res, next) => {
  let accessToken;
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader && authorizationHeader.startsWith("Bearer")) {
    try {
      accessToken = authorizationHeader.split(" ")[1];

      const { user } = jwt.verify(accessToken, ACCESS_TOKEN);

      req.user = user;

      await checkRefreshToken(req, next);

      next();
    } catch (error) {
      return next(new ApiError("Access denied. AccessToken expired.", 403));
    }
  }
  if (!accessToken) {
    return next(
      new ApiError(
        "You don't have permission to access this route. Unauthorized.",
        401
      )
    );
  }
};

export const admin = (req, res, next) => {
  const role = req.user && req.user.role === ADMIN_ROLE;
  if (!role) {
    next(new ApiError("Not authorized as an admin.", 401));
  }

  next();
};