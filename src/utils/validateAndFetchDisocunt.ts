import { Cart, ResponseDiscountData, WindowType } from "../../types";
import deleteDiscountCode from "../actions/deleteDiscountCode";
import { updateCartDiscountCodes } from "../actions/updateCartDiscountCodes";
import { detectDeleteOrQuantityChange } from "./detectDeleteOrQuantityChange";

export const validateAndFetchDiscount = async (data: Cart, url: string = "") => {
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

  console.log("url in validate: ", url);
  console.log("resData from cart change", data);

  const appDiscountKey = import.meta.env.VITE_APP_NAME + "-discount";
  const windowObj = window as WindowType;
  const discountData: ResponseDiscountData = localStorage.getItem(appDiscountKey)
    ? JSON.parse(localStorage.getItem(appDiscountKey)!)
    : null;

  if (discountData) {
    const { isQuantityChange, isDeleteChange } = detectDeleteOrQuantityChange(discountData, data);

    if (isQuantityChange || isDeleteChange) {
      const { success } = await deleteDiscountCode(discountData.id);
      if (success) {
        localStorage.removeItem(appDiscountKey);

        // set discountDeleted to true
        windowObj.vw_upsell_crosssell = { ...windowObj.vw_upsell_crosssell, discountDeleted: true };

        console.log("url: ", url);
        console.log("isQuantityChange: ", isQuantityChange);

        // when shopify fetches new cart data
        // delete the codes so that the codes will not be displayed
        if (isQuantityChange && windowObj.vw_upsell_crosssell.discountDeleted) {
          // update the discount codes in cart
          const success = await updateCartDiscountCodes(
            { code: "" } as ResponseDiscountData,
            data.token
          );
          if (success) {
            windowObj.vw_upsell_crosssell.discountDeleted = false;
            window.location.reload();
          }
        }

        console.log("update codes finished");
      }
    }
  }
  console.log("validate finished");
};
