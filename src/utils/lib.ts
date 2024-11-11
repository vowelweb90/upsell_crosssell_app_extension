import { Cart, XMLHttpRequestType } from "../../types";

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

const validateAndFetchDiscount = async (data: Cart | XMLHttpRequestType) => {
  console.log("resData from cart change", data);
};

export const registerCartChangeListeners = () => {
  // Cart change paths
  const cartRequestPaths = ["/cart/update", "/cart/change"];

  // Store original open function
  const open = window.XMLHttpRequest.prototype.open;

  // Override open function with our custom open function
  window.XMLHttpRequest.prototype.open = function () {
    console.log("request opened");

    // Add an event listener for load function on XMLHttpRequest
    this.addEventListener("load", function () {
      console.log("this", this);

      // On request completion check if the url contains the cart change or update path
      // @ts-expect-error : '_url' field may or may not exist in XMLHttpRequest
      if (this._url && cartRequestPaths.some((path) => this._url.includes(path))) {
        console.log("this._url: ", this);
        // if change is detected then check discount code is still applicable
        validateAndFetchDiscount(this as XMLHttpRequestType);
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
      console.log("url: ", url);
      const resData = await res.clone().json();
      validateAndFetchDiscount(resData);
    }

    return res;
  };
};
