import Cart from "../models/Cart";
import ApiError from "../utils/ApiError";
import decreaseStock from "../utils/decreaseStock";

/**
 * @desc To add item to Cart
 * @route POST /api/cart
 * @access Public
 */
export const addItemToCart = async (req, res, next) => {
  const { user, body } = req;
  const { products } = body;

  const cart = new Cart({
    user,
    products,
  });

  cart.save((err, data) => {
    if (err) {
      return next(
        new ApiError(
          "Your request could not be processed. Please try again.",
          400
        )
      );
    }

    decreaseStock(products);

    res.status(200).json({
      isSuccess: true,
      cartId: data.id,
    });
  });
};

/**
 * @desc To delete item to Cart
 * @route DELETE /api/cart/:cartId
 * @access Public
 */
export const removeCartItem = async (req, res, next) => {
  const { params } = req;
  await Cart.deleteOne({ _id: params.cartId }, (err) => {
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
    });
  });
};
/**
 * @desc To delete item to Cart
 * @route DELETE /api/cart/:cartId/:productId
 * @access Public
 */
export const removeCartProduct = async (req, res, next) => {
  const { params } = req;
  Cart.updateOne({ _id: params.cartId }, { $pull: { products: product } }).exec(
    (err) => {
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
      });
    }
  );
};

/**
 * @desc To update item to Cart
 * @route POST /api/cart/:cartId
 * @access Public
 */
export const updateCartItem = async (req, res, next) => {
  const { params, body } = req;
  Cart.updateOne(
    { _id: params.id },
    { $push: { products: body.product } }
  ).exec((err) => {
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
      message: "Item updated successfully!",
    });
  });
};
