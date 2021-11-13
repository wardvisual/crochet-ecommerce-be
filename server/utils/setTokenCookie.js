const setTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    secure: false, // true
    sameSite: false, // true, strict, lax
  });
};

export default setTokenCookie;
