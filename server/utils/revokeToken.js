import setTokenCookie from "./setTokenCookie";
import asyncHandler from "../middleware/asyncHandler";

const revokeToken = asyncHandler(async (res, refreshToken, ipAddress) => {
  // Revoke token
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;

  await refreshToken.save();

  return res.json({ isSuccess: true, message: "Token revoked" });
});

export default revokeToken;
