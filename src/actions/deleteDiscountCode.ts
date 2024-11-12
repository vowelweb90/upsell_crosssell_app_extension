import toast from "react-hot-toast";

export const deleteDiscountCode = async (discountCodeId: string) => {
  try {
    console.log("discountCodeId: ", discountCodeId);
    const shopDomain = import.meta.env.PROD
      ? window.location.host
      : import.meta.env.VITE_DEV_STORE + ".myshopify.com";
    const url = `https://${shopDomain}/apps/upsell_crosssell/api/discounts/${discountCodeId.replace(
      "gid://shopify/DiscountCodeNode/",
      ""
    )}`;

    //  Delete Discount Codes
    const res = await fetch(url, {
      method: "DELETE",
    });

    const data = await res.json();

    return { success: res.ok, discountDeleteData: data };
  } catch (error) {
    toast.error("Something went wrong. Please try again.");
    console.log("Error: ", error);
    return { success: false };
  }
};

export default deleteDiscountCode;
