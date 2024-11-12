import FreqBoughtTogether from "./components/FreqBoughtTogether";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { WindowType } from "../types";
import { registerCartChangeListeners } from "./utils/lib";

function App() {
  const productsPath = "/products";
  const cartPath = "/cart";
  const [path, setPath] = useState<"/cart" | "/products">(cartPath);
  const [freqBoughtTogetherBlockPresent, setFreqBoughtTogetherBlockPresent] = useState(false);

  useEffect(() => {
    console.log("App loaded");
    const windowObj = window as WindowType;
    if (import.meta.env.PROD) {
      if (windowObj.vw_upsell_crosssell?.freqBoughtTogetherBlockPresent) {
        console.log("Detected Frequently Bought Together App Block");
        console.log("Aborting installing Frequently Bought Together widget from App Embed block.");
        setFreqBoughtTogetherBlockPresent(true);
      }

      if (
        windowObj.ShopifyAnalytics.meta.page.pageType === "product" ||
        window.location.href.includes(productsPath)
      ) {
        console.log("Path set to products");
        setPath(productsPath);
      }

      console.log("Registered Cart change listeners");
      registerCartChangeListeners(import.meta.env.VITE_STOREFRONT_ACCESS_TOKEN || "");
    }
  }, []);

  return (
    <div>
      <Toaster position="bottom-right" />
      {import.meta.env.PROD && path === productsPath && !freqBoughtTogetherBlockPresent ? (
        <FreqBoughtTogether />
      ) : (
        import.meta.env.DEV && (
          <div className="flex w-full justify-center">
            <div className="w-[350px]">
              <FreqBoughtTogether />
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default App;
