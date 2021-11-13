import { check } from "express-validator";

const firstName = check("firstName")
  .notEmpty()
  .trim()
  .escape()
  .withMessage("firstName is required");

const lastName = check("lastName")
  .notEmpty()
  .trim()
  .escape()
  .withMessage("lastName is required");

const username = check("username")
  .notEmpty()
  .trim()
  .escape()
  .withMessage("username is required");

const email = check("email")
  .notEmpty()
  .isEmail()
  .trim()
  .escape()
  .normalizeEmail()
  .withMessage("Invalid email address");

const password = check("password")
  .notEmpty()
  .isLength({ min: 6 })
  .trim()
  .escape()
  .withMessage("Password is required of minimum length of 6");

export const validateSignUpRequest = [
  firstName,
  lastName,
  username,
  email,
  password,
];

export const validateSignInRequest = [username, password];

export const validateForgotPassword = [email];

// import Joi from "@hapi/joi";

// const schema = Joi.object({
//   firstName: Joi.string()
//     .min(3)
//     .max(30)
//     .required()
//     .rule({ message: "firstName is required" }),
//   lastName: Joi.string()
//     .min(3)
//     .max(30)
//     .required()
//     .rule({ message: "lastName is required" }),
//   username: Joi.string()
//     .alphanum()
//     .min(3)
//     .max(30)
//     .required()
//     .rule({ message: "username is required" }),
//   email: Joi.string()
//     .email({
//       minDomainSegments: 2,
//       tlds: { allow: ["com", "net"] },
//     })
//     .required()
//     .rule({ message: "Invalid email address" }),
//   password: Joi.string()
//     .min(6)
//     .required()
//     .rule({ message: "Password is required of minimum length of 6" }),
// });
