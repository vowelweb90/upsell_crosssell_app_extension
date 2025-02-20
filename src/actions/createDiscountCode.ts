import toast from "react-hot-toast";
import { Offer, ResponseDiscountData, SelectableOfferProduct, WindowType } from "../../types";

export const createDiscountCode = async (
  offer: Offer,
  selectableOfferProducts: SelectableOfferProduct[],
  totalPrice: number
): Promise<{ success: boolean; discountData?: ResponseDiscountData }> => {
  try {
    let value = null;
    const windowObj = window as WindowType;
    const productId = windowObj.ShopifyAnalytics.meta.product.gid;
    console.log("productId: ", productId);

    if (offer.discount?.type === "PERCENTAGE_OR_FIXED") {
      value = {
        type: offer.discount.percentageFixValue.unit,
        amount: offer.discount.percentageFixValue.amount,
      };
    }
    if (offer.discount?.type === "FREE_CHEAP_ITEM") {
      let lowestPrice = offer.specificOfferProducts?.length && offer.specificOfferProducts[0].price;
      offer.specificOfferProducts.forEach((o) => {
        if (o.price < lowestPrice) lowestPrice = o.price;
      });
      value = {
        type: "FIXED",
        amount: lowestPrice,
      };
    }

    const combinesWith = {
      productDiscounts: offer.discount?.discountCombinations.includes("productDiscounts") || false,
      orderDiscounts: offer.discount?.discountCombinations.includes("orderDiscounts") || false,
      shippingDiscounts:
        offer.discount?.discountCombinations.includes("shippingDiscounts") || false,
    };

    let items: string[] = [];

    if (offer.formType === "FREQ_BOUGHT_TOGETHER") {
      items = selectableOfferProducts.map((p) => p.id);
    } else items = [];

    const shopDomain = import.meta.env.PROD
      ? window.location.host
      : import.meta.env.VITE_DEV_STORE + ".myshopify.com";

    console.log("shopDomain: ", shopDomain);
    const shopUrl = `https://${shopDomain}`;

    const discountData = {
      title: offer.discount?.discountText || "",
      minimumQuantity: totalPrice,
      combinesWith,
      value,
      items,
      shop: shopDomain,
      triggerProduct: productId,
    };
    console.log("discountData.triggerProduct: ", discountData.triggerProduct);

    console.log("discountData: ", discountData);

    const url = `${shopUrl}/apps/upsell_crosssell/api/discounts`;

    //  Create Discount Codes
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discountData),
    });
    const data = await res.json();

    console.log("Discount response: ", data);

    if (res.status >= 400) toast.error("Something went wrong. please try again.");
    else if (res.status >= 500) toast.error("Server Error");
    else if (data.error) toast.error(data.error);

    return { success: res.ok, discountData: data };
  } catch (error) {
    toast.error("Something went wrong. Please try again.");
    console.log("Error: ", error);
    return { success: false };
  }
};

export default createDiscountCode;
