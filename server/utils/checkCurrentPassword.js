import bcrypt from "bcryptjs";
import ApiError from "./ApiError";

const checkCurrentPassword = async ({
  currentPasswordClient,
  currentPasswordServer,
  newPassword,
  next,
}) => {
  const isCurrentPasswordMatch = await bcrypt.compare(
    currentPasswordClient,
    currentPasswordServer
  );

  if (!isCurrentPasswordMatch) {
    return next(new ApiError("Current password is incorrect.", 401));
  }
  currentPasswordServer = newPassword || currentPasswordServer;
};

export default checkCurrentPassword;
