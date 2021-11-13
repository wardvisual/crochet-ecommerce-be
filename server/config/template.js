import { BASE_CLIENT_URL } from "../constants";

export const {
  refreshAccountVerificationEmail,
  accountVerificationEmail,
  forgotPasswordEmail,
  contactEmail,
  resetPasswordEmail,
  orderConfirmationEmail,
  signupEmail,
} = {
  signupEmail: ({ user, next }) => {
    const { _doc } = user;
    const { firstName, lastName, email } = _doc;

    const mail = {
      to: email,
      subject: "Account Registration",
      text: "ALL ABOUT CROCHET BY MRS. P",
      html: `
        <h1>Hi ${firstName} ${lastName}!</h1>
        <p>Thank you for creating an account with us!.</p>
        `,
      next,
    };

    return mail;
  },
  accountVerificationEmail: ({ user, next }) => {
    const { _doc } = user;
    const { firstName, email } = _doc;
    const mail = {
      to: email,
      subject: "Account Verification.",
      text: "Please verify your account.",
      html: `
        <h1>Hi, ${firstName}!</h1>
        <p>Please click the following link to verify your account.</p>
        <a href="${BASE_CLIENT_URL}/auth/verify-account/${user.verificationCode}" target="_blank"><button>Verify Now</button></a>
        `,
      next,
    };

    return mail;
  },

  refreshAccountVerificationEmail: ({ user, next }) => {
    const { _doc } = user;
    const { firstName, email } = _doc;
    const mail = {
      to: email,
      subject: "Account Verification.",
      text: "New verification code!",
      html: `
        <h1>Hi, ${firstName}!</h1>
        <p>You have received a new verification code.</p>
        <p>Please click the following link to verify your account.</p>
        <a href="${BASE_CLIENT_URL}/auth/verify-account/${user.verificationCode}" target="_blank"><button>Verify Now</button></a>
        `,
      next,
    };

    return mail;
  },

  forgotPasswordEmail: ({ user, resetToken, next }) => {
    const mail = {
      to: user.email,
      subject: `Password Reset.`,
      text: `You have requested a password reset.`,
      html: `
        <h1>Hi, ${user.firstName}!</h1>
        <p>You told us you forgot your password. If you really did, click here to create a new one: </p>
        <a href="${BASE_CLIENT_URL}/auth/reset-password/${resetToken}" clicktracking=off target="_blank"><button>RESET PASSWORD</button></a>
        <p>If you didn't mean to reset your password, then you can just ignore this email; your password will not change.</p>
        `,
      next,
    };

    return mail;
  },

  resetPasswordEmail: ({ user, next }) => {
    const { _doc } = user;
    const { firstName, email } = _doc;

    const mail = {
      to: email,
      subject: `Reset Password Successful.`,
      text: `Password Changed`,
      html: `
        <h1>Hi, ${firstName}!</h1>
        <p>You are receiving this email because you changed your password.</p>
        <p>If you did not request this change, please contact us immediately.</p>
        `,
      next,
    };

    return mail;
  },

  orderConfirmationEmail: ({ user, next }) => {
    const { _doc, _id } = user;
    const { firstName, email } = _doc;

    const mail = {
      to: email,
      subject: `Order Confirmation ${_id}.`,
      text: `Your order has been placed successfully!`,
      html: `
        <h1>Hi, ${firstName}!</h1>
        <p>Thank you for your order!.</p>
        <p>We've received your order and will contact you as soon as your package is shipped.</p>
        `,
      next,
    };

    return mail;
  },
  contactEmail: ({ user, next }) => {
    const { firstName, email } = user._doc;

    const mail = {
      to: email,
      subject: `ALL ABOUT CROCHET BY MRS. P - Contact Us`,
      text: `Thanks for your message!`,
      html: `
        <h1>Hi, ${firstName}!</h1>
        <p>We received your message! Our team will contact you soon.</p>
        `,
      next,
    };

    return mail;
  },
};
