import { useSelector } from "react-redux";
import { selectUser } from "@/redux/user/selectors";

function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 px-5 py-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center flex-shrink-0">
        <i className={`pi ${icon} text-gold-600 text-base`} />
      </div>
      <div>
        <p
          className="text-lg font-bold text-surface-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {value}
        </p>
        <p
          className="text-xs text-surface-500"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

const ShopOwnerDashboard = () => {
  const { firstName, lastName, username } = useSelector(selectUser);
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || username;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-6">
      <div>
        <h1
          className="text-2xl font-bold text-surface-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Shop dashboard{fullName ? ` — ${fullName}` : ""}
        </h1>
        <p
          className="text-sm text-surface-500 mt-1"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Overview of your shop&apos;s activity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon="pi-shopping-bag" label="Pending orders" value="0" />
        <StatCard icon="pi-box" label="Products listed" value="0" />
        <StatCard icon="pi-dollar" label="Revenue this month" value="$0" />
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 p-6 text-center">
        <i className="pi pi-chart-line text-2xl text-surface-300" />
        <p
          className="text-sm text-surface-500 mt-3"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          No activity yet. Add products to start selling.
        </p>
      </div>
    </div>
  );
};

export default ShopOwnerDashboard;
