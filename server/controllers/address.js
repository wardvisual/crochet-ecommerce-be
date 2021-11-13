import Address from "../models/Address";
import ApiError from "../utils/ApiError";

/**
 * @desc To add new address
 * @route POST /api/users/address/
 * @access Private
 */
export const addAddress = async (req, res, next) => {
  const { user, body } = req;

  const address = new Address(Object.assign(body, { user: user._id }));

  address.save((err, data) => {
    if (err) {
      return next(
        new ApiError(
          "Your request could not be processed. Please try again.",
          400
        )
      );
    }

    res.status(200).json({
      isSuccess: true,
      message: `Address has been added successfully!`,
      address: data,
    });
  });
};

/**
 * @desc To get all addresses
 * @route GET /api/users/address/
 * @access Private
 */
export const getAddresses = async (req, res) => {
  await Address.find({ user: req.user._id }, (err, data) => {
    if (err) {
      return next(
        new ApiError(
          "Your request could not be processed. Please try again.",
          400
        )
      );
    }

    res.status(200).json({
      isSuccess: true,
      addresses: data,
    });
  });
};

/**
 * @desc To get address
 * @route GET /api/users/address/:id
 * @access Private
 */
export const getAddress = async (req, res) => {
  const { params } = req;
  const addressId = params.id;

  const addressDoc = await Address.findOne({ _id: addressId });

  if (!addressDoc) {
    return next(
      new ApiError(`Cannot find Address with the id: ${addressId}.`, 400)
    );
  }

  res.status(200).json({
    address: addressDoc,
  });
};

/**
 * @desc To update address
 * @route PUT /api/users/address/:id
 * @access Private
 */
export const updateAddress = async (req, res) => {
  const { params } = req;
  const addressId = params.id;

  await Address.findOneAndUpdate({ _id: addressId }, update, {
    new: true,
  });

  res.status(200).json({
    isSuccess: true,
    message: "Address has been updated successfully!",
  });
};

/**
 * @desc To delete address
 * @route DELETE /api/users/address/:id
 * @access Private
 */
export const deleteAddress = async (req, res) => {
  const { params } = req;
  await Address.deleteOne({ _id: params.id }, (err, data) => {
    if (err) {
      return next(
        new ApiError(
          "Your request could not be processed. Please try again.",
          400
        )
      );
    }

    res.status(200).json({
      isSuccess: true,
      message: "Address has been deleted successfully!",
      adddress: data,
    });
  });
};
