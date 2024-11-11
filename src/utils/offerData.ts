import { Offer } from "../../types";

export const offers: Offer[] = [
  {
    _id: "672b1d459a398dc32318a0ba",
    formType: "FREQ_BOUGHT_TOGETHER",
    offerName: "Test offer 2",
    triggerType: "SPECIFIC_PRODUCTS",
    specificTriggerProducts: [
      {
        id: "gid://shopify/Product/7823628435545",
        name: "The Collection Snowboard: Liquid",
        url: "https://samirbante-vw.myshopify.com/products/the-collection-snowboard-liquid",
        imgURL:
          "https://cdn.shopify.com/s/files/1/0618/6916/2585/files/Main_b13ad453-477c-4ed1-9b43-81f3345adfd6.jpg?v=1730877288",
        price: 749.95,
        comparePrice: null,
        variantId: "gid://shopify/ProductVariant/41965652803673",
        _id: "672b1d459a398dc32318a0bb",
      },
      {
        id: "gid://shopify/Product/7823628304473",
        name: "The Collection Snowboard: Oxygen",
        url: "https://samirbante-vw.myshopify.com/products/the-collection-snowboard-oxygen",
        imgURL:
          "https://cdn.shopify.com/s/files/1/0618/6916/2585/files/Main_d624f226-0a89-4fe1-b333-0d1548b43c06.jpg?v=1730877287",
        price: 1025,
        comparePrice: null,
        variantId: "gid://shopify/ProductVariant/41965652672601",
        _id: "672b1d459a398dc32318a0bc",
      },
    ],
    tags: [],
    offerProductsType: "MANUAL",
    specificOfferProducts: [
      {
        id: "gid://shopify/Product/7823628304473",
        name: "The Collection Snowboard: Oxygen",
        url: "https://samirbante-vw.myshopify.com/products/the-collection-snowboard-oxygen",
        imgURL:
          "https://cdn.shopify.com/s/files/1/0618/6916/2585/files/Main_d624f226-0a89-4fe1-b333-0d1548b43c06.jpg?v=1730877287",
        price: 1025,
        comparePrice: 0,
        variantId: "gid://shopify/ProductVariant/41965652672601",
        _id: "672b1d459a398dc32318a0bd",
      },
      {
        id: "gid://shopify/Product/7823628173401",
        name: "The Compare at Price Snowboard",
        url: "https://samirbante-vw.myshopify.com/products/the-compare-at-price-snowboard",
        imgURL:
          "https://cdn.shopify.com/s/files/1/0618/6916/2585/files/snowboard_sky.png?v=1730877287",
        price: 785.95,
        comparePrice: 885.95,
        variantId: "gid://shopify/ProductVariant/41965652312153",
        _id: "672b1d459a398dc32318a0be",
      },
    ],
    AutomaticOfferProductsCount: 2,
    discount: {
      isEnabled: true,
      type: "PERCENTAGE_OR_FIXED",
      percentageFixValue: {
        amount: 15,
        unit: "PERCENT",
      },
      discountText: "",
      discountCombinations: [],
      _id: "672b1d459a398dc32318a0bf",
    },

    widgetTitle: "",
    offerPriority: 2,
    storeURL: "upsell-crosssell-store.myshopify.com",
    createdAt: "2024-11-06T07:39:49.730Z",

    updatedAt: "2024-11-06T07:39:49.730Z",
    __v: 0,
  },
];

export default offers;
