import { Cart } from "../../types";

export const getCart = async () => {
  // Get Cart data for token to make up cart id.
  const shopUrl = `https://${window.location.host}`;
  const cartRes = await fetch(`${shopUrl}/cart.js`);
  const cartData: Cart = await cartRes.json();
  return cartData;
};
