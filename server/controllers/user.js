import User from "../models/User";
import { BASE_SERVER_URL, PORT } from "../constants";
import setAccessToken from "../utils/setAccessToken";
import ApiError from "../utils/ApiError";
import capitalizeFirstLetter from "../utils/capitalizeFirstLetter";
import bcrypt from "bcryptjs";
import Address from "../models/Address";

/**
 * @desc To update user account
 * @route PUT /api/users/account
 * @access Private
 */
export const updateUserAccount = async (req, res, next) => {
  const { file, body, ip } = req;
  const ipAddress = ip;
  const user = await User.findById(req.user._id);

  let avatar;
  if (file) {
    avatar = `${BASE_SERVER_URL}:${PORT}/${
      file.path.split("uploads\\users\\")[1]
    }`;
  }

  const { firstName, lastName, username, currentPassword, newPassword, email } =
    body;

  if (!user) {
    return next(new ApiError("User not found.", 404));
  }

  user.firstName = capitalizeFirstLetter(firstName) || user.firstName;
  user.lastName = capitalizeFirstLetter(lastName) || user.lastName;
  user.username = username || user.username;
  user.avatar = avatar || user.avatar;
  user.email = email || user.email;

  if (currentPassword) {
    const isCurrentPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordMatch) {
      return next(new ApiError("Current password is incorrect.", 401));
    }

    user.password = newPassword || user.password;
  }

  const updatedUser = await user.save();
  const message = "Account successfully updated.";

  setAccessToken(message, res, updatedUser, ipAddress);
};

/**
 * @desc To create user address
 * @route POST /api/users/address
 * @access Private
 */
export const createUserAddress = async (req, res, next) => {
  const { body } = req;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ApiError("User not found.", 404));
  }

  const address = new Address({
    user: user._id,
    address: [{ ...body }],
  });

  res.json({
    isSuccess: true,
    message: "Address successfully created. ",
    address,
  });
};

/**
 * @desc To update user address
 * @route PUT /api/users/address
 * @access Private
 */
export const updateUserAddress = async (req, res, next) => {
  const { city, address, barangay, postalCode, mobileNumber, shippingPrice } =
    req.body;

  const user = await User.findById(req.user._id).populate("UserAddress");

  if (!user) {
    return next(new ApiError("User not found.", 404));
  }

  user.address.city = city || user.address.city;
  user.address.address = address || user.address.address;
  user.address.barangay = barangay || user.address.barangay;
  user.address.postalCode = postalCode || user.address.postalCode;
  user.address.mobileNumber = mobileNumber || user.address.mobileNumber;
  user.address.shippingPrice = shippingPrice || user.address.shippingPrice;

  const updatedUserAddress = await address.save().populate("UserAddress");

  res.json({
    isSuccess: true,
    message: "Address successfully created. ",
    updatedUserAddress,
  });
};

/**
 * @desc Get all users
 * @route GET /api/users
 * @access Private/Admin
 */
export const listUsers = async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await User.countDocuments({ ...keyword });
  const users = await User.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ users, page, pages: Math.ceil(count / pageSize) });
};

/**
 * @desc Delete user
 * @route DELETE /api/users/:id
 * @access Private/Admin
 */
export const deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) next(new ApiError("User not found", 404));

  await user.remove();
  res.json({ message: "User removed" });
};

/**
 * @desc  Get user by ID
 * @route  GET /api/users/:id
 * @access Private/Admin
 */
export const getUserById = async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) next(new ApiError("User not found", 404));

  res.json(user);
};

/**
 * @desc   Update user
 * @route  PUT /api/users/:id
 * @access Private/Admin
 */
export const updateUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) next(new ApiError("User not found", 404));

  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  user.isAdmin = req.body.isAdmin;

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
};
