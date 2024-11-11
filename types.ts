export type DiscountType = "FREE_SHIPPING" | "FREE_CHEAP_ITEM" | "PERCENTAGE_OR_FIXED";
export type FormType =
  | "FREQ_BOUGHT_TOGETHER"
  | "PRODUCT_ADDONS"
  | "CART_ADDONS"
  | "UPSELL_DOWNSELL"
  | "POST_PURCH_UPSELL"
  | "THANKS_PAGE_ADDONS";
export type TriggerType = "SPECIFIC_PRODUCTS" | "TAGS" | "ALL_PRODUCTS";
export type OfferProductsType = "MANUAL" | "AUTOMATIC";

export interface Product {
  id: string;
  name: string;
  url: string;
  imgURL: string;
  price: number;
  comparePrice: number | null;
  variantId: string;
  _id: string;
}

export interface PercentageFixValue {
  amount: number;
  unit: "PERCENT" | "FIXED";
}

export interface Discount {
  isEnabled: boolean;
  type: DiscountType;
  percentageFixValue: PercentageFixValue;
  discountText: string;
  discountCombinations: string[];
  _id: string;
}

export interface Offer {
  _id: string;
  formType: FormType;
  offerName: string;
  triggerType: TriggerType;
  specificTriggerProducts: Product[];
  tags: string[];
  offerProductsType: OfferProductsType;
  specificOfferProducts: Product[];
  AutomaticOfferProductsCount: number;
  discount: Discount;
  widgetTitle: string;
  offerPriority: number;
  storeURL: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type WindowType = Window &
  typeof globalThis & {
    Shopify: any;
    ShopifyAnalytics: any;
    vw_upsell_crosssell: {
      freqBoughtTogetherBlockPresent: true;
    };
  };

export type SelectableOfferProduct = Product & {
  checked: boolean;
  disabled: boolean;
};

export interface XMLHttpRequestType {
  _method?: string;
  _url?: string;
}

interface CartItem {
  product_id: number;
  variant_id: number;
  id: string;
  image: string;
  price: string;
  presentment_price: number;
  quantity: number;
  title: string;
  product_title: string;
  variant_title: string | null;
  vendor: string;
  product_type: string;
  url: string;
  view_key: string;
}

export interface Cart {
  token: string;
  original_total_price?: number;
  total_price?: number;
  total_discount?: number;
  total_weight?: number;
  item_count: number;
  items: CartItem[];
  currency: string;
  items_subtotal_price: number;
  items_added: CartItem[];
  items_removed: CartItem[];
}
