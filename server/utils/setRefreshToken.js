import setTokenCookie from "./setTokenCookie";
import asyncHandler from "../middleware/asyncHandler";

const setRefreshToken = asyncHandler(
  async (res, tokenFromDocument, ipAddress) => {
    const { user } = tokenFromDocument;

    // generate new refrehsh token and save
    const { refreshToken } = await user
      .signRefreshToken(user, ipAddress)
      .save();

    tokenFromDocument.revoked = Date.now();
    tokenFromDocument.revokedByIp = ipAddress;
    tokenFromDocument.replacedByToken = refreshToken;

    await tokenFromDocument.save();

    setTokenCookie(res, refreshToken);

    return res.status(200).json({
      isSuccess: true,
      user: user.getUserInfo(),
      message: "Token refresh successfully",
      accessToken: user.signAccessToken(user),
    });
  }
);

export default setRefreshToken;
