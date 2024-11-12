import { validateAndFetchDiscount } from "./validateAndFetchDisocunt";

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
          console.log("cartUrl: ", cartUrl);

          const cartRes = await fetch(cartUrl, {
            headers: {
              "Content-Type": "application/json",
              "X-Shopify-Storefront-Access-Token": shopifyStoreFrontAccessToken,
            },
          });

          const cartData = await cartRes.json();

          // if change is detected then check if discount code is still applicable
          await validateAndFetchDiscount(cartData);
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

      console.log("Fetching url: ", url);

      const res = await originalFetch(url, opts);

      console.log("Fetching url: ", url, "finished");
      console.log("res: ", res);

      if (res && res.ok && cartRequestPaths.some((path) => url.toString().includes(path))) {
        const resData = await res.clone().json();
        await validateAndFetchDiscount(resData, url.toString());
        console.log("awaiting validate");
      }

      return res;
    };
  } catch (error) {
    console.log("error in cart change listeners: ", error);
  }
};
