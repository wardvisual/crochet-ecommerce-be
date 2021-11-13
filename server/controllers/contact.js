import Contact from "../models/Contact";
import sendEmail from "../services/sendEmail";
import ApiError from "../utils/ApiError";

/**
 * @desc To contact shop
 * @route POST /api/contact
 * @access Public
 */
export const sendContact = async (req, res, next) => {
  const { body } = req;

  const contact = new Contact({
    ...body,
  });

  contact.save(async (err, contact) => {
    if (err) {
      return next(
        new ApiError(
          "Your request could not be processed. Please try again.",
          400
        )
      );
    }

    await sendEmail(
      {
        message: `We receved your message, we will reach you on your email address ${body.email}!`,
        user: { ...contact },
        type: "contact",
      },
      { next, res }
    );
  });
};
