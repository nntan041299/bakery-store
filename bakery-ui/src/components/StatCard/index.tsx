import { FONT_DISPLAY, FONT_SANS } from "@/constant/common";

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  iconBgClassName?: string;
  iconColorClassName?: string;
}

const StatCard = ({
  icon,
  label,
  value,
  iconBgClassName = "bg-gold-100",
  iconColorClassName = "text-gold-600",
}: StatCardProps) => {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 px-5 py-4 flex items-center gap-4">
      <div
        className={`w-10 h-10 rounded-xl ${iconBgClassName} flex items-center justify-center flex-shrink-0`}
      >
        <i className={`pi ${icon} ${iconColorClassName} text-base`} />
      </div>
      <div>
        <p
          className="text-lg font-bold text-surface-900"
          style={{ fontFamily: FONT_DISPLAY }}
        >
          {value}
        </p>
        <p
          className="text-xs text-surface-500"
          style={{ fontFamily: FONT_SANS }}
        >
          {label}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
