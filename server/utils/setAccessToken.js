import setTokenCookie from "./setTokenCookie";
import asyncHandler from "../middleware/asyncHandler";

const setAccessToken = asyncHandler(async (message, res, user, ipAddress) => {
  // After accessToken sent to client we also sent the refresh token in the cookies.

  const { refreshToken } = await user.signRefreshToken(user, ipAddress).save();

  setTokenCookie(res, refreshToken);

  return res.status(200).json({
    isSuccess: true,
    user: user.getUserInfo(),
    accessToken: user.signAccessToken(user),
    message,
  });
});

export default setAccessToken;
