import mailer from "../config/nodemailer";
import {
  accountVerificationEmail,
  forgotPasswordEmail,
  resetPasswordEmail,
  orderConfirmationEmail,
  contactEmail,
  signupEmail,
  refreshAccountVerificationEmail,
} from "../config/template";
import ApiError from "../utils/ApiError";

const sendEmail = async (
  { type, user, message, resetToken },
  { res, next }
) => {
  try {
    const options = prepareTemplate({ type, user, next, resetToken });

    await mailer(options);

    return res.status(200).json({
      isEmailSent: true,
      isSuccess: true,
      message,
      user: await user.getUserInfo(),
    });
  } catch (err) {
    console.log("err", err);
    return next(new ApiError("There was an error sending email.", 400));
  }
};

const prepareTemplate = ({ type, user, next, resetToken }) => {
  let mail;

  switch (type) {
    case "refresh-verification-code":
      mail = refreshAccountVerificationEmail({ user, next });
      break;
    case "account-verification":
      mail = accountVerificationEmail({ user, next });
      break;
    case "forgot-password":
      mail = forgotPasswordEmail({ user, next, resetToken });
      break;
    case "reset-password":
      mail = resetPasswordEmail({ user, next });
      break;
    case "order-confirmation":
      mail = orderConfirmationEmail({ user, next });
      break;
    case "contact":
      mail = contactEmail({ user, next });
      break;
    case "signup":
      mail = signupEmail({ user, next });
      break;
  }

  return mail;
};
export default sendEmail;
