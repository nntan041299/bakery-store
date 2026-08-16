import { FONT_SANS } from "@/constant/common";
import { PRODUCTS_TEXT } from "@/constant/products";

interface StatusBadgeProps {
  active: boolean;
}

const StatusBadge = ({ active }: StatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
        active ? "bg-sage-100 text-sage-700" : "bg-surface-100 text-surface-500"
      }`}
      style={{ fontFamily: FONT_SANS }}
    >
      {active
        ? PRODUCTS_TEXT.STATUS_ACTIVE_BADGE
        : PRODUCTS_TEXT.STATUS_INACTIVE_BADGE}
    </span>
  );
};

export default StatusBadge;
