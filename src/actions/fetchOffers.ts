import toast from "react-hot-toast";
import { Offer, WindowType } from "../../types";

export const fetchOffers = async (types: string[]) => {
  const windowObj = window as WindowType;
  const productId = import.meta.env.PROD
    ? windowObj.ShopifyAnalytics.meta.product.gid
    : "gid://shopify/Product/9666044035377";
  const shopURL = import.meta.env.PROD
    ? window.location.host
    : import.meta.env.VITE_DEV_STORE + ".myshopify.com";
  try {
    const encodedShopURL = encodeURIComponent(shopURL);
    const encodedProductId = encodeURIComponent(productId);

    if (productId) {
      const res = await fetch(
        `https://${shopURL}/apps/upsell_crosssell/api/offers?productId=${encodedProductId}&formTypes=${types}&shopUrl=${encodedShopURL}`
      );

      const data: Offer[] = await res.json();
      console.log("data: ", data);

      return { data, productId };
    } else return { data: [], productId };
  } catch (error) {
    toast.error("Something went wrong. Please try again.");
    console.error("Error fetching data: ", error);
    return { data: [], productId };
  }
};

export default fetchOffers;
