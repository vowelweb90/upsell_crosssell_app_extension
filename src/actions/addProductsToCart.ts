import toast from "react-hot-toast";
import { SelectableOfferProduct, WindowType } from "../../types";

export const addProductsToCart = async (products: SelectableOfferProduct[]) => {
  try {
    const items = products
      .filter((p) => p.checked)
      .map((p) => {
        const id = p.variantId
          ? Number(p.variantId.replace("gid://shopify/ProductVariant/", ""))
          : p._id.replace("gid://shopify/Product/", "");
        return {
          id,
          quantity: 1,
        };
      });

    console.log("items: ", items);

    const windowObj = window as WindowType;

    const res = await fetch(windowObj.Shopify.routes.root + "cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    });
    console.log("res: ", res);

    const data = await res.json();

    console.log("data: ", data);

    if (res.status >= 400) toast.error("Something went wrong. please try again.");
    else if (res.status >= 500) toast.error("Server Error");
    else if (data.error) toast.error(data.error);

    if (res.ok) toast.success("Products added to cart");

    return data;
  } catch (error) {
    toast.error("Something went wrong. Please try again.");
    console.error("Error fetching data: ", error);
  }
};

export default addProductsToCart;
