import { SelectableOfferProduct } from "../../types";
import { rupeeFormatter } from "../utils/lib";

export default function OfferProductsList({
  product,
  onChange,
}: {
  onChange: (id: string, checked: boolean) => void;
  product: SelectableOfferProduct;
}) {
  console.log('product: ', product);
  return (
    <div className="w-full rounded-md p-2 border border-gray-300 flex">
      {/* CheckBox */}
      <input
        disabled={product.disabled}
        checked={product.checked}
        onChange={() => onChange(product._id, !product.checked)}
        className="px-2"
        type="checkbox"
      />

      {/* Image */}
      <div className="max-w-[5em]">
        <img src={product.imgURL} alt="" />
      </div>
      <div className="flex flex-col text-[0.875em]">
        <span>{product?.name?.length > 24 ? product.name.slice(0, 25) + "..." : product.name || ""}</span>
        <span>{rupeeFormatter(product.price)}</span>
      </div>
    </div>
  );
}
