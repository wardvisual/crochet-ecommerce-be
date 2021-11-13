import tax from "../config/tax";

const calculateTaxAmount = (order) => {
  const taxRate = tax.stateTaxRate;

  order.totalTax = 0;

  if (order.products && order.products.length > 0) {
    order.products.map((item) => {
      if (item.product) {
        if (item.product.taxable) {
          const price = Number(item.product.price).toFixed(2);
          const taxAmount = Math.round(price * taxRate * 100) / 100;
          item.priceWithTax = parseFloat(price) + parseFloat(taxAmount);
          order.totalTax += taxAmount;
        }

        item.totalPrice = parseFloat(item.totalPrice.toFixed(2));
      }
    });
  }

  order.totalWithTax = order.total + order.totalTax;

  order.total = parseFloat(Number(order.total.toFixed(2)));
  order.totalTax = parseFloat(
    Number(order.totalTax && order.totalTax.toFixed(2))
  );
  order.totalWithTax = parseFloat(Number(order.totalWithTax.toFixed(2)));
  return order;
};

export default calculateTaxAmount;
