import mailgun from "mailgun-js";
import { EMAIL_FROM, MAILGUN_API, MAILGUN_SANDBOX_DOMAIN } from "../constants";

import ApiError from "../utils/ApiError";

const mailer = async ({ to, subject, text, html, next }) => {
  try {
    const mg = mailgun({ apiKey: MAILGUN_API, domain: MAILGUN_SANDBOX_DOMAIN });

    const data = {
      from: `ALL ABOUT CROCHET BY MRS. P <${EMAIL_FROM}>`,
      to,
      subject,
      text,
      html,
    };

    mg.messages().send(data, function (error, body) {
      if (error) {
        return next(
          new ApiError(
            "Error while sending an email. Please try again later!",
            400
          )
        );
      }
      console.log(body);
      return true;
    });
  } catch (error) {
    console.log("Mailer Error: ", error);
    return next(
      new ApiError("Error while sending an email. Please try again later!", 400)
    );
  }
};

export default mailer;

// import nodemailer from "nodemailer";
// import {
//   EMAIL_SERVICE,
//   EMAIL_USERNAME,
//   EMAIL_PASSWORD,
//   EMAIL_FROM,
//   MAILGUN_API
// } from "../constants";
// import ApiError from "../utils/ApiError";

// const mailer = async ({ to, subject, text, html, next }) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: EMAIL_SERVICE,
//       auth: {
//         user: EMAIL_USERNAME,
//         pass: EMAIL_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: `ALL ABOUT CROCHET BY MRS. P <${EMAIL_FROM}>`,
//       to,
//       subject,
//       text,
//       html,
//     };

//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.log("Mailer Error: ", error);
//     return next(
//       new ApiError("Error while sending an email. Please try again later!", 400)
//     );
//   }
// };

// export default mailer;
