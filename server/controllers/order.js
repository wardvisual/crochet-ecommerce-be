import Cart from "../models/Cart";
import Order from "../models/Order";
import Product from "../models/Product";
import sendEmail from "../services/sendEmail";
import ApiError from "../utils/ApiError";
import calculateTaxAmount from "../utils/calculateTaxAmount";
import increaseStock from "../utils/increaseStock";

/**
 * @desc To create a new order
 * @route POST /api/orders
 * @access Private
 */
export const addOrder = async (req, res, next) => {
  const { body } = req;

  const order = new Order({
    cart: body.cartId,
    user: req.user._id,
    total: body.total,
  });

  const { _id, cart, created, user, total } = await order.save();

  await Order.findById(_id).populate("cart user", "-password");

  const { products } = await Cart.findById(cart._id).populate({
    path: "products.product",
    // populate: {
    //   path: "brand",
    // },
  });

  const newOrder = {
    _id,
    created,
    total,
    products,
  };

  await sendEmail(
    {
      message: `Your order has been placed successfully!`,
      user: { ...user, ...newOrder },
      type: "order-confirmation",
    },
    { next, res }
  );
};

/**
 * @desc To fetch all orders
 * @route GET /api/orders
 * @access Private
 */
export const listOrders = async (req, res, next) => {
  const { user } = req;

  const orders = await Order.find({ user: user._id }).populate({
    path: "cart",
  });

  const newOrders = orders.filter(({ cart }) => cart);

  if (newOrders.length > 0) {
    const newDataSet = [];

    newOrders.map(async (doc) => {
      const cardId = doc.cart._id;

      const cart = await Cart.findById(cardId).populate({
        path: "products.product",
        // populate: { path: "brand" },
      });

      const order = {
        _id: doc._id,
        total: parseFlot(Number(doc.total.toFixed(2))),
        created: doc.created,
        products: cart.products,
      };

      newDataSet.push(order);

      if (newDataSet.length === newDataSet.length) {
        newDataSet.sort((a, b) => b.created - a.created);
        res.status(200).json({
          orders: newDataSet,
        });
      }
    });
  } else {
    res.status(200).json({ orders: [] });
  }
};

/**
 * @desc To fetch one order
 * @route GET /api/orders/:orderId
 * @access Private
 */
export const listOrder = async (req, res, next) => {
  const { user, params } = req;

  const orderId = params.orderId;

  const orderDoc = await Order.findOne({
    _id: orderId,
    user: user._id,
  }).populate({ path: "cart" });

  const { _id, cart, total } = orderDoc;

  if (!orderDoc) {
    return next(
      new ApiError(`Cannot find order with the id: ${orderId}.`, 404)
    );
  }

  const cartDoc = await Cart.findById(cart._id).populate({
    path: "products.product",
    // populate: { path: "brand" },
  });

  let order = {
    _id,
    total,
    totalTax: 0,
    cartId: cart._id,
    products: cartDoc.products,
  };

  order = calculateTaxAmount(order);

  return res.status(200).json({
    order,
  });
};

/**
 * @desc To delete order
 * @route DELETE /api/orders/:orderId
 * @access Private
 */
export const deleteOrder = async (req, res, next) => {
  const { user, params } = req;
  const orderId = params.orderId;

  const order = await Order.findOne({ _id: orderId });
  const { products } = await Cart.findOne({ _id: order.cart });

  increaseStock(products);

  await Order.deleteOne({ _id: orderId });
  await Cart.deleteMany({ _id: order.cart });

  res.status(200).json({
    isSuccess: true,
  });
};

/**
 * @desc To update order
 * @route PUT /api/orders/item/:itemId
 * @access Private
 */
export const cancelOrder = async (req, res, next) => {
  const { params, body } = req;

  const itemId = params.itemId;
  const orderId = body.orderId;
  const cartId = body.cartId;

  const foundCart = await Cart.findOne({ "products._id": itemId });
  const { product } = foundCart.products.find((p) => p._id == itemId);

  await Cart.updateOne(
    { "products._id": itemId },
    { "products.$.status": "Cancelled" }
  );

  await Product.updateOne({ _id: product }, { $inc: { stock: 1 } });

  const cart = await Cart.findOne({ _id: cartId });
  const items = cart.products.filter(({ status }) => status === "Cancelled");

  /* All items are cancelled -->  CANCEL ORDER */
  if (cart.products.length === items.length) {
    await Order.deleteOne({ _id: orderId });
    await Cart.deleteOne({ _id: cartId });

    return res.status(200).json({
      isSuccess: true,
      orderCancelled: true,
      message: "Your order has been cancelled successfully!",
    });
  }

  res.status(200).json({
    isSuccess: true,
    message: "Item has been cancelled successfully!",
  });
};
