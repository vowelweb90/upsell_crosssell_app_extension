import { Cart, ResponseDiscountData } from "../../types";
import { deleteDiscountCode } from "../actions/deleteDiscountCode";
import { updateCartDiscountCodes } from "../actions/updateCartDiscountCodes";

const IntlFormat = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

const IntlPercentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
});

export const rupeeFormatter = (amount: number) => {
  return IntlFormat.format(amount);
};

export const percentFormatter = (amount: number) => {
  return IntlPercentFormatter.format(amount / 100);
};

const appDiscountKey = "vw-upsell-crosssell-discount";

function detectDeleteOrQuantityChange(discountData: ResponseDiscountData, cartData: Cart) {
  const deletedProducts = [];
  let isQuantityChange = false;

  if (discountData) {
    for (const offerProduct of discountData.items) {
      // if offerProduct is not found then isDeleted will remain true
      // if offerProduct is found then isdeleted will be true
      let isDeleted = true;

      for (const cartItem of cartData.items) {
        if (
          cartItem.id.toString() ===
          offerProduct.variantId.replace("gid://shopify/ProductVariant/", "")
        )
          isDeleted = false;

        if (cartItem.quantity > 1) {
          console.log("quantity is changed");
          isQuantityChange = true;
          return { isDeleteChange: !!deletedProducts.length, isQuantityChange };
        }
      }

      if (deletedProducts.length) console.log(offerProduct.variantId, " is Deleted: ", isDeleted);

      // if product not found then it is deleted
      // add product id to deletedproducts
      if (isDeleted) deletedProducts.push(offerProduct.variantId);
    }
  }

  return { isDeleteChange: !!deletedProducts.length, isQuantityChange };
}

const validateAndFetchDiscount = async (data: Cart, url: string = "") => {
  console.log('url in validate: ', url);
  console.log("resData from cart change", data);

  // 1. Detect products that we applied discount to
  //
  // 2. Detect if products were deleted
  //    a. if products were deleted
  //    b. Delete discount code
  //
  // 3. If products were not deleted instead a quantity was updated
  //    a. Check if quantity of products that we applied discount to is updated
  //    b. if quantity is greater than 1 then delete the discount code
  //
  // 4. Delete discount data in localStorage

  const discountData: ResponseDiscountData = localStorage.getItem(appDiscountKey)
    ? JSON.parse(localStorage.getItem(appDiscountKey)!)
    : null;

  if (discountData) {
    const { isQuantityChange, isDeleteChange } = detectDeleteOrQuantityChange(discountData, data);
    console.log("isQuantityChange : ", isQuantityChange);
    console.log("isDeleteChange : ", isDeleteChange);

    if (isQuantityChange || isDeleteChange) {
      if (isQuantityChange) {
        await updateCartDiscountCodes({ ...discountData, code: "" });
        console.log("updated cart contents");
      }
      const { success } = await deleteDiscountCode(discountData.id);
      if (success) localStorage.removeItem(appDiscountKey);
    }
  }
  console.log("validate finished");
};

export const registerCartChangeListeners = (shopifyStoreFrontAccessToken: string) => {
  try {
    // Cart change paths
    const cartRequestPaths = ["/cart.js", "/cart/update", "/cart/change"];

    // Store original open function
    const open = window.XMLHttpRequest.prototype.open;

    // Override open function with our custom open function
    window.XMLHttpRequest.prototype.open = function () {
      console.log("request opened");

      // Add an event listener for load function on XMLHttpRequest
      this.addEventListener("load", async function () {
        // On request completion check if the url contains the cart change or update path
        // @ts-expect-error : '_url' field may or may not exist in XMLHttpRequest
        if (this._url && cartRequestPaths.some((path) => this._url.includes(path))) {
          const cartUrl = `https://${window.location.host}/cart.js`;
          console.log('cartUrl: ', cartUrl);

          const cartRes = await fetch(cartUrl, {
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Storefront-Access-Token": shopifyStoreFrontAccessToken,
            },
          });

          const cartData = await cartRes.json();

          // if change is detected then check if discount code is still applicable
          validateAndFetchDiscount(cartData);
        }
      });

      // apply the original open function with the window.XMLHttpRequest context.
      // @ts-expect-error: arguments may or may not exist
      return open.apply(this, rest);
    };

    // store original fetch function
    const { fetch: originalFetch } = window;

    window.fetch = async (...fetchArguments) => {
      const [url, opts] = fetchArguments;

      const res = await originalFetch(url, opts);

      if (res && res.ok && cartRequestPaths.some((path) => url.toString().includes(path))) {
        const resData = await res.clone().json();
        validateAndFetchDiscount(resData, url.toString());
      }

      return res;
    };
  } catch (error) {
    console.log("error in cart change listeners: ", error);
  }
};
