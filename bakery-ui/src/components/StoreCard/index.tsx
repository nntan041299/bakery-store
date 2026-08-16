import { Store } from "@/service/store";
import { STORES_TEXT } from "@/constant/stores";
import { FONT_DISPLAY, FONT_SANS } from "@/constant/common";

interface StoreCardProps {
  store: Store;
}

const StoreCard = ({ store }: StoreCardProps) => {
  const initial = store.name.trim() ? store.name.trim()[0].toUpperCase() : "?";

  return (
    <div className="bg-white rounded-2xl border border-surface-200 px-4 py-4 flex items-center gap-3">
      <div
        className="w-11 h-11 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center
                   text-base font-bold flex-shrink-0"
        style={{ fontFamily: FONT_DISPLAY }}
      >
        {initial}
      </div>
      <div className="min-w-0">
        <p
          className="text-sm font-semibold text-surface-900 truncate"
          style={{ fontFamily: FONT_SANS }}
        >
          {store.name}
        </p>
        <p
          className="text-xs text-surface-500 mt-0.5"
          style={{ fontFamily: FONT_SANS }}
        >
          {STORES_TEXT.PRODUCT_COUNT(store.productCount)}
        </p>
      </div>
    </div>
  );
};

export default StoreCard;
