import Product from "../models/Product";

const decreaseStock = async (products) => {
  let bulkOptions = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: -item.quantity } },
      },
    };
  });

  await Product.bulkWrite(bulkOptions);
};

export default decreaseStock;
