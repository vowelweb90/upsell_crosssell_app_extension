import toast from "react-hot-toast";
import { cardDiscountCodesUpdate } from "../graphql/mutations/cardDiscountCodesUpdate";
import { cart } from "../graphql/queries/cart";

export const updateCartDiscountCodes = async (discountData: { discountCodes: string[] }) => {
  try {
    const shopUrl = `https://${window.location.host}`;
    const storeFrontAccessToken = import.meta.env.VITE_STOREFRONT_ACCESS_TOKEN;
    const headers = {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storeFrontAccessToken,
    };

    // Get Cart data for token to create cart id.
    const cartRes = await fetch(`${shopUrl}/cart.js`);
    const cartData = await cartRes.json();

    console.log("cartData: ", cartData);

    const cartId = "gid://shopify/Cart/" + cartData.token;
    const cartReqData = {
      query: cart,
      variables: {
        id: cartId,
      },
    };

    console.log("cartId: ", cartId);

    // Check Cart Exists
    const cartIdRes = await fetch(`${shopUrl}/api/2024-10/graphql.json`, {
      method: "POST",
      headers,
      body: JSON.stringify(cartReqData),
    });

    if (!cartIdRes.ok) console.log("CartId Res", cartIdRes, await cartIdRes.json());

    const cartDiscountCodesUpdate = {
      query: cardDiscountCodesUpdate,
      variables: {
        discountCodes: discountData.discountCodes,
        id: cartId,
      },
    };

    const updateCartRes = await fetch(`${shopUrl}/api/2024-10/graphql.json`, {
      method: "POST",
      headers,
      body: JSON.stringify(cartDiscountCodesUpdate),
    });

    if (!updateCartRes.ok) toast.error("Something went wrong. please try again.");

    return updateCartRes.ok;
  } catch (error) {
    console.log("error", error);
    toast.error("Something went wrong. Please try again.");
    return false;
  }
};
