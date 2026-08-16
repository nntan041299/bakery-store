import { ReactNode } from "react";
import { FONT_SANS } from "@/constant/common";

interface SectionCardProps {
  title: string;
  children: ReactNode;
}

const SectionCard = ({ title, children }: SectionCardProps) => {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-surface-100">
        <h2
          className="text-sm font-semibold text-surface-700 uppercase tracking-widest"
          style={{ fontFamily: FONT_SANS }}
        >
          {title}
        </h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
};

export default SectionCard;
