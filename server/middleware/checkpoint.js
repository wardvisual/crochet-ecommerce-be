import ApiError from "../utils/ApiError";

const checkpoint = async (req, res, next) => {
  try {
    const { user } = req;

    if (!user.verified) {
      return res.json({
        success: true,
        message: "We sent you an activation link",
      });
    }

    next();
  } catch (error) {
    return next(new ApiError("Check your email to verify your account", 400));
  }
};

export default checkpoint;
