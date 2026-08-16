import { useSelector } from "react-redux";
import { selectUser } from "@/redux/user/selectors";
import StatCard from "@/components/StatCard";
import { SHOP_OWNER_DASHBOARD_TEXT } from "@/constant/home";
import { FONT_DISPLAY, FONT_SANS } from "@/constant/common";

const ShopOwnerDashboard = () => {
  const { firstName, lastName, username } = useSelector(selectUser);
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || username;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-6">
      <div>
        <h1
          className="text-2xl font-bold text-surface-900"
          style={{ fontFamily: FONT_DISPLAY }}
        >
          {SHOP_OWNER_DASHBOARD_TEXT.TITLE}
          {fullName ? ` — ${fullName}` : ""}
        </h1>
        <p
          className="text-sm text-surface-500 mt-1"
          style={{ fontFamily: FONT_SANS }}
        >
          {SHOP_OWNER_DASHBOARD_TEXT.SUBTITLE}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon="pi-shopping-bag"
          label={SHOP_OWNER_DASHBOARD_TEXT.STAT_PENDING_ORDERS}
          value="0"
        />
        <StatCard
          icon="pi-box"
          label={SHOP_OWNER_DASHBOARD_TEXT.STAT_PRODUCTS_LISTED}
          value="0"
        />
        <StatCard
          icon="pi-dollar"
          label={SHOP_OWNER_DASHBOARD_TEXT.STAT_REVENUE}
          value="$0"
        />
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 p-6 text-center">
        <i className="pi pi-chart-line text-2xl text-surface-300" />
        <p
          className="text-sm text-surface-500 mt-3"
          style={{ fontFamily: FONT_SANS }}
        >
          {SHOP_OWNER_DASHBOARD_TEXT.EMPTY_STATE}
        </p>
      </div>
    </div>
  );
};

export default ShopOwnerDashboard;
