import { Cart, ResponseDiscountData } from "../../types";

export function detectDeleteOrQuantityChange(discountData: ResponseDiscountData, cartData: Cart) {
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
