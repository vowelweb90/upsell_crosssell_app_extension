import { FormEvent, FormEventHandler, useEffect, useState } from "react";
import { Offer, Product, SelectableOfferProduct, WindowType } from "../../types";
import { percentFormatter, rupeeFormatter } from "../utils/lib";
import { Plus } from "lucide-react";
import OfferProductsList from "./OfferProductsList";
import { fetchOffers } from "../actions/fetchOffers";
import toast from "react-hot-toast";
import addProductsToCart from "../actions/addProductsToCart";
import createDiscountCode from "../actions/createDiscountCode";
import { updateCartDiscountCodes } from "../actions/updateCartDiscountCodes";
import { getProduct } from "../actions/getProduct";

export default function FreqBoughtTogether() {
  const [offer, setOffer] = useState<Offer | null | undefined>();
  // const [_offers, setOffers] = useState<Offer[]>([]);
  const [offerIsApplied, setOfferIsApplied] = useState(true);
  const [selectedOfferProducts, setSelectedOfferProducts] = useState<SelectableOfferProduct[]>([]);
  const totalPrice =
    selectedOfferProducts.reduce((acc, p) => (p.checked ? p.price + acc : acc), 0) || 0;
  const [discountAmount, setDiscountAmount] = useState(0);
  const discountedTotalPrice =
    offerIsApplied && offer?.discount?.type ? totalPrice - discountAmount : totalPrice;
  const types = [
    "FREQ_BOUGHT_TOGETHER",
    "PRODUCT_ADDONS",
    "CART_ADDONS",
    "UPSELL_DOWNSELL",
    "POST_PURCH_UPSELL",
    "THANKS_PAGE_ADDONS",
  ];
  const handleOfferProductOnChange = (id: string, checked: boolean) => {
    if (checked) setOfferIsApplied(true);
    else setOfferIsApplied(false);

    // set offer checked to new boolean value
    // but if checked is false then disabled the offer(offerIsApplied) and
    // set other offer products disabled value to true
    // so that all other select becomes disabled
    // except the offer product that was clicked.
    // so that user can change his mind
    setSelectedOfferProducts(
      selectedOfferProducts.map((op) =>
        op._id === id
          ? { ...op, checked: !op.checked }
          : { ...op, disabled: checked ? false : true }
      )
    );
  };

  const handleOnSubmit: FormEventHandler<HTMLFormElement> = async (event: FormEvent) => {
    event.preventDefault();

    try {
      if (offerIsApplied && offer) {
        // Create discount for offer products
        if (offer.discount?.type) {
          const { success, discountData } = await createDiscountCode(
            offer,
            selectedOfferProducts,
            totalPrice
          ); // If discount codes were successfully created
          if (success && discountData && import.meta.env.PROD) {
            // Save discount data to localStorage
            localStorage.setItem("vw-upsell-crosssell-discount", JSON.stringify(discountData));

            // Add Offer Products to cart
            await addProductsToCart(selectedOfferProducts);

            // Update discount codes in cart
            await updateCartDiscountCodes(discountData);

            // Navigate to Cart
            if (success) window.location.href = "/cart";
          }
        } else {
          // Add Offer Products to cart
          await addProductsToCart(selectedOfferProducts);

          // Navigate to Cart
          window.location.href = "/cart";
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.log("error: ", error);
    }
  };

  const _fetchOffers = async () => {
    try {
      const { data: offersData, productId } = await fetchOffers(types);

      // setOffers(offersData || []);
      offersData.sort((a, b) => b.offerPriority - a.offerPriority);

      console.log("sortedOffers: ", offersData);
      if (offersData?.length) {
        setOffer(offersData[0]);
        if (offersData[0].specificOfferProducts.length) {
          if (offersData[0].triggerType === "TAGS") {
            const windowObj = window as WindowType
            const product = await getProduct(windowObj.ShopifyAnalytics.meta.product.id)
            let selectableOfferProducts = []
            let currentProduct = null;
            if (product.tags.some(t => offersData[0].tags?.includes(t))) {
              // 
              selectableOfferProducts = offersData[0].specificOfferProducts
                .filter((p: Product) => p.id !== productId)
                .map((op: Product) => ({
                  ...op,
                  disabled: false,
                  checked: true,
                })) as SelectableOfferProduct[];
            }
          }
          if (offersData[0].triggerType === "SPECIFIC_PRODUCTS") {
            selectableOfferProducts = offersData[0].specificOfferProducts
              .filter((p: Product) => p.id !== productId)
              .map((op: Product) => ({
                ...op,
                disabled: false,
                checked: true,
              })) as SelectableOfferProduct[];

            currentProduct = {
              ...offersData[0].specificTriggerProducts.filter((p) => p.id === productId)[0],
              disabled: false,
              checked: true,
            } as SelectableOfferProduct;

            setSelectedOfferProducts([currentProduct, ...selectableOfferProducts]);
          }
        }
      }


    } catch (error) {
      console.log("error: ", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    // If extension is deployed then fetch data from app
    if (import.meta.env.PROD) {
      _fetchOffers();
    }
    // if extension is not deployed then use hardcoded data
    else {
      import("../utils/offerData").then((module) => {
        module.offers.sort((a, b) => b.offerPriority - a.offerPriority);
        console.log('module.offers: ', module.offers);
        setOffer(module.offers[0]);
        if (module.offers[0]?.specificOfferProducts?.length) {
          const productId = "gid://shopify/Product/7823628435545";

          const selectableOfferProducts = module.offers[0].specificOfferProducts
            .filter((p: Product) => p.id !== productId)
            .map((op: Product) => ({
              ...op,
              disabled: false,
              checked: true,
            })) as SelectableOfferProduct[];

          const currentProduct = {
            ...module.offers[0].specificTriggerProducts.filter((p) => p.id === productId)[0],
            disabled: false,
            checked: true,
          } as SelectableOfferProduct;

          setSelectedOfferProducts([currentProduct, ...selectableOfferProducts]);
        }
      });
    }
  }, []);

  useEffect(() => {
    let amount = 0;
    if (offer) {
      if (offer?.discount) {
        if (
          offer.discount.type === "PERCENTAGE_OR_FIXED" &&
          offer.discount.percentageFixValue.unit === "PERCENT"
        ) {
          amount = (offer.discount.percentageFixValue.amount / 100) * totalPrice;
        } else if (
          offer.discount.type === "PERCENTAGE_OR_FIXED" &&
          offer.discount.percentageFixValue.unit === "FIXED"
        ) {
          amount = offer.discount.percentageFixValue.amount;
        }
        setDiscountAmount(amount);
      }
    }
  }, [offer]);

  if (!offer) return null;

  return (
    <form onSubmit={handleOnSubmit} className="flex flex-col w-full space-y-[16px] text-gray-800">
      <div className="flex flex-col">
        {/* Widget Title */}
        <h3 className=" font-medium mb-1 text-gray-700 text-[1.3em]">Frequently Bought Together</h3>

        {/* Widget subtitle */}
        {offerIsApplied && <p>Text below widget title.</p>}
      </div>

      {/* Offer Products */}
      <div className="flex flex-col items-center">
        {offer.offerProductsType === "MANUAL" &&
          !!selectedOfferProducts.length &&
          selectedOfferProducts.map((p, i) => (
            <div key={i} className="w-full">
              {/* Offer Product */}
              <OfferProductsList onChange={handleOfferProductOnChange} product={p} />

              {/* Plus Icon */}
              {(i < offer.specificOfferProducts.length - 1 ||
                i < offer.specificOfferProducts.length) && (
                  <div className="flex w-full justify-center items-center">
                    <Plus className="size-[1em] py-0.5" />
                  </div>
                )}
            </div>
          ))}
      </div>

      <div className="flex flex-col space-y-2">
        {/* Total Price and Discounted Price */}
        <span className="space-x-2">
          <span> Total price</span>
          <span>{rupeeFormatter(discountedTotalPrice)}</span>
          {offerIsApplied && offer.discount?.type && (
            <span className="line-through text-[0.8em]">{rupeeFormatter(totalPrice)}</span>
          )}
        </span>
        {offerIsApplied && offer?.discount?.type === "PERCENTAGE_OR_FIXED" && (
          <span className="text-[80%]">
            ({" "}
            {offer?.discount?.percentageFixValue?.unit === "PERCENT"
              ? percentFormatter(offer?.discount?.percentageFixValue.amount)
              : rupeeFormatter(discountAmount)}{" "}
            bundle offer on checkout )
          </span>
        )}
        <button
          disabled={!offerIsApplied}
          type="submit"
          className={`w-full text-[15px] border rounded-sm p-5 mt-6${!offerIsApplied
            ? "text-gray-600 border-gray-400 border"
            : "text-black border-black hover:border-2"
            }`}
        >
          Add to Cart
        </button>
      </div>
    </form>
  );
}
