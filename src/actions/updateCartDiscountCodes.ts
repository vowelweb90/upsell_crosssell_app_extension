import toast from "react-hot-toast";
import { cardDiscountCodesUpdate } from "../graphql/mutations/cardDiscountCodesUpdate";
import { ResponseDiscountData } from "../../types";
import { getCart } from "./getCart";

export const updateCartDiscountCodes = async (
  discountData: ResponseDiscountData,
  cartToken: string = ""
) => {
  try {
    const shopUrl = `https://${window.location.host}`;
    const storeFrontAccessToken = import.meta.env.VITE_STOREFRONT_ACCESS_TOKEN;
    const headers = {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storeFrontAccessToken,
    };

    const cartGid = "gid://shopify/Cart/";

    let cartId = cartToken ? cartGid + cartToken : "";

    if (!cartToken) {
      // Get Cart data for token to make up cart id.
      const cartData = await getCart();
      cartId = cartGid + cartData.token;
    }

    const cartDiscountCodesUpdate = {
      query: cardDiscountCodesUpdate,
      variables: {
        discountCodes: discountData.code ? [discountData.code] : [],
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
