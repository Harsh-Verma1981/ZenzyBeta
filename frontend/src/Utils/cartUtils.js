export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // 1. Calculate the items price (Force Number on qty)
  state.itemsPrice = addDecimals(
    state.cartItems.reduce(
      (acc, item) => acc + item.price * Number(item.qty), 
      0
    )
  );

  // 2. Calculate the shipping price
  // Using Number(state.itemsPrice) because toFixed(2) returns a string
  state.shippingPrice = addDecimals(Number(state.itemsPrice) > 100 ? 0 : 10);

  // 3. Calculate the tax price (15% tax)
  state.taxPrice = addDecimals(Number((0.15 * Number(state.itemsPrice)).toFixed(2)));

  // 4. Calculate the total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  // Save the cart to localStorage
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};