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
      <div className="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center flex-shrink-0">
        <i className={`pi ${icon} text-sage-600 text-base`} />
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

const CustomerDashboard = () => {
  const { firstName, lastName, username, email } = useSelector(selectUser);
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || username;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-6">
      <div>
        <h1
          className="text-2xl font-bold text-surface-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Welcome back{fullName ? `, ${fullName}` : ""}
        </h1>
        <p
          className="text-sm text-surface-500 mt-1"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {email ?? "Here's what's happening with your bakery orders."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon="pi-shopping-bag" label="Active orders" value="0" />
        <StatCard icon="pi-check-circle" label="Completed orders" value="0" />
        <StatCard icon="pi-heart" label="Saved favorites" value="0" />
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 p-6 text-center">
        <i className="pi pi-shopping-cart text-2xl text-surface-300" />
        <p
          className="text-sm text-surface-500 mt-3"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          You haven&apos;t placed any orders yet. Browse the menu to get
          started.
        </p>
      </div>
    </div>
  );
};

export default CustomerDashboard;
