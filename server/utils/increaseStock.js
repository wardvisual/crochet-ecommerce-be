import Product from "../models/Product";

const increaseStock = (products) => {
  let bulkOptions = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: +item.quantity } },
      },
    };
  });

  Product.bulkWrite(bulkOptions);
};

export default increaseStock;
