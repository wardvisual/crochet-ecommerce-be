import asyncHandler from "../middleware/asyncHandler";
import RefreshToken from "../models/RefreshToken";
import ApiError from "./ApiError";

const getRefreshToken = asyncHandler(async (token, next) => {
  const refreshToken = await RefreshToken.findOne({
    refreshToken: token,
  }).populate("user");

  if (!refreshToken || !refreshToken.isActive)
    return next(new ApiError("Invalid token. Unauthorized", 401));

  return refreshToken;
});

export default getRefreshToken;
