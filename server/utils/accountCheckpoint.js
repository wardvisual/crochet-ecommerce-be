import asyncHandler from "../middleware/asyncHandler";

const accountCheckpoint = async (res, currentUser) => {
  console.log("> User > ", currentUser);
  console.log("YOU ARE NOT VERIFIED");
  const { confirmationCode, user } = currentUser;

  res.status(201).json({
    isSuccess: true,
    message: `To confirm your account, click the link we sent to: ${currentUser.email}`,
  });
};

export default accountCheckpoint;
